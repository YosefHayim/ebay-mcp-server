# Testing Documentation

This document provides comprehensive guidance for running, writing, and maintaining tests for the eBay API MCP Server.

## Table of Contents

- [Quick Start](#quick-start)
- [Test Organization](#test-organization)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Helpers](#test-helpers)
- [Code Coverage](#code-coverage)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## Quick Start

### Install Dependencies

```bash
pnpm install
```

### Run All Tests

```bash
pnpm test
```

### Run Tests in Watch Mode

```bash
pnpm test:watch
```

### Run Tests with UI

```bash
pnpm test:ui
```

### Generate Coverage Report

```bash
pnpm test:coverage
```

## Test Organization

The test suite is organized into three main categories:

```
tests/
├── unit/                    # Isolated component tests
│   ├── auth/               # OAuth and authentication tests
│   ├── config/             # Configuration and scope validation tests
│   └── tools/              # Tool schema validation tests
├── integration/            # Component interaction tests
│   ├── api/                # API client integration tests
│   └── tools/              # Tool execution integration tests
└── helpers/                # Shared test utilities
    ├── mock-http.ts        # HTTP mocking utilities (nock)
    └── mock-token-storage.ts # Token storage mocking utilities
```

### Unit Tests

**Purpose**: Test individual components in isolation

**Location**: `tests/unit/`

**Examples**:
- `auth/oauth.test.ts` - OAuth client token management
- `config/scopes.test.ts` - Scope validation and URL generation
- `tools/schemas.test.ts` - Zod schema validation

**Characteristics**:
- Fast execution
- No external dependencies
- Mocked dependencies
- Test single functions/methods

### Integration Tests

**Purpose**: Test component interactions and API workflows

**Location**: `tests/integration/`

**Examples**:
- `api/client.test.ts` - HTTP client with interceptors
- `tools/inventory-tools.test.ts` - Tool execution with API calls

**Characteristics**:
- Test multiple components together
- Mock external HTTP calls (using nock)
- Verify data flow between layers
- Test error propagation

## Running Tests

### Available Test Scripts

```bash
# Run all tests once (CI mode)
pnpm test

# Run tests in watch mode (development)
pnpm test:watch

# Open interactive test UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

### Run Specific Test Files

```bash
# Run all unit tests
pnpm test tests/unit

# Run specific test file
pnpm test tests/unit/auth/oauth.test.ts

# Run tests matching pattern
pnpm test -t "OAuth"
```

### Debug Tests

```bash
# Run with verbose output
pnpm test --reporter=verbose

# Run single test in isolation
pnpm test -t "should refresh expired access token"
```

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach } from "vitest";

describe("Feature Name", () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  it("should do something specific", () => {
    // Arrange
    const input = "test";

    // Act
    const result = someFunction(input);

    // Assert
    expect(result).toBe("expected");
  });
});
```

### Unit Test Example

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { EbayOAuthClient } from "../../../src/auth/oauth.js";
import { createMockTokens } from "../../helpers/mock-token-storage.js";

// Mock TokenStorage module
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

  beforeEach(() => {
    vi.clearAllMocks();
    oauthClient = new EbayOAuthClient({
      clientId: "test_id",
      clientSecret: "test_secret",
      environment: "sandbox",
    });
  });

  it("should load tokens on initialization", async () => {
    const mockTokens = createMockTokens();
    mockTokenStorage.hasTokens.mockResolvedValue(true);
    mockTokenStorage.loadTokens.mockResolvedValue(mockTokens);

    await oauthClient.initialize();

    expect(mockTokenStorage.loadTokens).toHaveBeenCalled();
  });
});
```

### Integration Test Example

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { EbayApiClient } from "../../../src/api/client.js";
import { mockEbayApiEndpoint, cleanupMocks } from "../../helpers/mock-http.js";
import { createMockTokens } from "../../helpers/mock-token-storage.js";

describe("EbayApiClient Integration", () => {
  let apiClient: EbayApiClient;

  beforeEach(async () => {
    vi.clearAllMocks();
    cleanupMocks();

    // Setup mock tokens
    const mockTokens = createMockTokens();
    mockTokenStorage.hasTokens.mockResolvedValue(true);
    mockTokenStorage.loadTokens.mockResolvedValue(mockTokens);
    mockTokenStorage.isAccessTokenExpired.mockReturnValue(false);

    apiClient = new EbayApiClient({
      clientId: "test_id",
      clientSecret: "test_secret",
      environment: "sandbox",
    });
    await apiClient.initialize();
  });

  afterEach(() => {
    cleanupMocks();
  });

  it("should make successful GET request", async () => {
    const mockResponse = { items: [] };

    mockEbayApiEndpoint(
      "/sell/inventory/v1/inventory_item",
      "get",
      "sandbox",
      mockResponse
    );

    const result = await apiClient.get("/sell/inventory/v1/inventory_item");

    expect(result).toEqual(mockResponse);
  });
});
```

## Test Helpers

### Mock Token Storage

**File**: `tests/helpers/mock-token-storage.ts`

**Factory Functions**:

```typescript
// Create valid tokens
const validTokens = createMockTokens();

// Create tokens with expired access token
const expiredAccess = createExpiredAccessToken();

// Create fully expired tokens
const fullyExpired = createFullyExpiredTokens();

// Create tokens with custom values
const customTokens = createMockTokens({
  accessToken: "custom_token",
  expiresIn: 3600,
});
```

**Mock TokenStorage Class**:

```typescript
// Setup mock behavior
mockTokenStorage.hasTokens.mockResolvedValue(true);
mockTokenStorage.loadTokens.mockResolvedValue(validTokens);
mockTokenStorage.isAccessTokenExpired.mockReturnValue(false);
```

### Mock HTTP Requests

**File**: `tests/helpers/mock-http.ts`

**OAuth Token Endpoint**:

```typescript
// Mock successful token exchange
mockOAuthTokenEndpoint("sandbox", {
  access_token: "new_token",
  token_type: "Bearer",
  expires_in: 7200,
  refresh_token: "new_refresh",
  refresh_token_expires_in: 47304000,
});
```

**API Endpoints**:

```typescript
// Mock successful GET request
mockEbayApiEndpoint(
  "/sell/inventory/v1/inventory_item/SKU-001",
  "get",
  "sandbox",
  { sku: "SKU-001", availability: { quantity: 10 } }
);

// Mock POST request with 201 status
mockEbayApiEndpoint(
  "/sell/inventory/v1/offer",
  "post",
  "sandbox",
  { offerId: "123456" },
  201
);

// Mock error response
mockEbayApiError(
  "/sell/inventory/v1/inventory_item/INVALID",
  "get",
  "sandbox",
  "Inventory item not found",
  404
);
```

**Cleanup**:

```typescript
afterEach(() => {
  cleanupMocks(); // Clear all nock interceptors
});
```

## Code Coverage

### Coverage Thresholds

The project maintains the following coverage requirements:

- **Lines**: 70%
- **Functions**: 70%
- **Branches**: 70%
- **Statements**: 70%

### View Coverage Report

```bash
# Generate and view HTML coverage report
pnpm test:coverage
open coverage/index.html  # macOS
start coverage/index.html # Windows
```

### Coverage Configuration

Coverage is configured in `vitest.config.ts`:

```typescript
coverage: {
  provider: "v8",
  reporter: ["text", "json", "html", "lcov"],
  exclude: [
    "node_modules/**",
    "build/**",
    "dist/**",
    "**/*.d.ts",
    "**/*.config.*",
    "**/types/**",
    "tests/**",
  ],
  include: ["src/**/*.ts"],
  thresholds: {
    lines: 70,
    functions: 70,
    branches: 70,
    statements: 70,
  },
}
```

### Improving Coverage

**Identify uncovered code**:

```bash
pnpm test:coverage
# Review coverage/index.html
```

**Focus on**:
- Critical paths (authentication, API calls)
- Error handling branches
- Edge cases
- Complex business logic

**Skip coverage for**:
- Type definitions
- Configuration files
- Generated code
- Simple getters/setters

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10

      - name: Install dependencies
        run: pnpm install

      - name: Run tests
        run: pnpm test:coverage

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Pre-commit Hook

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm test
```

## Best Practices

### 1. Test Naming

**Good**:
```typescript
it("should refresh expired access token using valid refresh token", () => {
  // Test implementation
});
```

**Bad**:
```typescript
it("test token refresh", () => {
  // Test implementation
});
```

### 2. Arrange-Act-Assert Pattern

```typescript
it("should create inventory item successfully", async () => {
  // Arrange
  const inventoryItem = { sku: "TEST-001", availability: { quantity: 10 } };
  mockEbayApiEndpoint("/sell/inventory/v1/inventory_item/TEST-001", "put", "sandbox", undefined, 204);

  // Act
  await inventoryApi.createInventoryItem("TEST-001", inventoryItem);

  // Assert
  expect(true).toBe(true); // No error thrown means success
});
```

### 3. Mock Only What's Needed

**Good**:
```typescript
mockTokenStorage.hasTokens.mockResolvedValue(true);
mockTokenStorage.loadTokens.mockResolvedValue(validTokens);
```

**Bad**:
```typescript
// Mocking everything unnecessarily
mockTokenStorage.hasTokens.mockResolvedValue(true);
mockTokenStorage.loadTokens.mockResolvedValue(validTokens);
mockTokenStorage.saveTokens.mockResolvedValue(undefined);
mockTokenStorage.clearTokens.mockResolvedValue(undefined);
mockTokenStorage.isAccessTokenExpired.mockReturnValue(false);
mockTokenStorage.isRefreshTokenExpired.mockReturnValue(false);
```

### 4. Test One Thing at a Time

**Good**:
```typescript
it("should throw error when SKU is missing", async () => {
  await expect(
    inventoryApi.getInventoryItem("")
  ).rejects.toThrow("SKU is required");
});

it("should handle 404 error for non-existent SKU", async () => {
  mockEbayApiError("/sell/inventory/v1/inventory_item/INVALID", "get", "sandbox", "Not found", 404);

  await expect(
    inventoryApi.getInventoryItem("INVALID")
  ).rejects.toThrow("Not found");
});
```

**Bad**:
```typescript
it("should validate SKU and handle errors", async () => {
  // Testing multiple things in one test
  await expect(inventoryApi.getInventoryItem("")).rejects.toThrow();
  await expect(inventoryApi.getInventoryItem("INVALID")).rejects.toThrow();
});
```

### 5. Clean Up After Tests

```typescript
describe("MyTest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanupMocks();
  });

  afterEach(() => {
    cleanupMocks();
  });

  it("should do something", () => {
    // Test implementation
  });
});
```

### 6. Use Descriptive Test Data

**Good**:
```typescript
const testInventoryItem = {
  sku: "TEST-WIDGET-001",
  availability: { shipToLocationAvailability: { quantity: 50 } },
  product: { title: "Test Widget", description: "A test widget for testing" },
};
```

**Bad**:
```typescript
const item = { sku: "123", availability: { shipToLocationAvailability: { quantity: 1 } } };
```

### 7. Test Error Cases

Always test both success and failure scenarios:

```typescript
describe("getInventoryItem", () => {
  it("should retrieve inventory item successfully", async () => {
    // Success case
  });

  it("should throw error when SKU is missing", async () => {
    // Validation error
  });

  it("should throw error for non-existent SKU", async () => {
    // 404 error
  });

  it("should handle network errors", async () => {
    // Network error
  });
});
```

### 8. Keep Tests Independent

Each test should be able to run independently without relying on other tests:

```typescript
// Good - each test has its own setup
it("test 1", () => {
  const data = createTestData();
  // Test with data
});

it("test 2", () => {
  const data = createTestData();
  // Test with data
});

// Bad - tests depend on shared state
let sharedData;

it("test 1", () => {
  sharedData = createTestData();
  // Test with sharedData
});

it("test 2", () => {
  // Assumes sharedData exists from test 1
  // Test with sharedData
});
```

## Troubleshooting

### Tests Fail with "Cannot find module"

**Solution**: Ensure all imports use `.js` extension:

```typescript
// ✅ Correct
import { foo } from "./foo.js";

// ❌ Wrong
import { foo } from "./foo";
```

### Mock Not Working

**Solution**: Ensure `vi.clearAllMocks()` is called in `beforeEach`:

```typescript
beforeEach(() => {
  vi.clearAllMocks();
  cleanupMocks();
});
```

### HTTP Mocks Not Intercepting

**Solution**: Ensure cleanup is called after each test:

```typescript
afterEach(() => {
  cleanupMocks();
});
```

### Coverage Not Generated

**Solution**: Ensure `vitest.config.ts` is correctly configured and run:

```bash
pnpm test:coverage
```

## Further Reading

- [Vitest Documentation](https://vitest.dev/)
- [Nock Documentation](https://github.com/nock/nock)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Test Driven Development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development)
