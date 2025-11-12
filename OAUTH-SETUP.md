# OAuth Setup Guide

This guide walks you through setting up OAuth authentication for the eBay API MCP Server. There are two authentication methods available: **User Tokens** (recommended for high rate limits) and **App Tokens** (automatic fallback).

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Authentication Methods](#authentication-methods)
- [Step-by-Step Setup](#step-by-step-setup)
  - [1. Create eBay Developer Account](#1-create-ebay-developer-account)
  - [2. Configure Environment Variables](#2-configure-environment-variables)
  - [3. User Token Flow (Recommended)](#3-user-token-flow-recommended)
  - [4. App Token Flow (Automatic)](#4-app-token-flow-automatic)
- [Token Management](#token-management)
- [Environment-Specific Scopes](#environment-specific-scopes)
- [Troubleshooting](#troubleshooting)

---

## Overview

The eBay API MCP Server supports **two separate OAuth systems**:

1. **MCP OAuth** (HTTP server only): Controls access to MCP server endpoints
2. **eBay OAuth**: Controls access to eBay APIs (this guide)

This guide focuses on **eBay OAuth** configuration, which is required for all API calls to eBay's services.

### Token Priority System

The server uses a two-tier authentication system:

| Method | Rate Limit | Access | Setup Required |
|--------|------------|--------|----------------|
| **User Tokens** | 10,000-50,000 req/day | Full API access | ✅ Yes (recommended) |
| **App Tokens** | 1,000 req/day | Limited access | ❌ No (automatic) |

**Recommendation**: Use User Tokens for production workloads to avoid rate limiting.

---

## Prerequisites

Before starting, ensure you have:

- ✅ [eBay Developer Account](https://developer.ebay.com/) (free)
- ✅ Node.js 18.0.0 or higher installed
- ✅ eBay API MCP Server installed and built
- ✅ Basic understanding of OAuth 2.0 flow

---

## Authentication Methods

### User Token Authentication (Recommended)

**When to use**:
- Production workloads with high request volume
- Full API access required (inventory, fulfillment, marketing, etc.)
- Automated token refresh needed

**Benefits**:
- 10,000-50,000 requests/day (vs 1,000 for app tokens)
- Full scope access
- Automatic token refresh (access token expires ~2 hours, auto-refreshes)
- Token persistence across server restarts

**Rate Limits**:
- Free tier: 10,000 req/day
- Business tier: 50,000 req/day

### App Token Authentication (Automatic Fallback)

**When to use**:
- Testing and development
- Low-volume use cases (<1,000 req/day)
- No user authorization available

**Benefits**:
- No user action required
- Automatic token generation
- Simple setup (just environment variables)

**Limitations**:
- Limited to 1,000 req/day
- Restricted API scope
- Some endpoints unavailable

---

## Step-by-Step Setup

### 1. Create eBay Developer Account

#### 1.1 Register Developer Account

1. Go to [eBay Developer Portal](https://developer.ebay.com/)
2. Click **"Sign In"** → **"Join"** (or use existing eBay account)
3. Complete registration form
4. Verify email address

#### 1.2 Create Application Keys

1. Navigate to [My Account](https://developer.ebay.com/my/keys) → **"Application Keys"**
2. Click **"Create a Keyset"**
3. Choose environment:
   - **Sandbox**: For testing (no real transactions)
   - **Production**: For live eBay marketplace
4. Save the following credentials:
   - **App ID (Client ID)**: `YourAppIdHere`
   - **Cert ID (Client Secret)**: `YourCertIdHere`

**Security Warning**: Never commit these credentials to version control!

#### 1.3 Configure RuName (for User Tokens)

A RuName (Redirect URL Name) is required for user authorization:

1. Go to **"User Tokens"** tab
2. Click **"Get a Token from eBay via Your Application"**
3. Create RuName:
   - **Display Title**: `eBay MCP Server`
   - **Privacy Policy URL**: Your privacy policy URL
   - **Redirect URL**: `https://localhost:3000/oauth/callback` (or your actual callback URL)
4. Save the RuName value (e.g., `YourRuName`)

**Note**: For local testing, `https://localhost:3000/oauth/callback` is acceptable.

---

### 2. Configure Environment Variables

#### 2.1 Copy Environment Template

```bash
cp .env.example .env
```

#### 2.2 Edit `.env` File

```bash
# Required for both User and App tokens
EBAY_CLIENT_ID=your_app_id_here
EBAY_CLIENT_SECRET=your_cert_id_here
EBAY_ENVIRONMENT=sandbox  # or 'production'

# Required ONLY for User Token flow
EBAY_REDIRECT_URI=your_runame_here

# Optional: HTTP Server Configuration (ignore for STDIO mode)
MCP_HOST=localhost
MCP_PORT=3000
OAUTH_ENABLED=false  # Set true for MCP OAuth (HTTP mode only)
```

**Environment Values**:
- `sandbox`: eBay test environment (fake listings, no real money)
- `production`: Live eBay marketplace (real transactions)

---

### 3. User Token Flow (Recommended)

#### 3.1 Generate OAuth Authorization URL

Use the MCP tool to generate the authorization URL:

```typescript
// Via MCP client (Claude Desktop, etc.)
use_mcp_tool("ebay_get_oauth_url", {
  scopes: [
    "https://api.ebay.com/oauth/api_scope/sell.inventory",
    "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
    "https://api.ebay.com/oauth/api_scope/sell.marketing"
  ]
})
```

**Response**:
```json
{
  "url": "https://auth.ebay.com/oauth2/authorize?client_id=...&redirect_uri=...&response_type=code&scope=..."
}
```

#### 3.2 Authorize in Browser

1. Copy the URL from step 3.1
2. Open in web browser
3. Sign in with your eBay seller account
4. Click **"Agree"** to grant permissions
5. You'll be redirected to your callback URL with a `code` parameter:
   ```
   https://localhost:3000/oauth/callback?code=v^1.1#i^1#...
   ```
6. Copy the `code` value from the URL

#### 3.3 Exchange Code for Tokens

**Important**: This step must be done **outside the MCP server** using a direct HTTP request to eBay's token endpoint:

```bash
curl -X POST 'https://api.sandbox.ebay.com/identity/v1/oauth2/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -u 'YOUR_CLIENT_ID:YOUR_CLIENT_SECRET' \
  -d 'grant_type=authorization_code' \
  -d 'code=YOUR_CODE_FROM_STEP_3.2' \
  -d 'redirect_uri=YOUR_RUNAME'
```

**Response** (save these values):
```json
{
  "access_token": "v^1.1#i^1#...",
  "refresh_token": "v^1.1#i^1#...",
  "expires_in": 7200,
  "refresh_token_expires_in": 47304000,
  "token_type": "User Access Token"
}
```

**Note**: For production, use `https://api.ebay.com/identity/v1/oauth2/token` instead.

#### 3.4 Set Tokens in MCP Server

Use the MCP tool to store the tokens:

```typescript
// Via MCP client
use_mcp_tool("ebay_set_user_tokens_with_expiry", {
  accessToken: "v^1.1#i^1#...",
  refreshToken: "v^1.1#i^1#...",
  accessTokenExpiresIn: 7200,
  refreshTokenExpiresIn: 47304000
})
```

**Success Response**:
```json
{
  "message": "User tokens updated successfully",
  "accessTokenExpiry": "2025-01-12T14:30:00.000Z",
  "refreshTokenExpiry": "2026-07-12T12:30:00.000Z",
  "environment": "sandbox"
}
```

The tokens are now stored in `.env (tokens stored as EBAY_USER_REFRESH_TOKEN)` and will be used for all API calls.

#### 3.5 Verify Token Status

```typescript
use_mcp_tool("ebay_get_token_status", {})
```

**Expected Response**:
```json
{
  "hasUserTokens": true,
  "userAccessTokenExpiry": "2025-01-12T14:30:00.000Z",
  "userRefreshTokenExpiry": "2026-07-12T12:30:00.000Z",
  "environment": "sandbox"
}
```

---

### 4. App Token Flow (Automatic)

If you **do not** set user tokens, the server automatically uses app tokens:

1. Set environment variables (only `EBAY_CLIENT_ID`, `EBAY_CLIENT_SECRET`, `EBAY_ENVIRONMENT`)
2. Start the server
3. App tokens are generated automatically on first API call

**No additional configuration needed!**

**Verification**:
```typescript
use_mcp_tool("ebay_get_token_status", {})
```

**Response** (without user tokens):
```json
{
  "hasUserTokens": false,
  "message": "Using app tokens (1,000 req/day limit)"
}
```

---

## Token Management

### Automatic Token Refresh

The server **automatically refreshes** access tokens when they expire:

1. API request fails with `401 Unauthorized`
2. Server calls eBay's refresh token endpoint
3. New access token is obtained
4. Request is retried with new token
5. New token is saved to `.env (tokens stored as EBAY_USER_REFRESH_TOKEN)`

**You don't need to do anything!** Refresh happens transparently in the background.

### Token Storage Location

Tokens are stored in `.env (tokens stored as EBAY_USER_REFRESH_TOKEN)` in the project root:

```json
{
  "userAccessToken": "v^1.1#...",
  "userRefreshToken": "v^1.1#...",
  "userAccessTokenExpiry": 1736692200000,
  "userRefreshTokenExpiry": 1783785000000,
  "scope": "https://api.ebay.com/oauth/api_scope/sell.inventory",
  "environment": "sandbox"
}
```

**Security Best Practices**:
- ✅ File is in `.gitignore` (already configured)
- ✅ Set restrictive permissions: `chmod 600 .env (tokens stored as EBAY_USER_REFRESH_TOKEN)`
- ✅ Never commit to version control
- ✅ Back up securely (encrypted backups only)

### Token Expiry Times

| Token Type | Default Expiry | Auto-Refresh |
|------------|----------------|--------------|
| Access Token | ~2 hours | ✅ Yes |
| Refresh Token | ~18 months | ❌ No (must re-authorize) |
| App Token | ~2 hours | ✅ Yes (regenerated) |

### Manual Token Refresh (Troubleshooting)

If automatic refresh fails, you can manually refresh:

```typescript
// Check current token status
use_mcp_tool("ebay_get_token_status", {})

// If refresh token is still valid, server will auto-refresh
// If refresh token is expired, you must repeat step 3 (User Token Flow)
```

---

## Environment-Specific Scopes

eBay has different OAuth scopes available for **Sandbox** vs **Production** environments.

### Sandbox Scopes

Available in sandbox environment (testing):

```
https://api.ebay.com/oauth/api_scope/sell.inventory
https://api.ebay.com/oauth/api_scope/sell.fulfillment
https://api.ebay.com/oauth/api_scope/sell.marketing
https://api.ebay.com/oauth/api_scope/sell.account
https://api.ebay.com/oauth/api_scope/sell.analytics.readonly
https://api.ebay.com/oauth/api_scope/buy.guest.order
https://api.ebay.com/oauth/api_scope/commerce.identity.readonly
```

### Production Scopes

Available in production environment (live marketplace):

```
https://api.ebay.com/oauth/api_scope/sell.inventory
https://api.ebay.com/oauth/api_scope/sell.fulfillment
https://api.ebay.com/oauth/api_scope/sell.marketing
https://api.ebay.com/oauth/api_scope/sell.account
https://api.ebay.com/oauth/api_scope/sell.analytics.readonly
https://api.ebay.com/oauth/api_scope/commerce.shipping  # Production-only!
```

**Note**: Some scopes are environment-specific. The server will warn you if you use invalid scopes for your environment.

### Recommended Default Scopes

For full API access, use:

```typescript
[
  "https://api.ebay.com/oauth/api_scope/sell.inventory",
  "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
  "https://api.ebay.com/oauth/api_scope/sell.marketing",
  "https://api.ebay.com/oauth/api_scope/sell.account",
  "https://api.ebay.com/oauth/api_scope/sell.analytics.readonly",
  "https://api.ebay.com/oauth/api_scope/commerce.identity.readonly"
]
```

---

## Troubleshooting

### Error: "Access token is missing"

**Cause**: No user tokens or app tokens available.

**Solution**:
1. Check environment variables are set correctly
2. Follow [User Token Flow](#3-user-token-flow-recommended) to obtain tokens
3. Verify `.env` file has `EBAY_CLIENT_ID` and `EBAY_CLIENT_SECRET`

### Error: "Invalid access token"

**Cause**: Access token expired or invalid.

**Solution**:
- **First occurrence**: Server will automatically attempt to refresh the token
- **If refresh fails**: Refresh token is likely expired, repeat [User Token Flow](#3-user-token-flow-recommended)

### Error: "Token refresh failed"

**Cause**: Refresh token expired or invalid.

**Solution**:
1. Delete `.env (tokens stored as EBAY_USER_REFRESH_TOKEN)`
2. Repeat [User Token Flow](#3-user-token-flow-recommended) to get new tokens
3. Refresh tokens expire after ~18 months, requiring re-authorization

### Error: "Invalid scope for environment"

**Cause**: Using production-only scopes in sandbox (or vice versa).

**Solution**:
1. Check your `EBAY_ENVIRONMENT` setting in `.env`
2. Use appropriate scopes for your environment (see [Environment-Specific Scopes](#environment-specific-scopes))
3. For sandbox testing, remove production-only scopes like `commerce.shipping`

### Error: "redirect_uri_mismatch"

**Cause**: Redirect URI in OAuth URL doesn't match RuName configuration.

**Solution**:
1. Go to [eBay Developer Portal](https://developer.ebay.com/my/auth)
2. Verify RuName redirect URL matches `EBAY_REDIRECT_URI` in `.env`
3. Update RuName or environment variable to match

### Check Token File Manually

```bash
# View token file contents
cat .env (tokens stored as EBAY_USER_REFRESH_TOKEN) | jq

# Check token file permissions (should be 600)
ls -l .env (tokens stored as EBAY_USER_REFRESH_TOKEN)

# Set correct permissions
chmod 600 .env (tokens stored as EBAY_USER_REFRESH_TOKEN)
```

### Enable Debug Logging

```bash
EBAY_DEBUG=true npm run dev
```

This will log detailed authentication information to help diagnose issues.

---

## Next Steps

After completing OAuth setup:

1. **Test API Access**: Try calling an eBay API tool (e.g., `ebay_get_user`)
2. **Monitor Rate Limits**: Check response headers for `x-ebay-c-ratelimit-remaining`
3. **Set Up Monitoring**: Track token expiry and refresh events
4. **Review Security**: Follow [Security Best Practices](SECURITY.md)

---

## Additional Resources

- [eBay OAuth Documentation](https://developer.ebay.com/api-docs/static/oauth-tokens.html)
- [OAuth 2.0 Specification](https://datatracker.ietf.org/doc/html/rfc6749)
- [Security Policy](SECURITY.md)
- [Authentication Guide](docs/auth/README.md)

---

## Support

If you encounter issues not covered in this guide:

1. Check [GitHub Discussions](https://github.com/YosefHayim/ebay-api-mcp-server/discussions)
2. Search [Issue Tracker](https://github.com/YosefHayim/ebay-api-mcp-server/issues)
3. Create a new issue with:
   - Environment details (OS, Node version)
   - Error messages (redact tokens!)
   - Steps to reproduce

---

## License

This guide is part of the ebay-api-mcp-server project and is licensed under the MIT License.
