# OAuth 2.1 Authorization Setup Guide

This guide explains how to set up OAuth 2.1 authorization for your eBay MCP API server, following MCP specification and security best practices.

## Table of Contents

- [Overview](#overview)
- [When to Use OAuth](#when-to-use-oauth)
- [Architecture](#architecture)
- [Quick Start with Keycloak](#quick-start-with-keycloak)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [Testing the Authorization Flow](#testing-the-authorization-flow)
- [Integration with MCP Clients](#integration-with-mcp-clients)
- [Token Verification Methods](#token-verification-methods)
- [Security Best Practices](#security-best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The eBay MCP server supports two modes:

1. **STDIO Mode** (default): Local server using STDIO transport - suitable for desktop applications like Claude Desktop
2. **HTTP Mode with OAuth 2.1**: Remote server with full OAuth authorization - suitable for multi-user deployments

This guide focuses on HTTP mode with OAuth 2.1 authorization, which implements:

- **RFC 6750**: Bearer Token authentication
- **RFC 7662**: Token Introspection
- **RFC 8414**: OAuth 2.0 Authorization Server Metadata
- **RFC 9728**: Protected Resource Metadata
- **OAuth 2.1**: Modern OAuth security best practices with PKCE

## When to Use OAuth

OAuth authorization is **recommended** when:

- Your server is remotely hosted and accessed by multiple users
- You need to audit who performed which actions
- You're building for enterprise environments with access controls
- You want to implement rate limiting or usage tracking per user
- Your server handles sensitive eBay seller data

For **local development** with STDIO transport, you can skip OAuth and rely on environment-based eBay credentials.

## Architecture

```
┌─────────────────┐
│   MCP Client    │
│ (VS Code, etc)  │
└────────┬────────┘
         │ 1. Connect to MCP server
         │ 2. Server returns 401 + metadata URL
         ↓
┌─────────────────────────────────────────┐
│   Protected Resource Metadata           │
│   /.well-known/oauth-protected-resource │
│   - Lists authorization servers          │
│   - Supported scopes                     │
└────────┬────────────────────────────────┘
         │ 3. Client fetches metadata
         ↓
┌─────────────────────────────────────────┐
│   Authorization Server                   │
│   - Keycloak / Auth0 / Okta / etc       │
│   - OIDC Discovery / OAuth Metadata      │
│   - User authentication & consent        │
│   - Token issuance                       │
└────────┬────────────────────────────────┘
         │ 4. Client redirects user to auth
         │ 5. User grants permission
         │ 6. Server issues access token
         ↓
┌─────────────────┐
│   MCP Client    │
│ Sends requests  │
│ with Bearer     │
│ access token    │
└────────┬────────┘
         │ 7. Authenticated requests
         ↓
┌─────────────────────────────────────────┐
│   eBay MCP Server (Resource Server)     │
│   - Validates tokens                     │
│   - Checks scopes                        │
│   - Processes MCP requests               │
└─────────────────────────────────────────┘
```

## Quick Start with Keycloak

The fastest way to test OAuth locally is with Keycloak running in Docker.

### Step 1: Start Keycloak

```bash
docker run -p 127.0.0.1:8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak start-dev
```

Access Keycloak at http://localhost:8080 (username: `admin`, password: `admin`)

### Step 2: Configure Keycloak

1. **Create Custom Scopes**:
   - Go to **Client scopes** → **Create client scope**
   - Name: `mcp:tools`
   - Type: **Default**
   - Enable **Include in token scope**

2. **Configure Audience**:
   - Open `mcp:tools` scope
   - Go to **Mappers** → **Configure a new mapper** → **Audience**
   - Name: `audience-config`
   - Included Custom Audience: `http://localhost:3000`

3. **Allow Dynamic Client Registration**:
   - Go to **Clients** → **Client registration** → **Trusted Hosts**
   - Disable **Client URIs Must Match**
   - Add your machine's IP (check Docker logs or run `ifconfig`/`ipconfig`)

4. **Create MCP Server Client** (for token introspection):
   - Go to **Clients** → **Create client**
   - Client ID: `mcp-server`
   - Enable **Client authentication**
   - Save and go to **Credentials** tab
   - Copy the **Client Secret**

### Step 3: Configure eBay MCP Server

Create a `.env` file based on `.env.example`:

```env
# eBay API Credentials
EBAY_CLIENT_ID=your_ebay_client_id
EBAY_CLIENT_SECRET=your_ebay_client_secret
EBAY_ENVIRONMENT=sandbox

# MCP Server
MCP_HOST=localhost
MCP_PORT=3000

# OAuth Settings
OAUTH_ENABLED=true
OAUTH_AUTH_SERVER_URL=http://localhost:8080/realms/master
OAUTH_CLIENT_ID=mcp-server
OAUTH_CLIENT_SECRET=your_keycloak_client_secret
OAUTH_REQUIRED_SCOPES=mcp:tools
OAUTH_USE_INTROSPECTION=true
```

### Step 4: Start the Server

```bash
# Development mode
npm run dev:http

# Production mode
npm run build
npm run start:http
```

You should see:

```
🚀 Starting eBay API MCP Server (HTTP + OAuth)...

Configuration:
  Host: localhost
  Port: 3000
  OAuth Enabled: true
  Auth Server: http://localhost:8080/realms/master
  Required Scopes: mcp:tools
  Verification Method: Introspection

✓ Token verifier initialized
✓ Server is running!

📡 MCP endpoint: http://localhost:3000/
🔐 Protected Resource Metadata: http://localhost:3000/.well-known/oauth-protected-resource
💚 Health check: http://localhost:3000/health

🔒 Authorization is ENABLED
   Clients must provide valid Bearer tokens to access MCP endpoints
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MCP_HOST` | No | `localhost` | Server host |
| `MCP_PORT` | No | `3000` | Server port |
| `OAUTH_ENABLED` | No | `true` | Enable/disable OAuth |
| `OAUTH_AUTH_SERVER_URL` | Yes* | - | Authorization server base URL |
| `OAUTH_CLIENT_ID` | Yes* | - | MCP server's OAuth client ID |
| `OAUTH_CLIENT_SECRET` | Yes* | - | MCP server's OAuth client secret |
| `OAUTH_REQUIRED_SCOPES` | No | `mcp:tools` | Comma-separated required scopes |
| `OAUTH_USE_INTROSPECTION` | No | `true` | Use introspection (true) or JWT (false) |

\* Required when `OAUTH_ENABLED=true`

### Authorization Server Requirements

Your authorization server must support:

- **OAuth 2.0 Authorization Server Metadata** (RFC 8414) or **OIDC Discovery**
- **Authorization Code Grant** with **PKCE** (RFC 7636)
- **Dynamic Client Registration** (RFC 7591) or pre-registered clients
- **Token Introspection** (RFC 7662) if using `OAUTH_USE_INTROSPECTION=true`
- **JWKS endpoint** if using `OAUTH_USE_INTROSPECTION=false`

Tested authorization servers:
- ✅ Keycloak
- ✅ Auth0
- ✅ Okta
- ✅ Azure AD / Entra ID

## Running the Server

### STDIO Mode (No OAuth)

For local development with Claude Desktop or similar:

```bash
npm run dev
```

Configure in `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ebay": {
      "command": "node",
      "args": ["/path/to/ebay-api-mcp-server/build/index.js"],
      "env": {
        "EBAY_CLIENT_ID": "your_ebay_client_id",
        "EBAY_CLIENT_SECRET": "your_ebay_client_secret",
        "EBAY_ENVIRONMENT": "sandbox"
      }
    }
  }
}
```

### HTTP Mode with OAuth

For multi-user deployments:

```bash
# Development
npm run dev:http

# Production
npm run build
npm run start:http
```

## Testing the Authorization Flow

### Using curl

1. **Try accessing without auth** (should return 401):

```bash
curl -i http://localhost:3000/
```

Response:
```http
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Bearer realm="ebay-mcp", resource_metadata="http://localhost:3000/.well-known/oauth-protected-resource"
```

2. **Fetch Protected Resource Metadata**:

```bash
curl http://localhost:3000/.well-known/oauth-protected-resource
```

Response:
```json
{
  "resource": "http://localhost:3000",
  "authorization_servers": ["http://localhost:8080/realms/master"],
  "scopes_supported": ["mcp:tools"]
}
```

3. **Get access token** (simplified - normally done by MCP client):

```bash
# This is a simplified example - real OAuth flow requires browser redirect
# Follow your authorization server's documentation for token acquisition
```

4. **Make authenticated request**:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}' \
     http://localhost:3000/
```

### Using MCP Inspector

The MCP Inspector doesn't support OAuth yet, but you can test with:

```bash
# Temporarily disable OAuth for testing
OAUTH_ENABLED=false npm run dev:http

# In another terminal
npx @modelcontextprotocol/inspector http://localhost:3000
```

### Using VS Code

Visual Studio Code's MCP extension supports OAuth:

1. Press `Cmd+Shift+P` → **MCP: Add server...**
2. Select **HTTP**
3. Enter: `http://localhost:3000`
4. VS Code will automatically:
   - Fetch the Protected Resource Metadata
   - Discover the authorization server
   - Open browser for user authentication
   - Handle the OAuth flow
   - Store and refresh tokens

## Integration with MCP Clients

MCP clients that support the MCP Authorization specification (RFC 9728) will automatically:

1. Attempt to connect to your server
2. Receive 401 response with metadata URL
3. Fetch Protected Resource Metadata
4. Discover authorization server endpoints
5. Register themselves (if DCR supported)
6. Open browser for user consent
7. Exchange authorization code for tokens
8. Use access token in `Authorization: Bearer` header
9. Automatically refresh tokens when expired

## Token Verification Methods

The server supports two token verification methods:

### Method 1: Token Introspection (Default)

- **Recommended for**: Most scenarios
- **Pros**: Works with any token format, real-time revocation checks
- **Cons**: Additional network call per request
- **Configuration**: `OAUTH_USE_INTROSPECTION=true`

The server calls your authorization server's introspection endpoint for each request.

### Method 2: JWT Validation

- **Recommended for**: High-performance scenarios
- **Pros**: No network calls, validates locally using JWKS
- **Cons**: Can't check real-time revocation, requires JWT tokens
- **Configuration**: `OAUTH_USE_INTROSPECTION=false`

The server validates JWT signatures using the authorization server's JWKS.

## Security Best Practices

### General

- ✅ **Use HTTPS in production** - Never use HTTP for OAuth in production
- ✅ **Short-lived access tokens** - Configure your auth server for 5-15 minute expiry
- ✅ **Rotate client secrets regularly** - Update `OAUTH_CLIENT_SECRET` periodically
- ✅ **Use secure secret storage** - Never commit `.env` files, use secret managers
- ✅ **Enable PKCE** - Ensure your auth server requires PKCE for authorization code flow
- ✅ **Validate audience** - Server automatically validates token `aud` claim
- ✅ **Validate scopes** - Server checks `OAUTH_REQUIRED_SCOPES`
- ✅ **Log security events** - Server logs authentication failures

### What NOT to Do

- ❌ **Don't share client secrets** - Each MCP server should have unique credentials
- ❌ **Don't log tokens** - Server automatically redacts `Authorization` headers
- ❌ **Don't disable HTTPS in production** - `http://localhost` is only for development
- ❌ **Don't use catch-all scopes** - Define specific scopes per capability
- ❌ **Don't skip token validation** - Server validates every request
- ❌ **Don't accept tokens without audience** - Server rejects tokens without proper `aud`

### Authorization Server Security

- Configure short token lifetimes (access: 15 min, refresh: 7 days)
- Enable token rotation for refresh tokens
- Implement rate limiting on token endpoints
- Monitor for suspicious token usage patterns
- Revoke tokens on security events (password change, logout, etc.)

## Troubleshooting

### Server fails to start

**Error**: `Failed to load OAuth server metadata`

**Solution**: Check `OAUTH_AUTH_SERVER_URL` is correct and server is reachable:

```bash
# For Keycloak
curl http://localhost:8080/realms/master/.well-known/openid-configuration

# For generic OAuth
curl http://your-server/.well-known/oauth-authorization-server
```

### Token verification fails

**Error**: `Token introspection failed` or `JWT verification failed`

**Solutions**:

1. **Check token format**:
   ```bash
   # Decode JWT (if JWT token)
   echo "YOUR_TOKEN" | cut -d. -f2 | base64 -d | jq
   ```

2. **Verify audience**:
   - Token `aud` must be `http://localhost:3000` (or your server URL)
   - Check Keycloak audience mapper configuration

3. **Verify scopes**:
   - Token must include `mcp:tools` scope
   - Check scope is included in token

4. **Check client credentials**:
   - Ensure `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET` are correct
   - Test introspection endpoint directly:
   ```bash
   curl -X POST http://localhost:8080/realms/master/protocol/openid-connect/token/introspect \
     -d "token=YOUR_TOKEN" \
     -d "client_id=mcp-server" \
     -d "client_secret=YOUR_SECRET"
   ```

### Client can't register dynamically

**Error**: Dynamic Client Registration fails

**Solutions**:

1. Check authorization server supports DCR (RFC 7591)
2. Verify trusted hosts configuration (Keycloak)
3. Pre-register client manually if DCR not supported

### CORS errors

**Error**: CORS policy blocking requests

**Solution**: Server has CORS enabled by default (`origin: "*"`). For production:

1. Fork the code
2. Update `src/server-http.ts`:
   ```typescript
   app.use(cors({
     origin: ["https://your-client-domain.com"],
     exposedHeaders: ["Mcp-Session-Id"],
   }));
   ```

### Tokens expire too quickly

**Solution**: Configure longer token lifetimes in your authorization server:

- Keycloak: **Realm Settings** → **Tokens** → **Access Token Lifespan**
- Recommended: 15 minutes access, 7 days refresh

## Additional Resources

- [MCP Authorization Specification](https://modelcontextprotocol.io/specification/draft/basic/authorization)
- [MCP Security Best Practices](https://modelcontextprotocol.io/specification/draft/basic/security_best_practices)
- [OAuth 2.1 Draft](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-13)
- [RFC 9728: Protected Resource Metadata](https://datatracker.ietf.org/doc/html/rfc9728)
- [RFC 7662: Token Introspection](https://datatracker.ietf.org/doc/html/rfc7662)
- [RFC 6750: Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750)

## Support

For issues or questions:

- GitHub Issues: https://github.com/your-repo/ebay-api-mcp-server/issues
- MCP Discord: https://discord.gg/modelcontextprotocol

---

**Note**: This OAuth implementation follows MCP specification and industry best practices. Always perform security audits before deploying to production.
