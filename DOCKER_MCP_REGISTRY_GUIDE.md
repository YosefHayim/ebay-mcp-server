# Adding eBay MCP Server to Docker MCP Registry

This guide will walk you through the process of adding your ebay-mcp server to the official Docker MCP Registry.

## Overview

Your ebay-mcp server is a **Local Server (Containerized)** which means it:
- Has a Dockerfile ✅
- Will be built and hosted as Docker images
- Runs locally with full container isolation
- Can benefit from Docker-built images with enhanced security features

## Prerequisites Checklist

- [x] Dockerfile exists at repository root
- [x] MIT License (compatible with registry)
- [x] GitHub repository: https://github.com/YosefHayim/ebay-api-mcp-server
- [x] Well-documented README
- [ ] Go v1.24+ installed on your machine
- [ ] Docker Desktop installed
- [ ] Task CLI installed (https://taskfile.dev/)

## Step-by-Step Process

### 1. Fork the Docker MCP Registry

```bash
# Navigate to https://github.com/docker/mcp-registry
# Click "Fork" to create your own copy
# Clone your fork locally
git clone https://github.com/YOUR_USERNAME/mcp-registry.git
cd mcp-registry
```

### 2. Install Prerequisites

**Install Task CLI:**
- macOS: `brew install go-task/tap/go-task`
- Linux: `sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b ~/.local/bin`
- Windows: `choco install go-task`

**Ensure Go 1.24+ is installed:**
```bash
go version  # Should be 1.24 or higher
```

### 3. Generate Server Configuration

You have two options:

**Option A: Use the Wizard (Recommended)**

```bash
task wizard
```

This will prompt you for:
- GitHub repository URL: `https://github.com/YosefHayim/ebay-api-mcp-server`
- Category: Choose `e-commerce` or `api`
- Environment variables and secrets (see below)

**Option B: Use Task Create Command**

```bash
task create -- --category e-commerce https://github.com/YosefHayim/ebay-api-mcp-server \
  -e EBAY_CLIENT_ID=example-client-id \
  -e EBAY_CLIENT_SECRET=example-client-secret \
  -e EBAY_REDIRECT_URI=example-redirect-uri \
  -e EBAY_ENVIRONMENT=sandbox
```

### 4. Server Configuration Details

**Category:** `e-commerce` (best fit for eBay APIs)

**Required Environment Variables/Secrets:**

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| `EBAY_CLIENT_ID` | Secret | eBay App Client ID | `your-client-id` |
| `EBAY_CLIENT_SECRET` | Secret | eBay App Client Secret | `your-client-secret` |
| `EBAY_REDIRECT_URI` | Secret | eBay OAuth Redirect URI | `your-runame` |
| `EBAY_ENVIRONMENT` | Env Var | API Environment | `sandbox` or `production` |
| `EBAY_USER_REFRESH_TOKEN` | Secret (Optional) | For higher rate limits | `your-refresh-token` |

### 5. Expected server.yaml Structure

The wizard will create a file at `servers/ebay-api-mcp-server/server.yaml`:

```yaml
name: ebay-api-mcp-server
image: mcp/ebay-api-mcp-server
type: server
meta:
  category: e-commerce
  tags:
    - e-commerce
    - ebay
    - api
    - inventory
    - orders
about:
  title: eBay API MCP Server
  description: MCP server providing comprehensive access to eBay's Sell APIs with 230+ tools for inventory management, order fulfillment, marketing campaigns, and analytics. Supports OAuth 2.0 with automatic token refresh.
  icon: https://avatars.githubusercontent.com/u/182288589?s=200&v=4
source:
  project: https://github.com/YosefHayim/ebay-api-mcp-server
  commit: <will-be-auto-filled>
config:
  description: Configure eBay API credentials and environment
  secrets:
    - name: ebay-api-mcp-server.ebay_client_id
      env: EBAY_CLIENT_ID
      example: your-client-id
    - name: ebay-api-mcp-server.ebay_client_secret
      env: EBAY_CLIENT_SECRET
      example: your-client-secret
    - name: ebay-api-mcp-server.ebay_redirect_uri
      env: EBAY_REDIRECT_URI
      example: your-runame
    - name: ebay-api-mcp-server.ebay_user_refresh_token
      env: EBAY_USER_REFRESH_TOKEN
      example: <optional-for-higher-rate-limits>
  env:
    - name: EBAY_ENVIRONMENT
      example: sandbox
      value: '{{ebay-api-mcp-server.ebay_environment}}'
  parameters:
    type: object
    properties:
      ebay_environment:
        type: string
        enum: [sandbox, production]
        default: sandbox
    required: []
```

### 6. Create tools.json File

Since your server can list tools dynamically, you can either:

**Option A:** Let the wizard run your server to extract tools
**Option B:** Create a `tools.json` file manually

I've prepared a sample tools.json based on your server's capabilities (see DOCKER_MCP_TOOLS.json in this repo).

Place this file as: `servers/ebay-api-mcp-server/tools.json`

### 7. Test Locally

```bash
# Build the Docker image (if not providing your own)
task build -- --tools ebay-api-mcp-server

# Generate catalog
task catalog -- ebay-api-mcp-server

# Import into Docker Desktop
docker mcp catalog import $PWD/catalogs/ebay-api-mcp-server/catalog.yaml

# Test in Docker Desktop MCP Toolkit
# Configure the server with your credentials
# Enable it and test against your AI client

# When done testing, restore catalog
docker mcp catalog reset
```

### 8. Common Issues and Solutions

**Issue: `task build -- --tools` fails because server needs configuration**

**Solution:** Provide a `tools.json` file manually. The build process will use this file instead of trying to run the server.

Place the file at: `servers/ebay-api-mcp-server/tools.json`

**Issue: Missing Go or Task CLI**

**Solution:** Install prerequisites as shown in step 2.

### 9. Submit Pull Request

Once testing is successful:

```bash
# Commit your changes
git add servers/ebay-api-mcp-server/
git commit -m "feat: add eBay API MCP Server"

# Push to your fork
git push origin main

# Open a PR on GitHub
# Go to https://github.com/docker/mcp-registry
# Click "New Pull Request"
# Select your fork and branch
```

**Pull Request Template:**

```markdown
# Add eBay API MCP Server

## Description
Adds the eBay API MCP Server to the registry. This server provides comprehensive access to eBay's Sell APIs with 230+ tools for inventory management, order fulfillment, marketing campaigns, and analytics.

## Server Details
- **Type:** Local (Containerized)
- **Category:** E-commerce
- **License:** MIT
- **Repository:** https://github.com/YosefHayim/ebay-api-mcp-server
- **Docker Image:** Will be built by Docker (mcp/ebay-api-mcp-server)

## Features
- 230+ eBay API tools
- OAuth 2.0 support with automatic token refresh
- Type-safe with Zod validation
- 870+ tests with 99%+ coverage
- Supports both sandbox and production environments

## Testing
- [x] Built Docker image successfully
- [x] Generated catalog
- [x] Tested in Docker Desktop MCP Toolkit
- [x] Verified tool functionality

## Checklist
- [x] Dockerfile present in source repository
- [x] server.yaml created and validated
- [x] tools.json provided (or tools can be listed)
- [x] Local testing completed successfully
- [x] CI passing
```

### 10. After Approval

Once approved, your entry will be processed and available within 24 hours at:
- [MCP catalog](https://hub.docker.com/mcp)
- [Docker Desktop's MCP Toolkit](https://www.docker.com/products/docker-desktop/)
- [Docker Hub `mcp` namespace](https://hub.docker.com/u/mcp)

The benefits of Docker-built images include:
- Cryptographic signatures
- Provenance tracking
- SBOMs (Software Bill of Materials)
- Automatic security updates

## Additional Resources

- [Docker MCP Registry Contributing Guide](https://github.com/docker/mcp-registry/blob/main/CONTRIBUTING.md)
- [eBay API Documentation](https://developer.ebay.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## Questions?

If you encounter any issues during this process, you can:
1. Check the [Docker MCP Registry Issues](https://github.com/docker/mcp-registry/issues)
2. Review the [Contributing Guide](https://github.com/docker/mcp-registry/blob/main/CONTRIBUTING.md)
3. Ask for help in the Docker MCP Registry discussions

## Summary

The key steps are:
1. Fork docker/mcp-registry
2. Install prerequisites (Go, Task CLI, Docker Desktop)
3. Run `task wizard` or `task create` with your repository URL
4. Provide environment variables and secrets configuration
5. Optionally create tools.json to avoid build issues
6. Test locally with Docker Desktop
7. Submit PR with clear description
8. Wait for review and approval

Good luck! 🚀
