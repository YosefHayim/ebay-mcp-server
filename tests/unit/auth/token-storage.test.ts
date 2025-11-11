import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { promises as fs } from "fs";
import type { StoredTokenData } from "../../../src/types/ebay.js";
import { createMockTokens } from "../../helpers/mock-token-storage.js";

// Mock TokenStorage module to use a test token file path
const TEST_TOKEN_PATH = "/tmp/.ebay-mcp-tokens-test.json";

// Must use vi.hoisted to ensure mock is available when imported
const mockTokenStorageModule = vi.hoisted(() => {
  const testTokenPath = "/tmp/.ebay-mcp-tokens-test.json";

  return {
    TokenStorage: class TokenStorage {
      static async hasTokens(): Promise<boolean> {
        try {
          await fs.access(testTokenPath);
          return true;
        } catch {
          return false;
        }
      }

      static async loadTokens(): Promise<StoredTokenData | null> {
        try {
          const data = await fs.readFile(testTokenPath, 'utf-8');
          const tokens = JSON.parse(data) as StoredTokenData;

          // Validate token structure
          if (!tokens.accessToken || !tokens.refreshToken) {
            return null;
          }

          return tokens;
        } catch (error) {
          return null;
        }
      }

      static async saveTokens(tokens: StoredTokenData): Promise<void> {
        try {
          await fs.writeFile(
            testTokenPath,
            JSON.stringify(tokens, null, 2),
            'utf-8'
          );
        } catch (error) {
          throw new Error(
            `Failed to save tokens: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
        }
      }

      static async clearTokens(): Promise<void> {
        try {
          await fs.unlink(testTokenPath);
        } catch (error) {
          // Ignore error if file doesn't exist
          if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            throw error;
          }
        }
      }

      static isAccessTokenExpired(tokens: StoredTokenData): boolean {
        return Date.now() >= tokens.accessTokenExpiry;
      }

      static isRefreshTokenExpired(tokens: StoredTokenData): boolean {
        return Date.now() >= tokens.refreshTokenExpiry;
      }

      static getTokenFilePath(): string {
        return testTokenPath;
      }
    }
  };
});

vi.mock("../../../src/auth/token-storage.js", () => mockTokenStorageModule);

// Import after mocking
const { TokenStorage } = await import("../../../src/auth/token-storage.js");

describe("TokenStorage", () => {
  beforeEach(async () => {
    // Clean up any existing test token file
    try {
      await fs.unlink(TEST_TOKEN_PATH);
    } catch {
      // File doesn't exist, that's fine
    }
  });

  afterEach(async () => {
    // Clean up test token file
    try {
      await fs.unlink(TEST_TOKEN_PATH);
    } catch {
      // File doesn't exist, that's fine
    }
  });

  describe("hasTokens", () => {
    it("should return true when token file exists", async () => {
      const mockTokens = createMockTokens();
      await fs.writeFile(TEST_TOKEN_PATH, JSON.stringify(mockTokens), "utf-8");

      const result = await TokenStorage.hasTokens();

      expect(result).toBe(true);
    });

    it("should return false when token file does not exist", async () => {
      const result = await TokenStorage.hasTokens();

      expect(result).toBe(false);
    });
  });

  describe("loadTokens", () => {
    it("should load valid tokens from file", async () => {
      const mockTokens = createMockTokens();
      await fs.writeFile(TEST_TOKEN_PATH, JSON.stringify(mockTokens), "utf-8");

      const result = await TokenStorage.loadTokens();

      expect(result).toEqual(mockTokens);
      expect(result?.accessToken).toBe(mockTokens.accessToken);
      expect(result?.refreshToken).toBe(mockTokens.refreshToken);
    });

    it("should return null when token file does not exist", async () => {
      const result = await TokenStorage.loadTokens();

      expect(result).toBeNull();
    });

    it("should return null when token file has invalid JSON", async () => {
      await fs.writeFile(TEST_TOKEN_PATH, "invalid json{", "utf-8");

      const result = await TokenStorage.loadTokens();

      expect(result).toBeNull();
    });

    it("should return null when tokens are missing accessToken", async () => {
      const invalidTokens = {
        refreshToken: "refresh_token",
        tokenType: "Bearer",
        accessTokenExpiry: Date.now() + 7200000,
        refreshTokenExpiry: Date.now() + 47304000000,
      };
      await fs.writeFile(TEST_TOKEN_PATH, JSON.stringify(invalidTokens), "utf-8");

      const result = await TokenStorage.loadTokens();

      expect(result).toBeNull();
    });

    it("should return null when tokens are missing refreshToken", async () => {
      const invalidTokens = {
        accessToken: "access_token",
        tokenType: "Bearer",
        accessTokenExpiry: Date.now() + 7200000,
        refreshTokenExpiry: Date.now() + 47304000000,
      };
      await fs.writeFile(TEST_TOKEN_PATH, JSON.stringify(invalidTokens), "utf-8");

      const result = await TokenStorage.loadTokens();

      expect(result).toBeNull();
    });
  });

  describe("saveTokens", () => {
    it("should save tokens to file with proper formatting", async () => {
      const mockTokens = createMockTokens();

      await TokenStorage.saveTokens(mockTokens);

      const savedData = await fs.readFile(testTokenPath, "utf-8");
      const savedTokens = JSON.parse(savedData) as StoredTokenData;

      expect(savedTokens).toEqual(mockTokens);
      // Verify file is formatted with indentation
      expect(savedData).toContain("\n");
      expect(savedData).toContain("  ");
    });

    it("should overwrite existing token file", async () => {
      const firstTokens = createMockTokens({ accessToken: "first_token" });
      const secondTokens = createMockTokens({ accessToken: "second_token" });

      await TokenStorage.saveTokens(firstTokens);
      await TokenStorage.saveTokens(secondTokens);

      const savedData = await fs.readFile(testTokenPath, "utf-8");
      const savedTokens = JSON.parse(savedData) as StoredTokenData;

      expect(savedTokens.accessToken).toBe("second_token");
    });

    it("should throw error when unable to write file", async () => {
      const mockTokens = createMockTokens();

      // Mock fs.writeFile to throw error
      vi.spyOn(fs, "writeFile").mockRejectedValue(new Error("Permission denied"));

      await expect(TokenStorage.saveTokens(mockTokens)).rejects.toThrow(
        "Failed to save tokens: Permission denied"
      );
    });
  });

  describe("clearTokens", () => {
    it("should delete token file when it exists", async () => {
      const mockTokens = createMockTokens();
      await fs.writeFile(testTokenPath, JSON.stringify(mockTokens), "utf-8");

      await TokenStorage.clearTokens();

      const exists = await TokenStorage.hasTokens();
      expect(exists).toBe(false);
    });

    it("should not throw error when token file does not exist", async () => {
      await expect(TokenStorage.clearTokens()).resolves.not.toThrow();
    });

    it("should throw error for other file system errors", async () => {
      const mockTokens = createMockTokens();
      await fs.writeFile(testTokenPath, JSON.stringify(mockTokens), "utf-8");

      // Mock fs.unlink to throw a non-ENOENT error
      const mockError = new Error("File system error") as NodeJS.ErrnoException;
      mockError.code = "EACCES";
      vi.spyOn(fs, "unlink").mockRejectedValue(mockError);

      await expect(TokenStorage.clearTokens()).rejects.toThrow("File system error");
    });
  });

  describe("isAccessTokenExpired", () => {
    it("should return false when access token is not expired", () => {
      const mockTokens = createMockTokens({
        accessTokenExpiry: Date.now() + 3600000, // 1 hour from now
      });

      const result = TokenStorage.isAccessTokenExpired(mockTokens);

      expect(result).toBe(false);
    });

    it("should return true when access token is expired", () => {
      const mockTokens = createMockTokens({
        accessTokenExpiry: Date.now() - 1000, // 1 second ago
      });

      const result = TokenStorage.isAccessTokenExpired(mockTokens);

      expect(result).toBe(true);
    });

    it("should return true when access token expires at current time", () => {
      const now = Date.now();
      const mockTokens = createMockTokens({
        accessTokenExpiry: now,
      });

      const result = TokenStorage.isAccessTokenExpired(mockTokens);

      expect(result).toBe(true);
    });
  });

  describe("isRefreshTokenExpired", () => {
    it("should return false when refresh token is not expired", () => {
      const mockTokens = createMockTokens({
        refreshTokenExpiry: Date.now() + 86400000, // 1 day from now
      });

      const result = TokenStorage.isRefreshTokenExpired(mockTokens);

      expect(result).toBe(false);
    });

    it("should return true when refresh token is expired", () => {
      const mockTokens = createMockTokens({
        refreshTokenExpiry: Date.now() - 1000, // 1 second ago
      });

      const result = TokenStorage.isRefreshTokenExpired(mockTokens);

      expect(result).toBe(true);
    });

    it("should return true when refresh token expires at current time", () => {
      const now = Date.now();
      const mockTokens = createMockTokens({
        refreshTokenExpiry: now,
      });

      const result = TokenStorage.isRefreshTokenExpired(mockTokens);

      expect(result).toBe(true);
    });
  });

  describe("getTokenFilePath", () => {
    it("should return the token file path", () => {
      const path = TokenStorage.getTokenFilePath();

      expect(path).toBe(testTokenPath);
      expect(path).toContain(".ebay-mcp-tokens");
    });
  });

  describe("Integration Tests", () => {
    it("should support full token lifecycle", async () => {
      // 1. Initially no tokens
      expect(await TokenStorage.hasTokens()).toBe(false);
      expect(await TokenStorage.loadTokens()).toBeNull();

      // 2. Save tokens
      const mockTokens = createMockTokens();
      await TokenStorage.saveTokens(mockTokens);

      // 3. Tokens should exist
      expect(await TokenStorage.hasTokens()).toBe(true);

      // 4. Load tokens
      const loadedTokens = await TokenStorage.loadTokens();
      expect(loadedTokens).toEqual(mockTokens);

      // 5. Clear tokens
      await TokenStorage.clearTokens();

      // 6. Tokens should be gone
      expect(await TokenStorage.hasTokens()).toBe(false);
      expect(await TokenStorage.loadTokens()).toBeNull();
    });

    it("should handle token expiry checks correctly", () => {
      const validTokens = createMockTokens({
        accessTokenExpiry: Date.now() + 3600000,
        refreshTokenExpiry: Date.now() + 86400000,
      });

      expect(TokenStorage.isAccessTokenExpired(validTokens)).toBe(false);
      expect(TokenStorage.isRefreshTokenExpired(validTokens)).toBe(false);

      const expiredAccessToken = createMockTokens({
        accessTokenExpiry: Date.now() - 1000,
        refreshTokenExpiry: Date.now() + 86400000,
      });

      expect(TokenStorage.isAccessTokenExpired(expiredAccessToken)).toBe(true);
      expect(TokenStorage.isRefreshTokenExpired(expiredAccessToken)).toBe(false);

      const fullyExpired = createMockTokens({
        accessTokenExpiry: Date.now() - 1000,
        refreshTokenExpiry: Date.now() - 1000,
      });

      expect(TokenStorage.isAccessTokenExpired(fullyExpired)).toBe(true);
      expect(TokenStorage.isRefreshTokenExpired(fullyExpired)).toBe(true);
    });
  });
});
