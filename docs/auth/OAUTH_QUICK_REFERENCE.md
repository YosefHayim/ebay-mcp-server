# eBay MCP Server - OAuth Authentication Quick Reference

## OAuth URL Format
Use this CLEAN format (no excessive URL encoding):
```
https://auth.ebay.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=YOUR_REDIRECT_URI&scope=SCOPES_SEPARATED_BY_PLUS
```

## Common Scopes
**Basic scope (required):**
- `https://api.ebay.com/oauth/api_scope`

**For inventory/listing management:**
- `https://api.ebay.com/oauth/api_scope/sell.inventory`
- `https://api.ebay.com/oauth/api_scope/sell.inventory.readonly`

**For account management:**
- `https://api.ebay.com/oauth/api_scope/sell.account`
- `https://api.ebay.com/oauth/api_scope/sell.account.readonly`

**For order fulfillment:**
- `https://api.ebay.com/oauth/api_scope/sell.fulfillment`
- `https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly`

**For marketing:**
- `https://api.ebay.com/oauth/api_scope/sell.marketing`
- `https://api.ebay.com/oauth/api_scope/sell.marketing.readonly`

**For analytics:**
- `https://api.ebay.com/oauth/api_scope/sell.analytics.readonly`

**Multi-scope example:**
```
scope=https://api.ebay.com/oauth/api_scope+https://api.ebay.com/oauth/api_scope/sell.inventory+https://api.ebay.com/oauth/api_scope/sell.inventory.readonly
```
(Note: Use `+` to separate multiple scopes, NOT `%2B`)

## Authentication Flow

### Step 1: Generate OAuth URL
Use the MCP tool:
```
ebay:ebay_get_oauth_url
```

Optional parameters:
- `scopes`: Array of specific scopes needed (see Common Scopes above)
- `state`: CSRF protection token (optional)
- `redirectUri`: Override default redirect URI (optional)

### Step 2: User Authorization
1. Open the generated OAuth URL in a browser
2. Log in to your eBay account
3. Authorize the application
4. You'll be redirected to a URL like:
   ```
   https://auth2.ebay.com/oauth2/ThirdPartyAuthSucessFailure?isAuthSuccessful=true&code=v%5E1.1%23...&expires_in=299
   ```
5. Copy the **FULL URL** (including the `code=` parameter)

### Step 3: Exchange Authorization Code
Use the MCP tool:
```
ebay:ebay_exchange_authorization_code
```

Parameters:
- `code`: The authorization code from the redirect URL (can be URL-encoded)

The tool will automatically:
- Decode URL-encoded codes
- Exchange the code for access & refresh tokens
- Store tokens in memory for immediate use
- Save refresh token to `.env` file for persistence
- Tokens will auto-refresh when expired

## Token Management

### Access Tokens
- Valid for **2 hours** (7200 seconds)
- Automatically refreshed when expired
- Used for all API requests

### Refresh Tokens
- Valid for **18 months**
- Stored in `.env` as `EBAY_USER_REFRESH_TOKEN`
- Used to obtain new access tokens
- Can be revoked by:
  - User changing password
  - User revoking application access
  - Token expiration

### Checking Token Status
```
ebay:ebay_get_token_status
```
Returns:
- Whether user tokens are available
- Whether app access token is cached
- Current authentication status
- Rate limit tier

### Manual Token Refresh
```
ebay:ebay_refresh_access_token
```
Manually refresh access token using stored refresh token (useful for testing).

### Clearing Tokens
```
ebay:ebay_clear_tokens
```
Clears all stored tokens (requires re-authentication).

## Important Notes

### Authorization Code Expiry
- Authorization codes expire in **~5 minutes**
- If you get "invalid or was issued to another client" error, generate a fresh code
- Don't reuse old authorization codes

### Scope Requirements
- Different API endpoints require different scopes
- If you get "Insufficient permissions" errors, you need additional scopes
- Re-run the full OAuth flow with the required scopes included
- Cannot add scopes to existing tokens - must re-authorize

### Production vs Sandbox
- Different scopes available in production vs sandbox environments
- Production has more comprehensive scope coverage
- Set environment via `EBAY_ENVIRONMENT` in `.env` file

### Rate Limits
- **User tokens**: 10,000-50,000 requests/day (depending on scopes)
- **App tokens**: 1,000 requests/day
- Always prefer user tokens for better rate limits

## Troubleshooting

### "Unexpected end of JSON" errors in Claude Desktop
**Cause:** Console.log/console.error statements in server code write to stdout and corrupt MCP JSON protocol responses.

**Solution:** All console output in the auth flow has been silenced. If you add new auth-related code, avoid console.log/console.error statements.

### "Invalid scope" errors
- Some scopes are only available in production or sandbox (not both)
- Use the basic scope if unsure: `https://api.ebay.com/oauth/api_scope`
- Add specific scopes incrementally based on API endpoints you need

### "Invalid authorization code" errors
- Code expired (5 minute limit)
- Code already used (one-time use only)
- Code was issued to different client ID
- Solution: Generate fresh authorization code

### Empty inventory/offers after successful auth
- Authentication can succeed even with 0 items
- Inventory API uses different data model than legacy Trading API
- Legacy listings may not appear in Inventory API
- Check if you're using the right API for your listing type

### Tokens not persisting between sessions
- Verify `.env` file contains `EBAY_USER_REFRESH_TOKEN`
- Check file permissions on `.env`
- Ensure MCP server has write access to project directory

## Advanced Usage

### Setting Tokens with Custom Expiry
```
ebay:ebay_set_user_tokens_with_expiry
```
Useful when you already have tokens from another source and want to import them.

### Validating Token Expiry
```
ebay:ebay_validate_token_expiry
```
Check if tokens are expired or expiring soon, get recommendations.

### Display All Credentials
```
ebay:ebay_display_credentials
```
Shows all configuration (masked secrets) for debugging authentication issues.

## Best Practices

1. **Always use specific scopes**: Only request scopes you actually need
2. **Store refresh tokens securely**: Never commit `.env` to version control
3. **Handle token expiry gracefully**: The server auto-refreshes, but monitor for refresh token expiration
4. **Test in sandbox first**: Use sandbox environment for development
5. **Monitor rate limits**: User tokens provide much better limits than app tokens

## Quick Start Example

For a typical inventory management application:

1. Generate OAuth URL with inventory scopes:
```javascript
// Request scopes for inventory management
scopes: [
  "https://api.ebay.com/oauth/api_scope",
  "https://api.ebay.com/oauth/api_scope/sell.inventory",
  "https://api.ebay.com/oauth/api_scope/sell.inventory.readonly",
  "https://api.ebay.com/oauth/api_scope/sell.account.readonly"
]
```

2. User authorizes in browser

3. Exchange code:
```javascript
code: "v^1.1#i^1#r^1#..." // From redirect URL
```

4. Start using inventory APIs - tokens will auto-refresh!

## References

- [eBay OAuth Documentation](https://developer.ebay.com/api-docs/static/oauth-tokens.html)
- [eBay OAuth Scopes](https://developer.ebay.com/api-docs/static/oauth-scopes.html)
- [eBay Developer Program](https://developer.ebay.com/)
