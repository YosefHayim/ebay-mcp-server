# Add eBay API MCP Server

## Description

Adds the eBay API MCP Server to the Docker MCP Registry. This server provides comprehensive access to eBay's Sell APIs with 230+ tools for inventory management, order fulfillment, marketing campaigns, and analytics.

## Server Details

- **Type:** Local (Containerized)
- **Category:** E-commerce
- **License:** MIT
- **Repository:** https://github.com/YosefHayim/ebay-api-mcp-server
- **Docker Image:** Will be built by Docker (mcp/ebay-api-mcp-server)
- **Documentation:** https://github.com/YosefHayim/ebay-api-mcp-server#readme

## Features

- **230+ eBay API Tools** - Comprehensive coverage across inventory, orders, marketing, analytics, and more
- **OAuth 2.0 Support** - Full user token management with automatic refresh
- **Type Safety** - Built with TypeScript, Zod validation, and OpenAPI-generated types
- **Well Tested** - 870+ tests with 99%+ function coverage
- **Dual Environments** - Supports both sandbox (testing) and production
- **Smart Authentication** - Automatic fallback from user tokens (10k-50k req/day) to client credentials (1k req/day)

## API Coverage

The server provides tools for:
- **Inventory Management** - Items, offers, locations, bulk operations
- **Order Fulfillment** - Orders, shipping, refunds, disputes
- **Marketing & Promotions** - Campaigns, ads, promotions, bidding
- **Account Management** - Policies, programs, subscriptions, sales tax
- **Analytics** - Traffic reports, seller standards, performance metrics
- **Communication** - Buyer-seller messaging, negotiations
- **Metadata & Taxonomy** - Categories, item aspects, policies

## Configuration

**Required Secrets:**
- `EBAY_CLIENT_ID` - eBay Developer App Client ID
- `EBAY_CLIENT_SECRET` - eBay Developer App Client Secret
- `EBAY_REDIRECT_URI` - eBay OAuth Redirect URI (RU Name)

**Optional Secrets:**
- `EBAY_USER_REFRESH_TOKEN` - For higher API rate limits (10k-50k vs 1k requests/day)

**Environment Variables:**
- `EBAY_ENVIRONMENT` - API environment (sandbox or production)

## Testing Completed

- [x] Dockerfile builds successfully
- [x] Server starts and runs in Docker container
- [x] Tools can be listed (tools.json provided)
- [x] Environment variables properly configured
- [x] Documentation reviewed and complete
- [x] License compatible with registry (MIT)

## Testing Process

```bash
# Built the Docker image
task build -- --tools ebay-api-mcp-server

# Generated catalog
task catalog -- ebay-api-mcp-server

# Imported into Docker Desktop
docker mcp catalog import $PWD/catalogs/ebay-api-mcp-server/catalog.yaml

# Tested in Docker Desktop MCP Toolkit with Claude Desktop
# Verified tool functionality and API connectivity
# Tested both sandbox and production environments

# Reset catalog after testing
docker mcp catalog reset
```

## Additional Information

**Why This Server is Valuable:**
- eBay is one of the world's largest e-commerce platforms
- Provides AI assistants with powerful e-commerce automation capabilities
- Enables sellers to manage inventory, process orders, and run marketing campaigns through conversational AI
- First comprehensive MCP server for eBay's Sell APIs
- Production-ready with extensive testing and error handling

**Use Cases:**
- Inventory management and bulk listing operations
- Order processing and fulfillment automation
- Marketing campaign management
- Sales analytics and reporting
- Multi-channel e-commerce integration

## Checklist

- [x] Dockerfile present in source repository
- [x] server.yaml created and validated
- [x] tools.json provided (23 representative tools)
- [x] readme.md created with documentation links
- [x] Local testing completed successfully
- [x] All required secrets documented
- [x] Environment variables properly configured
- [x] License is MIT (compatible with registry)
- [x] Repository is public and accessible

## Related Links

- [eBay Developer Program](https://developer.ebay.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Server Repository](https://github.com/YosefHayim/ebay-api-mcp-server)
- [eBay API Documentation](https://developer.ebay.com/docs)

---

**Note:** This server requires eBay Developer credentials (free to obtain at https://developer.ebay.com/). The server supports both sandbox and production environments for safe testing and live operations.
