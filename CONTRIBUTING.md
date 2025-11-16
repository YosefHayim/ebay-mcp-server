# Contributing to eBay API MCP Server

First off, thank you for considering contributing to the eBay API MCP Server! 🎉

This document provides guidelines for contributing to this project. Following these guidelines helps communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [What We're Looking For](#what-were-looking-for)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
  - [Git Commit Messages](#git-commit-messages)
  - [TypeScript Style Guide](#typescript-style-guide)
  - [Documentation Style Guide](#documentation-style-guide)
- [Testing Guidelines](#testing-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment. By participating, you are expected to uphold professional standards of communication and collaboration. Please report unacceptable behavior to the project maintainers.

## What We're Looking For

There are many ways to contribute to the eBay API MCP Server:

- 🐛 **Bug fixes** - Find and fix bugs in the codebase
- ✨ **New features** - Implement new eBay API tools or MCP capabilities
- 📝 **Documentation** - Improve README, guides, code comments, or examples
- 🧪 **Tests** - Add or improve test coverage
- 🎨 **Code quality** - Refactor code, improve performance, or enhance type safety
- 🌐 **Translations** - Help internationalize documentation
- 💡 **Ideas** - Suggest new features or improvements
- 📦 **Dependencies** - Update or optimize dependencies

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/YosefHayim/ebay-mcp/issues) to avoid duplicates.

When you create a bug report, please include as many details as possible:

**Use the bug report template** when creating a new issue. The template helps you provide all the necessary information.

A good bug report should include:

- **Clear title** - A concise description of the issue
- **Environment details** - OS, Node.js version, package version
- **Steps to reproduce** - Numbered steps to recreate the bug
- **Expected behavior** - What you expected to happen
- **Actual behavior** - What actually happened
- **Logs/Screenshots** - Any relevant error messages or screenshots
- **Configuration** - Your `.env` file (with secrets redacted) or `mcp-setup.json`

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

**Use the feature request template** when creating a new issue.

Include these details:

- **Clear title** - A concise description of the enhancement
- **Use case** - Why this enhancement would be useful
- **Detailed description** - Step-by-step description of the suggested enhancement
- **Alternatives** - Any alternative solutions you've considered
- **Additional context** - Screenshots, mockups, or examples

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:

- `good first issue` - Issues suitable for newcomers
- `help wanted` - Issues where we'd appreciate community help
- `documentation` - Documentation improvements
- `bug` - Confirmed bugs that need fixing

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our style guidelines
3. **Add tests** for any new functionality
4. **Ensure tests pass** - Run `npm test` or `pnpm test`
5. **Update documentation** - Update README, CHANGELOG, or related docs
6. **Follow commit conventions** - Use [Conventional Commits](https://www.conventionalcommits.org/)
7. **Submit a pull request** using our PR template

**Pull Request Process:**

1. Update the CHANGELOG.md with details of your changes
2. Ensure all tests pass and coverage thresholds are met (90%+)
3. Update documentation to reflect any API changes
4. The PR will be merged once it receives approval from a maintainer

## Development Setup

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **pnpm** (both supported)
- **Git**
- **eBay Developer Account** (for API credentials)

### Initial Setup

1. **Fork and clone** the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ebay-mcp.git
   cd ebay-mcp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment** (see README.md for detailed instructions):
   ```bash
   cp .env.example .env
   # Edit .env with your eBay credentials
   ```

4. **Build the project**:
   ```bash
   npm run build
   ```

5. **Run tests**:
   ```bash
   npm test
   ```

### Development Workflow

```bash
# Start development server (STDIO mode)
npm run dev

# Start development server (HTTP mode with OAuth)
npm run dev:http

# Watch mode for TypeScript compilation
npm run watch

# Run tests in watch mode
npm run test:watch

# Run tests with UI dashboard
npm run test:ui

# Check code quality (type check + lint + format)
npm run check

# Format code
npm run format

# Generate types from OpenAPI specs
npm run generate:types
```

### Project Structure

```
src/
├── api/              # eBay API implementations
│   ├── client.ts     # HTTP client with interceptors
│   ├── index.ts      # API facade
│   └── [domain]/     # API categories (account, inventory, etc.)
├── auth/             # OAuth & token management
├── tools/            # MCP tool definitions
├── types/            # TypeScript types & enums
├── utils/            # Zod validation schemas
└── config/           # Environment configuration

tests/
├── unit/             # Unit tests
├── integration/      # Integration tests
└── helpers/          # Test utilities
```

## Style Guidelines

### Git Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks (dependencies, build, etc.)
- `ci:` - CI/CD changes

**Examples:**
```
feat(inventory): add bulk update inventory items tool
fix(auth): handle token refresh race condition
docs(readme): update OAuth setup instructions
test(marketing): add campaign status validation tests
chore(deps): update @modelcontextprotocol/sdk to 1.21.1
```

### TypeScript Style Guide

- **Use TypeScript strict mode** - All code must compile with strict checks enabled
- **Prefer types over interfaces** - Use `type` for most type definitions
- **Use native enums** - Import from `@/types/ebay-enums.js` when available
- **Include JSDoc comments** - Document complex functions and types
- **Use path aliases** - Import using `@/` prefix
- **Include file extensions** - Use `.js` extension in imports (ES modules)
- **Validate inputs** - Use Zod schemas for all external inputs

**Code Example:**
```typescript
import { z } from 'zod';
import { MarketplaceId } from '@/types/ebay-enums.js';
import type { InventoryItem } from '@/types/sell_inventory.js';

/**
 * Get inventory item by SKU
 * @param sku - The seller-defined SKU
 * @returns The inventory item details
 */
async getInventoryItem(sku: string): Promise<InventoryItem> {
  const validated = getInventoryItemSchema.parse({ sku });
  return this.client.get(`/sell/inventory/v1/inventory_item/${sku}`);
}

const getInventoryItemSchema = z.object({
  sku: z.string().min(1).describe('The seller-defined SKU'),
});
```

### Documentation Style Guide

- **Use clear, concise language** - Avoid jargon when possible
- **Include code examples** - Show usage with real examples
- **Keep README updated** - Reflect all major changes in README.md
- **Update CHANGELOG** - Document all changes in CHANGELOG.md
- **Use Markdown** - Follow GitHub-flavored Markdown conventions
- **Include links** - Link to relevant documentation and resources

## Testing Guidelines

### Test Coverage Requirements

- **Minimum coverage**: 90% on critical paths
- **Function coverage**: 91%+
- **Line coverage**: 83%+
- **Branch coverage**: 71%+

### Writing Tests

- **Unit tests** - Test individual functions and classes in isolation
- **Integration tests** - Test end-to-end MCP server functionality
- **Use descriptive names** - Test names should clearly describe what is being tested
- **Mock external dependencies** - Use `nock` for HTTP mocks
- **Test edge cases** - Include tests for error conditions and boundary cases

**Test Example:**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EbayInventoryApi } from '@/api/listing-management/inventory.js';

describe('EbayInventoryApi', () => {
  let inventoryApi: EbayInventoryApi;

  beforeEach(() => {
    const mockClient = createMockClient();
    inventoryApi = new EbayInventoryApi(mockClient);
  });

  describe('getInventoryItem', () => {
    it('should fetch inventory item by SKU', async () => {
      const sku = 'TEST-SKU-123';
      const mockItem = { sku, condition: 'NEW' };

      mockClient.get.mockResolvedValue(mockItem);

      const result = await inventoryApi.getInventoryItem(sku);

      expect(result).toEqual(mockItem);
      expect(mockClient.get).toHaveBeenCalledWith(
        `/sell/inventory/v1/inventory_item/${sku}`
      );
    });

    it('should throw error for invalid SKU', async () => {
      await expect(
        inventoryApi.getInventoryItem('')
      ).rejects.toThrow('SKU is required');
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run with UI dashboard
npm run test:ui
```

## Community

### Getting Help

- **GitHub Issues** - Ask questions or report problems
- **Discussions** - Share ideas and discuss features
- **Documentation** - Check README.md and other docs

### Recognition

Contributors are recognized in the following ways:

- Listed in CHANGELOG.md for their contributions
- Mentioned in release notes
- Added to GitHub contributors list

Thank you for contributing! Your efforts help make this project better for everyone. 🚀

---

**Questions?** Feel free to open an issue or reach out to the maintainers.

**License:** By contributing, you agree that your contributions will be licensed under the MIT License.
