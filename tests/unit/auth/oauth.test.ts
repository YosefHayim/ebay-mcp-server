import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import nock from "nock";
import { EbayOAuthClient } from "../../../src/auth/oauth.js";
import type { EbayConfig, StoredTokenData } from "../../../src/types/ebay.js";
import {
  createMockTokens,
  createExpiredAccessToken,
  createFullyExpiredTokens,
} from "../../helpers/mock-token-storage.js";
import { mockOAuthTokenEndpoint, cleanupMocks } from "../../helpers/mock-http.js";

// Mock TokenStorage
const mockTokenStorage = {
  hasTokens: vi.fn(),
  loadTokens: vi.fn(),
  saveTokens: vi.fn(),
  clearTokens: vi.fn(),
  isAccessTokenExpired: vi.fn(),
  isRefreshTokenExpired: vi.fn(),
};

vi.mock("../../../src/auth/token-storage.js", () => ({
  TokenStorage: mockTokenStorage,
}));

describe("EbayOAuthClient", () => {
  let oauthClient: EbayOAuthClient;
  let config: EbayConfig;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    cleanupMocks();

    // Default config
    config = {
      clientId: "test_client_id",
      clientSecret: "test_client_secret",
      environment: "sandbox",
      redirectUri: "https://localhost/callback",
    };

    oauthClient = new EbayOAuthClient(config);
  });

  afterEach(() => {
    cleanupMocks();
  });

  describe("initialize", () => {
    it("should load user tokens from storage if available", async () => {
      const mockTokens = createMockTokens();
      mockTokenStorage.hasTokens.mockResolvedValue(true);
      mockTokenStorage.loadTokens.mockResolvedValue(mockTokens);

      await oauthClient.initialize();

      expect(mockTokenStorage.hasTokens).toHaveBeenCalledTimes(1);
      expect(mockTokenStorage.loadTokens).toHaveBeenCalledTimes(1);
      expect(oauthClient.hasUserTokens()).toBe(true);
    });

    it("should not load tokens if none are available", async () => {
      mockTokenStorage.hasTokens.mockResolvedValue(false);

      await oauthClient.initialize();

      expect(mockTokenStorage.hasTokens).toHaveBeenCalledTimes(1);
      expect(mockTokenStorage.loadTokens).not.toHaveBeenCalled();
      expect(oauthClient.hasUserTokens()).toBe(false);
    });

    it("should validate token scopes on initialization", async () => {
      // Mock console.warn to verify validation warnings
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const mockTokens = createMockTokens({
        scope: "https://api.ebay.com/oauth/api_scope/buy.browse", // Sandbox-only scope
      });

      mockTokenStorage.hasTokens.mockResolvedValue(true);
      mockTokenStorage.loadTokens.mockResolvedValue(mockTokens);

      // Using production environment, so sandbox scope should trigger warning
      const prodConfig = { ...config, environment: "production" as const };
      const prodOAuthClient = new EbayOAuthClient(prodConfig);

      await prodOAuthClient.initialize();

      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });
  });

  describe("hasUserTokens", () => {
    it("should return true when user tokens are set", async () => {
      const mockTokens = createMockTokens();
      mockTokenStorage.hasTokens.mockResolvedValue(true);
      mockTokenStorage.loadTokens.mockResolvedValue(mockTokens);

      await oauthClient.initialize();

      expect(oauthClient.hasUserTokens()).toBe(true);
    });

    it("should return false when no user tokens are set", () => {
      expect(oauthClient.hasUserTokens()).toBe(false);
    });
  });

  describe("getAccessToken", () => {
    it("should return valid user access token", async () => {
      const mockTokens = createMockTokens();
      mockTokenStorage.hasTokens.mockResolvedValue(true);
      mockTokenStorage.loadTokens.mockResolvedValue(mockTokens);
      mockTokenStorage.isAccessTokenExpired.mockReturnValue(false);

      await oauthClient.initialize();
      const token = await oauthClient.getAccessToken();

      expect(token).toBe(mockTokens.accessToken);
      expect(mockTokenStorage.isAccessTokenExpired).toHaveBeenCalledWith(mockTokens);
    });

    it("should refresh expired access token using valid refresh token", async () => {
      const expiredTokens = createExpiredAccessToken();
      const newAccessToken = "new_access_token";

      mockTokenStorage.hasTokens.mockResolvedValue(true);
      mockTokenStorage.loadTokens.mockResolvedValue(expiredTokens);
      mockTokenStorage.isAccessTokenExpired.mockReturnValue(true);
      mockTokenStorage.isRefreshTokenExpired.mockReturnValue(false);

      // Mock refresh token API call
      mockOAuthTokenEndpoint("sandbox", {
        access_token: newAccessToken,
        token_type: "Bearer",
        expires_in: 7200,
        refresh_token: expiredTokens.refreshToken,
        refresh_token_expires_in: 47304000,
      });

      await oauthClient.initialize();
      const token = await oauthClient.getAccessToken();

      expect(token).toBe(newAccessToken);
      expect(mockTokenStorage.saveTokens).toHaveBeenCalled();
    });

    it("should throw error when both access and refresh tokens are expired", async () => {
      const fullyExpiredTokens = createFullyExpiredTokens();

      mockTokenStorage.hasTokens.mockResolvedValue(true);
      mockTokenStorage.loadTokens.mockResolvedValue(fullyExpiredTokens);
      mockTokenStorage.isAccessTokenExpired.mockReturnValue(true);
      mockTokenStorage.isRefreshTokenExpired.mockReturnValue(true);

      await oauthClient.initialize();

      await expect(oauthClient.getAccessToken()).rejects.toThrow(
        "User authorization expired"
      );
      expect(mockTokenStorage.clearTokens).toHaveBeenCalled();
    });

    it("should fallback to client credentials when no user tokens", async () => {
      mockTokenStorage.hasTokens.mockResolvedValue(false);

      const clientToken = "client_credentials_token";
      mockOAuthTokenEndpoint("sandbox", {
        access_token: clientToken,
        token_type: "Bearer",
        expires_in: 7200,
      });

      await oauthClient.initialize();
      const token = await oauthClient.getAccessToken();

      expect(token).toBe(clientToken);
    });

    it("should reuse cached client credentials token if still valid", async () => {
      mockTokenStorage.hasTokens.mockResolvedValue(false);

      const clientToken = "client_credentials_token";
      mockOAuthTokenEndpoint("sandbox", {
        access_token: clientToken,
        token_type: "Bearer",
        expires_in: 7200,
      });

      await oauthClient.initialize();

      // First call - should fetch token
      const token1 = await oauthClient.getAccessToken();
      expect(token1).toBe(clientToken);

      // Second call - should use cached token (no new HTTP call)
      const token2 = await oauthClient.getAccessToken();
      expect(token2).toBe(clientToken);

      // Verify only one HTTP call was made
      expect(nock.pendingMocks().length).toBe(0);
    });
  });

  describe("setUserTokens", () => {
    it("should store user tokens", async () => {
      const accessToken = "user_access_token";
      const refreshToken = "user_refresh_token";

      await oauthClient.setUserTokens(accessToken, refreshToken);

      expect(mockTokenStorage.saveTokens).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken,
          refreshToken,
          tokenType: "Bearer",
        })
      );
      expect(oauthClient.hasUserTokens()).toBe(true);
    });

    it("should set expiry times when storing tokens", async () => {
      const accessToken = "user_access_token";
      const refreshToken = "user_refresh_token";
      const beforeTime = Date.now();

      await oauthClient.setUserTokens(accessToken, refreshToken);

      const savedTokens = mockTokenStorage.saveTokens.mock.calls[0][0] as StoredTokenData;

      expect(savedTokens.accessTokenExpiry).toBeGreaterThan(beforeTime);
      expect(savedTokens.refreshTokenExpiry).toBeGreaterThan(savedTokens.accessTokenExpiry);
    });
  });

  describe("exchangeCodeForToken", () => {
    it("should exchange authorization code for user tokens", async () => {
      const code = "authorization_code_12345";
      const accessToken = "exchanged_access_token";
      const refreshToken = "exchanged_refresh_token";

      mockOAuthTokenEndpoint("sandbox", {
        access_token: accessToken,
        token_type: "Bearer",
        expires_in: 7200,
        refresh_token: refreshToken,
        refresh_token_expires_in: 47304000,
        scope: "https://api.ebay.com/oauth/api_scope/sell.inventory",
      });

      const result = await oauthClient.exchangeCodeForToken(code);

      expect(result.access_token).toBe(accessToken);
      expect(result.refresh_token).toBe(refreshToken);
      expect(mockTokenStorage.saveTokens).toHaveBeenCalled();
      expect(oauthClient.hasUserTokens()).toBe(true);
    });

    it("should throw error if redirect URI is not configured", async () => {
      const configWithoutRedirect = { ...config, redirectUri: undefined };
      const clientWithoutRedirect = new EbayOAuthClient(configWithoutRedirect);

      await expect(
        clientWithoutRedirect.exchangeCodeForToken("code_12345")
      ).rejects.toThrow("Redirect URI is required");
    });

    it("should handle OAuth exchange errors", async () => {
      const code = "invalid_code";

      nock("https://api.sandbox.ebay.com")
        .post("/identity/v1/oauth2/token")
        .reply(400, {
          error: "invalid_grant",
          error_description: "Invalid authorization code",
        });

      await expect(oauthClient.exchangeCodeForToken(code)).rejects.toThrow(
        "Invalid authorization code"
      );
    });
  });

  describe("clearAllTokens", () => {
    it("should clear all tokens", async () => {
      const mockTokens = createMockTokens();
      mockTokenStorage.hasTokens.mockResolvedValue(true);
      mockTokenStorage.loadTokens.mockResolvedValue(mockTokens);

      await oauthClient.initialize();
      expect(oauthClient.hasUserTokens()).toBe(true);

      await oauthClient.clearAllTokens();

      expect(mockTokenStorage.clearTokens).toHaveBeenCalled();
      expect(oauthClient.hasUserTokens()).toBe(false);
    });
  });

  describe("getTokenInfo", () => {
    it("should return token status information", async () => {
      const mockTokens = createMockTokens({
        scope: "https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.fulfillment",
      });

      mockTokenStorage.hasTokens.mockResolvedValue(true);
      mockTokenStorage.loadTokens.mockResolvedValue(mockTokens);
      mockTokenStorage.isAccessTokenExpired.mockReturnValue(false);

      await oauthClient.initialize();
      const info = oauthClient.getTokenInfo();

      expect(info.hasUserToken).toBe(true);
      expect(info.hasClientToken).toBe(false);
      expect(info.scopeInfo).toBeDefined();
      expect(info.scopeInfo?.tokenScopes).toHaveLength(2);
    });

    it("should return info when no tokens are available", () => {
      const info = oauthClient.getTokenInfo();

      expect(info.hasUserToken).toBe(false);
      expect(info.hasClientToken).toBe(false);
      expect(info.scopeInfo).toBeUndefined();
    });
  });

  describe("isAuthenticated", () => {
    it("should return true when valid user tokens exist", async () => {
      const mockTokens = createMockTokens();
      mockTokenStorage.hasTokens.mockResolvedValue(true);
      mockTokenStorage.loadTokens.mockResolvedValue(mockTokens);
      mockTokenStorage.isAccessTokenExpired.mockReturnValue(false);

      await oauthClient.initialize();

      expect(oauthClient.isAuthenticated()).toBe(true);
    });

    it("should return false when tokens are expired", async () => {
      const expiredTokens = createFullyExpiredTokens();
      mockTokenStorage.hasTokens.mockResolvedValue(true);
      mockTokenStorage.loadTokens.mockResolvedValue(expiredTokens);
      mockTokenStorage.isAccessTokenExpired.mockReturnValue(true);

      await oauthClient.initialize();

      expect(oauthClient.isAuthenticated()).toBe(false);
    });

    it("should return false when no tokens are available", () => {
      expect(oauthClient.isAuthenticated()).toBe(false);
    });
  });
});
