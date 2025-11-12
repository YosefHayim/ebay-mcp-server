# eBay API MCP Server

[![npm version](https://img.shields.io/npm/v/ebay-api-mcp-server.svg)](https://www.npmjs.com/package/ebay-api-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

> **A comprehensive Model Context Protocol (MCP) server for eBay Sell APIs**
> Enables AI assistants to manage eBay seller operations including inventory, orders, marketing, and analytics.

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [📋 Prerequisites](#-prerequisites)
- [📦 Installation](#-installation)
  - [⚡ Quick Install (Automated)](#-quick-install-recommended)
  - [Alternative Methods](#alternative-installation-methods)
- [🚀 Quick Start](#-quick-start)
  - [Automated Setup](#automated-setup-recommended)
  - [Manual Setup](#manual-setup)
- [⚙️ Configuration](#️-configuration)
- [📖 Usage](#-usage)
  - [STDIO Mode (Local)](#stdio-mode-local)
  - [Manual Configuration](#manual-configuration)
  - [HTTP Mode with OAuth](#http-mode-with-oauth)
  - [Authentication](#authentication)
- [🛠️ Available Tools](#️-available-tools)
- [📚 API Reference](#-api-reference)
- [💡 Examples](#-examples)
- [🏗️ Architecture](#️-architecture)
- [🔧 Development](#-development)
- [🐛 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📚 Resources](#-resources)
- [📄 License](#-license)

---

## ✨ Features

### Core Capabilities

- **🏪 Account Management** - Configure seller policies, payment/return/fulfillment settings, tax configuration
- **📦 Inventory Management** - Create and manage inventory items, offers, product compatibility, locations
- **📬 Order Management** - Process orders, create shipping fulfillments, issue refunds, handle disputes
- **📈 Marketing & Promotions** - Manage campaigns, promotions, and listing recommendations
- **📊 Analytics & Reporting** - Access sales reports, traffic data, seller standards, customer service metrics
- **💬 Communication** - Handle buyer messages, negotiations, feedback, and notifications
- **🔍 Metadata & Taxonomy** - Browse eBay categories, get policy information, compatibility data

### Transport Modes

- **STDIO Transport** (default) - For local desktop applications like Claude Desktop
- **HTTP Transport with OAuth 2.1** - For remote, multi-user deployments with secure authorization

### Technical Features

- ✅ **170+ MCP Tools** - Comprehensive coverage of eBay Sell APIs
- ✅ **OAuth 2.0 Integration** - Automatic token refresh and management
- ✅ **Type-Safe** - Full TypeScript implementation with OpenAPI-generated schemas
- ✅ **Dual Authentication** - User tokens (high limits) or client credentials (fallback)
- ✅ **Environment Support** - Sandbox and production configurations
- ✅ **Scope Validation** - Automatic validation of OAuth scopes per environment
- ✅ **Token Persistence** - File-based storage with automatic refresh

---

## 📋 Prerequisites

- **Node.js** 18.0.0 or higher
- **Package Manager**: npm (comes with Node.js) or pnpm (install with `npm install -g pnpm`)
- **eBay Developer Account** with API credentials ([Get credentials](https://developer.ebay.com/my/keys))
- **OAuth Authorization Server** (optional, for HTTP mode) - Keycloak, Auth0, Okta, etc.

> 💡 **Package Manager Flexibility**: This project supports both npm and pnpm. All commands in this guide work with either package manager.

---

## 📦 Installation

### ⚡ Quick Install (Recommended)

**The fastest way to get started is using our automated setup script:**

```bash
# Clone the repository
git clone https://github.com/YosefHayim/ebay-api-mcp-server.git
cd ebay-api-mcp-server

# Install and build
npm install && npm run build

# Run automated setup (configures Claude, Gemini, ChatGPT)
./scripts/setup-mcp-clients.sh
```

**What the script does:**
- 📦 Verifies your build is ready
- 🔑 Prompts for eBay API credentials
- 🤖 Auto-detects and configures all installed AI clients
- ✅ Creates proper config files with absolute paths
- 🎯 Works on macOS, Linux, and Windows (WSL)

**Skip to [Automated Setup](#automated-setup-recommended) for detailed instructions.**

---

### Alternative Installation Methods

<details>
<summary><b>Global Installation via npm/pnpm</b></summary>

This project supports both **npm** and **pnpm** package managers.

#### Using npm (Recommended for most users)

```bash
npm install -g ebay-api-mcp-server
```

#### Using pnpm

```bash
pnpm add -g ebay-api-mcp-server
```

**Note:** After global installation, you'll still need to configure your AI client manually. See [Manual Configuration](#manual-configuration).

</details>

<details>
<summary><b>From Source (Manual Build)</b></summary>

#### Using npm

```bash
# Clone repository
git clone https://github.com/yourusername/ebay-api-mcp-server.git
cd ebay-api-mcp-server

# Install dependencies
npm install

# Build project
npm run build
```

#### Using pnpm

```bash
# Clone repository
git clone https://github.com/yourusername/ebay-api-mcp-server.git
cd ebay-api-mcp-server

# Install dependencies
pnpm install

# Build project
pnpm run build
```

**Package Manager Equivalents:**
- `npm install` → `pnpm install`
- `npm run <script>` → `pnpm run <script>` or `pnpm <script>`
- `npm test` → `pnpm test`

</details>

---

## 🚀 Quick Start

### Automated Setup (Recommended)

**We provide centralized configuration for easy setup across all MCP clients:**

```bash
# Clone or install the package
git clone https://github.com/YosefHayim/ebay-api-mcp-server.git
cd ebay-api-mcp-server

# Install dependencies and build
npm install
npm run build

# Step 1: Create centralized configuration file
./scripts/create-mcp-setup.sh

# Step 2: Edit mcp-setup.json with your eBay credentials
# (Use your favorite editor - VS Code, nano, vim, etc.)
nano mcp-setup.json

# Step 3: Auto-generate MCP client configurations
./scripts/setup-mcp-clients.sh
```

**What this workflow does:**

**Step 1** (`create-mcp-setup.sh`):
- 📝 Creates `mcp-setup.json` template at project root
- 🔧 Auto-detects build path
- 📋 Includes all required and optional fields

**Step 2** (Edit `mcp-setup.json`):
- 🔑 Add your eBay credentials (clientId, clientSecret, environment)
- 🎟️ Optionally add user tokens (accessToken, refreshToken)
- ✅ Enable/disable MCP clients (Claude, Cline, Continue, Zed)

**Step 3** (`setup-mcp-clients.sh`):
- ✅ Reads configuration from `mcp-setup.json`
- ✅ Auto-generates configs for enabled MCP clients
- ✅ Creates `.ebay-mcp-tokens.json` if tokens provided
- ✅ Backs up existing configs before modifying
- ✅ Works on macOS, Linux, and Windows (WSL)

**Supported MCP Clients:**
- **Claude Desktop** - macOS, Linux, Windows
- **Cline** - VS Code extension
- **Continue** - VS Code extension
- **Zed** - Text editor

**After running the setup:**
1. Restart your AI client (Claude Desktop, VS Code, Zed, etc.)
2. The eBay MCP server will be available automatically
3. Use `ebay_get_token_status` to verify authentication
4. Use `ebay_get_oauth_url` to set up user tokens (recommended for higher rate limits)

---

### Manual Setup

If you prefer manual configuration or the automated script doesn't work for your setup:

#### 1. Get eBay API Credentials

1. Visit [eBay Developer Portal](https://developer.ebay.com/)
2. Create an application to obtain:
   - Client ID
   - Client Secret
3. Choose environment: **Sandbox** (testing) or **Production**

#### 2. Build the Project

```bash
# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build
```

#### 3. Configure Your MCP Client

See the [Manual Configuration](#manual-configuration) section below for client-specific instructions.

#### 4. Run the Server (Development/Testing)

#### STDIO Mode (Local Desktop)

**Using npm:**
```bash
# Development with hot reload
npm run dev

# Production
npm start
```

**Using pnpm:**
```bash
# Development with hot reload
pnpm dev

# Production
pnpm start
```

#### HTTP Mode (Remote Multi-User)

**Using npm:**
```bash
# Development
npm run dev:http

# Production
npm run build
npm run start:http
```

**Using pnpm:**
```bash
# Development
pnpm dev:http

# Production
pnpm build
pnpm start:http
```

📚 **For detailed OAuth setup**, see [OAUTH-SETUP.md](./OAUTH-SETUP.md)

### 4. Verify Installation

The server will output:
```
eBay API MCP Server running on stdio
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EBAY_CLIENT_ID` | ✅ | - | Your eBay application Client ID |
| `EBAY_CLIENT_SECRET` | ✅ | - | Your eBay application Client Secret |
| `EBAY_ENVIRONMENT` | ✅ | `sandbox` | API environment: `sandbox` or `production` |
| `EBAY_REDIRECT_URI` | ⚠️ | - | **Highly Recommended** - OAuth redirect URI for user authorization flow. Required to use `ebay_get_oauth_url` tool. Must be registered in your eBay application settings. |
| `MCP_HOST` | ❌ | `localhost` | HTTP server host (HTTP mode only) |
| `MCP_PORT` | ❌ | `3000` | HTTP server port (HTTP mode only) |
| `OAUTH_ENABLED` | ❌ | `true` | Enable OAuth authorization (HTTP mode only) |
| `OAUTH_AUTH_SERVER_URL` | ❌ | - | Authorization server URL (HTTP mode with OAuth) |
| `OAUTH_CLIENT_ID` | ❌ | - | MCP server's OAuth client ID (HTTP mode with OAuth) |
| `OAUTH_CLIENT_SECRET` | ❌ | - | MCP server's OAuth client secret (HTTP mode with OAuth) |

### Manual Token Configuration

You have multiple ways to configure OAuth tokens for development:

#### Option 1: Centralized Configuration (⚡ Fastest - Recommended)

Use the centralized `mcp-setup.json` configuration file:

```bash
# Step 1: Create mcp-setup.json template
./scripts/create-mcp-setup.sh

# Step 2: Edit mcp-setup.json with your credentials and tokens
nano mcp-setup.json

# Step 3: Auto-generate MCP client configs and token file
./scripts/setup-mcp-clients.sh
```

This workflow:
- ✅ Configures all enabled MCP clients automatically
- ✅ Generates `.ebay-mcp-tokens.json` if tokens provided
- ✅ Single source of truth for all credentials
- ✅ Backs up existing configs before modifying
- ✅ Works across Claude, Cline, Continue, and Zed

**Note:** Token expiry times are estimated (2 hours for access, 18 months for refresh). For accurate expiry times, use the `ebay_set_user_tokens_with_expiry` tool after setup.

#### Option 2: MCP Client Configuration + Tool

Configure credentials in your MCP client config and use the `ebay_set_user_tokens` tool:

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "ebay": {
      "command": "node",
      "args": ["/absolute/path/to/build/index.js"],
      "env": {
        "EBAY_CLIENT_ID": "your_client_id",
        "EBAY_CLIENT_SECRET": "your_client_secret",
        "EBAY_ENVIRONMENT": "sandbox",
        "EBAY_REDIRECT_URI": "https://your-redirect-uri.com/callback"
      }
    }
  }
}
```

Then in Claude Desktop, use the tool:
```
ebay_set_user_tokens with your access_token and refresh_token
```

**Benefits:**
- ✅ No manual file editing required
- ✅ Tokens managed through MCP interface
- ✅ Easy to update and rotate tokens
- ✅ Works across all MCP clients

#### Option 3: Token File Generation Script

Generate a token template file that you manually edit:

```bash
./scripts/create-token-template.sh
```

This creates `.ebay-mcp-tokens.json` in the project root with placeholder values. Then:
1. Edit `.ebay-mcp-tokens.json`
2. Replace placeholder values with your actual OAuth tokens
3. Server automatically loads tokens on startup

**Benefits:**
- ✅ Quick local development setup
- ✅ File-based token persistence
- ✅ Good for testing and debugging

#### Option 4: MCP Tool

Call the `create_token_template_file` tool through your MCP client to generate the template file, then edit it manually.

📚 **See [Detailed Token Configuration Guide](./docs/auth/README.md)** for OAuth token acquisition and management.

---

## 📖 Usage

### STDIO Mode (Local)

**🎯 Recommended: Use the [centralized configuration workflow](#automated-setup-recommended) instead of manual configuration.**

The centralized `mcp-setup.json` approach automatically configures all enabled MCP clients (Claude, Cline, Continue, Zed) in a single step. See [Automated Setup](#automated-setup-recommended) above.

If you need to manually configure your MCP client, follow the instructions below:

<details>
<summary><b>Manual Configuration</b></summary>

#### With Claude Desktop

1. Locate your Claude Desktop config file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. Add server configuration:

```json
{
  "mcpServers": {
    "ebay": {
      "command": "node",
      "args": ["/absolute/path/to/ebay-api-mcp-server/build/index.js"],
      "env": {
        "EBAY_CLIENT_ID": "your_client_id",
        "EBAY_CLIENT_SECRET": "your_client_secret",
        "EBAY_ENVIRONMENT": "sandbox",
        "EBAY_REDIRECT_URI": "https://your-app.com/callback"
      }
    }
  }
}
```

**Important:**
- Use the absolute path to `build/index.js`, not a relative path.
- `EBAY_REDIRECT_URI` is highly recommended for user authentication (higher API rate limits). The redirect URI must be registered in your eBay application settings at https://developer.ebay.com/my/keys

3. Restart Claude Desktop

#### With Gemini CLI

1. Create or edit `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "ebay": {
      "command": "node",
      "args": ["/absolute/path/to/ebay-api-mcp-server/build/index.js"],
      "env": {
        "EBAY_CLIENT_ID": "your_client_id",
        "EBAY_CLIENT_SECRET": "your_client_secret",
        "EBAY_ENVIRONMENT": "sandbox",
        "EBAY_REDIRECT_URI": "https://your-app.com/callback"
      }
    }
  }
}
```

**Important:**
- Use the absolute path to `build/index.js`, not a relative path.
- `EBAY_REDIRECT_URI` is highly recommended for user authentication (higher API rate limits). The redirect URI must be registered in your eBay application settings at https://developer.ebay.com/my/keys

2. Restart Gemini CLI or run `gemini mcp refresh`

#### With ChatGPT Desktop

1. Locate your ChatGPT Desktop config file:
   - **macOS**: `~/Library/Application Support/ChatGPT/mcp_config.json`
   - **Windows**: `%APPDATA%/ChatGPT/mcp_config.json`
   - **Linux**: `~/.config/ChatGPT/mcp_config.json`

2. Add server configuration:

```json
{
  "mcpServers": {
    "ebay": {
      "command": "node",
      "args": ["/absolute/path/to/ebay-api-mcp-server/build/index.js"],
      "env": {
        "EBAY_CLIENT_ID": "your_client_id",
        "EBAY_CLIENT_SECRET": "your_client_secret",
        "EBAY_ENVIRONMENT": "sandbox",
        "EBAY_REDIRECT_URI": "https://your-app.com/callback"
      }
    }
  }
}
```

**Important:**
- Use the absolute path to `build/index.js`, not a relative path.
- `EBAY_REDIRECT_URI` is highly recommended for user authentication (higher API rate limits). The redirect URI must be registered in your eBay application settings at https://developer.ebay.com/my/keys

**Note:** ChatGPT Desktop MCP support may vary. Check ChatGPT documentation for current MCP compatibility.

3. Restart ChatGPT Desktop

#### With Cline (VS Code Extension)

1. Locate Cline MCP settings file:
   - **macOS/Linux**: `~/.config/cline/mcp_settings.json`
   - **Windows**: `%APPDATA%/cline/mcp_settings.json`

2. Add server configuration:

```json
{
  "mcpServers": {
    "ebay": {
      "command": "node",
      "args": ["/absolute/path/to/ebay-api-mcp-server/build/index.js"],
      "env": {
        "EBAY_CLIENT_ID": "your_client_id",
        "EBAY_CLIENT_SECRET": "your_client_secret",
        "EBAY_ENVIRONMENT": "sandbox",
        "EBAY_REDIRECT_URI": "https://your-app.com/callback"
      }
    }
  }
}
```

3. Restart VS Code or reload Cline extension

#### With Continue (VS Code Extension)

1. Locate Continue config file:
   - **macOS/Linux**: `~/.continue/config.json`
   - **Windows**: `%USERPROFILE%/.continue/config.json`

2. Add server configuration:

```json
{
  "mcpServers": {
    "ebay": {
      "command": "node",
      "args": ["/absolute/path/to/ebay-api-mcp-server/build/index.js"],
      "env": {
        "EBAY_CLIENT_ID": "your_client_id",
        "EBAY_CLIENT_SECRET": "your_client_secret",
        "EBAY_ENVIRONMENT": "sandbox",
        "EBAY_REDIRECT_URI": "https://your-app.com/callback"
      }
    }
  }
}
```

3. Restart VS Code or reload Continue extension

#### With Zed

1. Locate Zed settings file:
   - **macOS/Linux**: `~/.config/zed/settings.json`
   - **Windows**: `%APPDATA%/Zed/settings.json`

2. Add server configuration (**Note:** Zed uses `context_servers` instead of `mcpServers`):

```json
{
  "context_servers": {
    "ebay": {
      "command": {
        "path": "node",
        "args": ["/absolute/path/to/ebay-api-mcp-server/build/index.js"],
        "env": {
          "EBAY_CLIENT_ID": "your_client_id",
          "EBAY_CLIENT_SECRET": "your_client_secret",
          "EBAY_ENVIRONMENT": "sandbox",
          "EBAY_REDIRECT_URI": "https://your-app.com/callback"
        }
      }
    }
  }
}
```

3. Restart Zed

</details>

### HTTP Mode with OAuth

See [OAUTH-SETUP.md](./OAUTH-SETUP.md) for comprehensive OAuth configuration instructions.

**Quick Test with Keycloak:**

```bash
# Terminal 1: Start Keycloak
docker run -p 127.0.0.1:8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak start-dev

# Terminal 2: Configure and start MCP server
cp .env.example .env
# Edit .env with eBay and OAuth credentials
npm run dev:http
```

### Authentication

#### User Tokens (Recommended)

**Benefits:**
- ✅ Higher rate limits (10,000-50,000 requests/day)
- ✅ Full access to all seller operations
- ✅ Automatic token refresh (valid ~18 months)

**Setup:**

1. Generate OAuth URL:
   ```
   Use tool: ebay_get_oauth_url
   ```

2. User authorizes in browser

3. Set tokens:
   ```
   Use tool: ebay_set_user_tokens
   Parameters:
     - accessToken: [token from OAuth flow]
     - refreshToken: [refresh token from OAuth flow]
   ```

#### Client Credentials (Fallback)

**Limitations:**
- ⚠️ Lower rate limits (1,000 requests/day)
- ⚠️ Limited to app-level operations
- ✅ Automatic (no user authorization needed)

Used automatically when user tokens are unavailable.

#### OAuth Scopes

**Important:** Production and Sandbox environments support different OAuth scopes.

- **Production**: 27 unique scopes
- **Sandbox**: 35 unique scopes (includes Buy API, extended Identity scopes)
- **Common**: 21 scopes available in both

**Automatic Validation:**
- ✅ Validates scopes when generating OAuth URLs
- ✅ Warns about environment-incompatible scopes
- ✅ Environment-specific defaults loaded automatically

📚 **See [OAuth Scope Differences](./docs/auth/scope-differences.md)** for detailed scope information.

---

## 🛠️ Available Tools

### Authentication & Management

| Tool | Description |
|------|-------------|
| `ebay_get_oauth_url` | Generate OAuth authorization URL for user consent |
| `ebay_set_user_tokens` | Store user access and refresh tokens |
| `ebay_get_token_status` | Check current authentication status |
| `ebay_clear_tokens` | Clear all stored tokens |
| `create_token_template_file` | Generate token configuration template |

### Account Management (28 tools)

<details>
<summary><b>View Account Tools</b></summary>

| Tool | Description |
|------|-------------|
| `ebay_get_custom_policies` | Retrieve custom policies |
| `ebay_get_fulfillment_policies` | Get fulfillment policies |
| `ebay_create_fulfillment_policy` | Create new fulfillment policy |
| `ebay_update_fulfillment_policy` | Update fulfillment policy |
| `ebay_delete_fulfillment_policy` | Delete fulfillment policy |
| `ebay_get_payment_policies` | Get payment policies |
| `ebay_create_payment_policy` | Create new payment policy |
| `ebay_update_payment_policy` | Update payment policy |
| `ebay_delete_payment_policy` | Delete payment policy |
| `ebay_get_return_policies` | Get return policies |
| `ebay_create_return_policy` | Create new return policy |
| `ebay_update_return_policy` | Update return policy |
| `ebay_delete_return_policy` | Delete return policy |
| `ebay_get_kyc` | Get KYC (Know Your Customer) status |
| `ebay_opt_in_to_payments_program` | Opt into payments program |
| `ebay_get_payments_program_status` | Check payments program status |
| `ebay_get_rate_tables` | Retrieve rate tables |
| `ebay_create_or_replace_sales_tax` | Configure sales tax |
| `ebay_bulk_create_or_replace_sales_tax` | Bulk configure sales tax |
| `ebay_delete_sales_tax` | Delete sales tax configuration |
| `ebay_get_sales_tax` | Get sales tax for jurisdiction |
| `ebay_get_sales_taxes` | Get all sales tax configurations |
| `ebay_get_subscription` | Get subscription information |
| `ebay_opt_in_to_program` | Opt into seller program |
| `ebay_opt_out_of_program` | Opt out of seller program |
| `ebay_get_opted_in_programs` | Get opted-in programs |

</details>

### Inventory Management (30 tools)

<details>
<summary><b>View Inventory Tools</b></summary>

| Tool | Description |
|------|-------------|
| `ebay_get_inventory_items` | Retrieve all inventory items |
| `ebay_get_inventory_item` | Get single inventory item by SKU |
| `ebay_create_inventory_item` | Create or replace inventory item |
| `ebay_bulk_create_or_replace_inventory_item` | Bulk create/update items |
| `ebay_bulk_get_inventory_item` | Bulk retrieve items |
| `ebay_get_offers` | Get all offers |
| `ebay_get_offer` | Get single offer |
| `ebay_create_offer` | Create new offer |
| `ebay_update_offer` | Update existing offer |
| `ebay_delete_offer` | Delete offer |
| `ebay_publish_offer` | Publish offer to eBay |
| `ebay_withdraw_offer` | Withdraw published offer |
| `ebay_bulk_create_offer` | Bulk create offers |
| `ebay_bulk_publish_offer` | Bulk publish offers |
| `ebay_bulk_update_price_quantity` | Bulk update pricing and quantity |
| `ebay_get_listing_fees` | Preview listing fees |
| `ebay_bulk_migrate_listing` | Migrate listings to inventory model |
| `ebay_get_product_compatibility` | Get product compatibility |
| `ebay_create_or_replace_product_compatibility` | Set product compatibility |
| `ebay_delete_product_compatibility` | Remove product compatibility |
| `ebay_get_inventory_item_group` | Get item group (variations) |
| `ebay_create_or_replace_inventory_item_group` | Create/update item group |
| `ebay_delete_inventory_item_group` | Delete item group |
| `ebay_get_inventory_locations` | Get all inventory locations |
| `ebay_get_inventory_location` | Get single location |
| `ebay_create_or_replace_inventory_location` | Create/update location |
| `ebay_delete_inventory_location` | Delete location |
| `ebay_disable_inventory_location` | Disable location |
| `ebay_enable_inventory_location` | Enable location |
| `ebay_update_location_details` | Update location details |

</details>

### Order Management (4 tools)

| Tool | Description |
|------|-------------|
| `ebay_get_orders` | Retrieve orders with filters |
| `ebay_get_order` | Get single order details |
| `ebay_create_shipping_fulfillment` | Create shipping fulfillment |
| `ebay_issue_refund` | Issue refund for order |

### Marketing & Promotions (9 tools)

| Tool | Description |
|------|-------------|
| `ebay_get_campaigns` | Get marketing campaigns |
| `ebay_get_campaign` | Get single campaign |
| `ebay_pause_campaign` | Pause running campaign |
| `ebay_resume_campaign` | Resume paused campaign |
| `ebay_end_campaign` | End campaign permanently |
| `ebay_update_campaign_identification` | Update campaign name |
| `ebay_clone_campaign` | Clone existing campaign |
| `ebay_get_promotions` | Get promotions |
| `ebay_find_listing_recommendations` | Get listing recommendations |

### Analytics & Reporting (4 tools)

| Tool | Description |
|------|-------------|
| `ebay_get_traffic_report` | Get traffic report data |
| `ebay_find_seller_standards_profiles` | Get seller standards profiles |
| `ebay_get_seller_standards_profile` | Get specific standards profile |
| `ebay_get_customer_service_metric` | Get customer service metrics |

### Metadata & Policies (22 tools)

<details>
<summary><b>View Metadata Tools</b></summary>

| Tool | Description |
|------|-------------|
| `ebay_get_automotive_parts_compatibility_policies` | Get auto parts policies |
| `ebay_get_category_policies` | Get category-specific policies |
| `ebay_get_extended_producer_responsibility_policies` | Get EPR policies |
| `ebay_get_hazardous_materials_labels` | Get hazmat labels |
| `ebay_get_item_condition_policies` | Get item condition policies |
| `ebay_get_listing_structure_policies` | Get listing structure policies |
| `ebay_get_negotiated_price_policies` | Get negotiated price policies |
| `ebay_get_product_safety_labels` | Get product safety labels |
| `ebay_get_regulatory_policies` | Get regulatory policies |
| `ebay_get_shipping_cost_type_policies` | Get shipping cost policies |
| `ebay_get_classified_ad_policies` | Get classified ad policies |
| `ebay_get_currencies` | Get supported currencies |
| `ebay_get_listing_type_policies` | Get listing type policies |
| `ebay_get_motors_listing_policies` | Get motors listing policies |
| `ebay_get_shipping_policies` | Get shipping policies |
| `ebay_get_site_visibility_policies` | Get site visibility policies |
| `ebay_get_compatibilities_by_specification` | Get compatibilities |
| `ebay_get_compatibility_property_names` | Get compatibility property names |
| `ebay_get_compatibility_property_values` | Get property values |
| `ebay_get_multi_compatibility_property_values` | Get multiple property values |
| `ebay_get_product_compatibilities` | Get product compatibilities |
| `ebay_get_sales_tax_jurisdictions` | Get sales tax jurisdictions |

</details>

### Taxonomy (4 tools)

| Tool | Description |
|------|-------------|
| `ebay_get_default_category_tree_id` | Get default category tree |
| `ebay_get_category_tree` | Get category tree structure |
| `ebay_get_category_suggestions` | Get category suggestions |
| `ebay_get_item_aspects_for_category` | Get required item aspects |

### Communication (3 tools)

| Tool | Description |
|------|-------------|
| `ebay_get_offers_to_buyers` | Get offers to buyers (negotiations) |
| `ebay_send_offer_to_interested_buyers` | Send counter-offer |
| `ebay_search_messages` | Search buyer-seller messages |

### Utility Tools

| Tool | Description |
|------|-------------|
| `search` | Search the web (ChatGPT, Claude, Claude Code) |
| `fetch` | Fetch web content (ChatGPT, Claude, Claude Code) |

**Total: 170+ tools**

---

## 📚 API Reference

### Architecture Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│ AI Assistant│ ◄──────►│  MCP Server  │ ◄──────►│  eBay API   │
│  (Claude)   │   MCP   │  (This app)  │  OAuth  │             │
└─────────────┘         └──────────────┘         └─────────────┘
```

### Request Flow

1. **AI Assistant** sends MCP tool request (e.g., "get my orders")
2. **MCP Server** validates request and calls appropriate eBay API
3. **eBay API** processes request and returns data
4. **MCP Server** formats response for AI assistant
5. **AI Assistant** uses data to help user

### API Categories

| Category | Description | API Version |
|----------|-------------|-------------|
| **Account** | Seller policies, payment settings, tax configuration | v1 |
| **Inventory** | Manage products, offers, locations | v1 |
| **Fulfillment** | Process orders, create shipments, issue refunds | v1 |
| **Marketing** | Campaigns, promotions, recommendations | v1 |
| **Analytics** | Sales reports, traffic data, seller metrics | v1 |
| **Metadata** | Category policies, compatibility rules | v1 |
| **Taxonomy** | Browse eBay's category tree | v1 |
| **Communication** | Messages, negotiations, feedback, notifications | v1/v1_beta |

---

## 💡 Examples

### Example 1: List Inventory

```typescript
// AI uses tool: ebay_get_inventory_items
{
  "limit": 100,
  "offset": 0
}

// Server Response
{
  "inventoryItems": [
    {
      "sku": "WIDGET-001",
      "product": {
        "title": "Premium Widget",
        "description": "High-quality widget"
      },
      "availability": {
        "shipToLocationAvailability": {
          "quantity": 50
        }
      }
    }
  ]
}
```

### Example 2: Create Listing

```typescript
// Step 1: Create inventory item
// Tool: ebay_create_inventory_item
{
  "sku": "WIDGET-001",
  "inventoryItem": {
    "product": {
      "title": "Premium Widget",
      "description": "High-quality widget",
      "aspects": {
        "Brand": ["MyBrand"],
        "Color": ["Blue"]
      }
    },
    "condition": "NEW",
    "availability": {
      "shipToLocationAvailability": {
        "quantity": 100
      }
    }
  }
}

// Step 2: Create offer
// Tool: ebay_create_offer
{
  "offer": {
    "sku": "WIDGET-001",
    "marketplaceId": "EBAY_US",
    "format": "FIXED_PRICE",
    "categoryId": "12345",
    "pricingSummary": {
      "price": {
        "currency": "USD",
        "value": "29.99"
      }
    },
    "listingPolicies": {
      "fulfillmentPolicyId": "123456789",
      "paymentPolicyId": "987654321",
      "returnPolicyId": "456789123"
    }
  }
}

// Step 3: Publish offer
// Tool: ebay_publish_offer
{
  "offerId": "1234567890"
}

// Result: Live listing on eBay
```

### Example 3: Process Order

```typescript
// Step 1: Get pending orders
// Tool: ebay_get_orders
{
  "filter": "orderfulfillmentstatus:{NOT_STARTED}",
  "limit": 50
}

// Step 2: Create shipping fulfillment
// Tool: ebay_create_shipping_fulfillment
{
  "orderId": "12-34567-89012",
  "fulfillment": {
    "lineItems": [
      {
        "lineItemId": "123456789",
        "quantity": 1
      }
    ],
    "shippingCarrierCode": "USPS",
    "trackingNumber": "1234567890"
  }
}

// Result: Order marked as shipped, buyer receives tracking
```

### Example 4: Manage Marketing Campaign

```typescript
// Get campaigns
// Tool: ebay_get_campaigns
{
  "campaignStatus": "RUNNING"
}

// Pause campaign
// Tool: ebay_pause_campaign
{
  "campaignId": "987654321"
}

// Clone campaign with new budget
// Tool: ebay_clone_campaign
{
  "campaignId": "987654321",
  "cloneData": {
    "campaignName": "Holiday Sale 2025",
    "fundingStrategy": {
      "fundingModel": "COST_PER_SALE",
      "bidPercentage": "15.0"
    }
  }
}
```

---

## 🏗️ Architecture

### Project Structure

```
ebay-api-mcp-server/
├── src/
│   ├── index.ts                      # STDIO MCP server entry point
│   ├── server-http.ts                # HTTP MCP server with OAuth
│   ├── api/                          # eBay API implementations
│   │   ├── account-management/       # Account API
│   │   ├── listing-management/       # Inventory API
│   │   ├── order-management/         # Fulfillment & Dispute APIs
│   │   ├── marketing-and-promotions/ # Marketing & Recommendation
│   │   ├── analytics-and-report/     # Analytics API
│   │   ├── listing-metadata/         # Metadata & Taxonomy
│   │   ├── communication/            # Messages, Feedback, Negotiation
│   │   ├── other/                    # Compliance, Identity, VERO, etc.
│   │   ├── client.ts                 # HTTP client with OAuth
│   │   └── index.ts                  # API facade (EbaySellerApi)
│   ├── auth/                         # OAuth 2.0/2.1 implementation
│   │   ├── oauth.ts                  # eBay OAuth client
│   │   ├── token-storage.ts          # Token persistence
│   │   ├── token-verifier.ts         # JWT verification (HTTP mode)
│   │   └── oauth-middleware.ts       # Express middleware (HTTP mode)
│   ├── config/
│   │   └── environment.ts            # Environment configuration
│   ├── tools/                        # MCP tool definitions
│   │   ├── tool-definitions.ts       # 170+ tool definitions
│   │   ├── index.ts                  # Tool dispatcher
│   │   └── token-template.ts         # Token template generator
│   ├── types/                        # TypeScript types
│   │   ├── openapi-schemas/          # OpenAPI-generated types
│   │   └── ebay.ts                   # Core types
│   └── utils/                        # Zod validation schemas
│       ├── account-management/
│       ├── listing-management/
│       ├── order-management/
│       ├── marketing-and-promotions/
│       └── [...other categories]
├── docs/
│   ├── auth/                         # Authentication guides
│   └── sell-apps/                    # OpenAPI specifications
├── tests/                            # Test files
├── build/                            # Compiled JavaScript
├── .env                              # Environment variables
├── CLAUDE.md                         # Claude-specific instructions
├── GEMINI.md                         # Gemini-specific instructions
├── OAUTH-SETUP.md                    # OAuth setup guide
└── README.md                         # This file
```

### Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.9.3
- **MCP SDK**: @modelcontextprotocol/sdk v1.21.1
- **HTTP Client**: axios v1.7.9
- **Validation**: zod v3
- **Testing**: vitest v4.0.8
- **Server**: express v5.1.0 (HTTP mode)
- **JWT**: jose v6.1.1, jsonwebtoken v9.0.2

---

## 🔧 Development

### Setup Development Environment

**Using npm:**
```bash
# Install dependencies
npm install

# Type check
npm run typecheck

# Watch mode (auto-rebuild on changes)
npm run watch

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Lint and format check
npm run check
```

**Using pnpm:**
```bash
# Install dependencies
pnpm install

# Type check
pnpm typecheck

# Watch mode (auto-rebuild on changes)
pnpm watch

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Lint and format check
pnpm check
```

### Build Commands

**Using npm:**
```bash
# Clean build artifacts
npm run clean

# Build TypeScript to JavaScript
npm run build

# Rebuild (clean + build)
npm run clean && npm run build
```

**Using pnpm:**
```bash
# Clean build artifacts
pnpm clean

# Build TypeScript to JavaScript
pnpm build

# Rebuild (clean + build)
pnpm clean && pnpm build
```

### Testing

**Using npm:**
```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage

# Open interactive test UI
npm run test:ui
```

**Using pnpm:**
```bash
# Run all tests
pnpm test

# Watch mode for development
pnpm test:watch

# Generate coverage report
pnpm test:coverage

# Open interactive test UI
pnpm test:ui
```

### Code Quality

- **TypeScript Strict Mode**: Enabled
- **ESLint**: Configured (coming soon)
- **Type Safety**: OpenAPI-generated schemas + Zod validation
- **Test Coverage**: Target 70%+ (in progress)

---

## 🐛 Troubleshooting

### Automated Setup Script Issues

#### Script Permission Denied

**Error:** `Permission denied: ./scripts/setup-mcp-clients.sh`

**Solution:**
```bash
chmod +x ./scripts/setup-mcp-clients.sh
./scripts/setup-mcp-clients.sh
```

#### jq Not Installed

**Error:** `jq: command not found`

**Solution:**
- **macOS**: `brew install jq`
- **Ubuntu/Debian**: `sudo apt-get install jq`
- **CentOS/RHEL**: `sudo yum install jq`
- **Windows**: Use WSL or download from https://stedolan.github.io/jq/

#### Build Not Found

**Error:** `Build not found at /path/to/build/index.js`

**Solution:**
```bash
npm install
npm run build
./scripts/setup-mcp-clients.sh
```

#### Client Not Detected

If your AI client isn't automatically detected:

1. **Verify installation**: Make sure Claude Desktop, Gemini CLI, or ChatGPT Desktop is installed
2. **Check config directory**: The script looks for config directories in standard locations
3. **Manual configuration**: Use the [Manual Configuration](#manual-configuration) section instead

---

### Common Runtime Issues

#### "Access token is missing" Error

**Cause**: No user tokens configured

**Solution**:
1. Use `ebay_get_oauth_url` to generate authorization URL
2. Complete OAuth flow in browser
3. Use `ebay_set_user_tokens` with access and refresh tokens

#### "Rate limit exceeded" Error

**Cause**: Using client credentials (1,000 req/day limit)

**Solution**: Switch to user tokens (10,000-50,000 req/day)
1. Check status: `ebay_get_token_status`
2. Set user tokens: `ebay_set_user_tokens`

#### "Invalid scope" Warning

**Cause**: Requesting sandbox-only scopes in production (or vice versa)

**Solution**: Use default scopes or check [scope differences](./docs/auth/scope-differences.md)

#### Server Fails to Start

**Check**:
1. Node.js version: `node --version` (must be 18+)
2. Environment file exists: `cat .env`
3. Valid credentials: Check eBay Developer Portal
4. Build completed: `npm run build`

#### Token Refresh Failed

**Check**:
1. Refresh token expiry: `cat .ebay-mcp-tokens.json` (in project root)
2. Refresh tokens valid ~18 months
3. Re-authenticate if expired: Use `ebay_get_oauth_url`

### Debug Mode

Enable verbose logging:

```bash
# Set environment variable
export DEBUG=ebay:*

# Run server
npm run dev
```

### Get Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/YosefHayim/ebay-api-mcp-server/issues)
- **Documentation**: [eBay API Docs](https://developer.ebay.com/docs)
- **MCP Specification**: [MCP Protocol](https://modelcontextprotocol.io/)

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/ebay-api-mcp-server.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Install dependencies:
   - **npm**: `npm install`
   - **pnpm**: `pnpm install`
5. Make your changes
6. Run tests:
   - **npm**: `npm test`
   - **pnpm**: `pnpm test`
7. Type check:
   - **npm**: `npm run typecheck`
   - **pnpm**: `pnpm typecheck`
8. Run quality checks:
   - **npm**: `npm run check`
   - **pnpm**: `pnpm check`
9. Submit a pull request

### Contribution Guidelines

- ✅ Follow existing code style and architecture
- ✅ Add tests for new features
- ✅ Update documentation (README, CLAUDE.md, etc.)
- ✅ Use TypeScript strict mode
- ✅ Validate against OpenAPI specifications in `docs/` folder
- ✅ Include proper error handling
- ✅ Follow MCP tool naming conventions

### Priority Areas for Contribution

1. **Testing Infrastructure** - Expand test coverage
2. **Error Handling** - Improve error messages and logging
3. **Rate Limiting** - Implement request throttling
4. **Documentation** - Add more examples and guides
5. **Missing Endpoints** - Complete eDelivery API (40+ endpoints pending)

### Code of Conduct

Be respectful, collaborative, and constructive. We're all here to build great tools together.

---

## 📚 Resources

### Official Documentation

- **eBay Developer Program**: https://developer.ebay.com/
- **eBay API Documentation**: https://developer.ebay.com/docs
- **eBay API Status**: https://developer.ebay.com/support/api-status

### MCP Resources

- **Model Context Protocol**: https://modelcontextprotocol.io/
- **MCP Specification**: https://spec.modelcontextprotocol.io/
- **MCP SDK (TypeScript)**: https://github.com/modelcontextprotocol/typescript-sdk

### OAuth & Security

- **OAuth 2.1 Draft**: https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1-13
- **RFC 6750: Bearer Token Usage**: https://datatracker.ietf.org/doc/html/rfc6750
- **RFC 7662: Token Introspection**: https://datatracker.ietf.org/doc/html/rfc7662
- **RFC 9728: Protected Resource Metadata**: https://datatracker.ietf.org/doc/html/rfc9728

### Related Projects

- **Claude Desktop**: https://claude.ai/download
- **Gemini CLI**: https://ai.google.dev/gemini-api/docs/cli
- **Keycloak** (OAuth server): https://www.keycloak.org/

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **Anthropic** - For Claude and MCP specification
- **eBay** - For comprehensive Sell APIs
- **MCP Community** - For protocol development and support

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/YosefHayim/ebay-api-mcp-server/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YosefHayim/ebay-api-mcp-server/discussions)
- **eBay Developer Support**: [eBay Developer Forums](https://community.ebay.com/t5/Developer-Forums/ct-p/api_dev)

---

<div align="center">

**Made with ❤️ for the eBay seller community**

[⭐ Star this project](https://github.com/YosefHayim/ebay-api-mcp-server) | [🐛 Report Bug](https://github.com/YosefHayim/ebay-api-mcp-server/issues) | [💡 Request Feature](https://github.com/YosefHayim/ebay-api-mcp-server/issues)

</div>
