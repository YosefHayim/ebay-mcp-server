# Project TODO List

This document outlines the remaining tasks to complete the eBay API MCP Server and areas where contributors can help. This list has been refined based on a detailed analysis of the source code against the OpenAPI specifications.

## 🚀 Core Goal

The primary objective is to implement all eBay Sell APIs defined in the OpenAPI specifications located in the `docs/sell-apps/` directory, making them available as tools via the Model Context Protocol (MCP).

---

## 📝 API Implementation

The following is a more detailed breakdown of the implementation status for each API category. The main focus is to build out the missing and partial implementations.

### Account API (`sell_account_v1_oas3.json`)
This API is partially implemented. While some functions for retrieving collections of policies exist, most of the operations for creating, updating, deleting, and fetching individual items are missing.

-   [x] `getCustomPolicies`
-   [x] `getFulfillmentPolicies`
-   [x] `getPaymentPolicies`
-   [x] `getReturnPolicies`
-   [x] `getPrivileges`
-   [ ] `createCustomPolicy`
-   [ ] `getCustomPolicy`
-   [ ] `updateCustomPolicy`
-   [ ] `createFulfillmentPolicy`
-   [ ] `deleteFulfillmentPolicy`
-   [ ] `getFulfillmentPolicy`
-   [ ] `getFulfillmentPolicyByName`
-   [ ] `updateFulfillmentPolicy`
-   [ ] `getKYC`
-   [ ] `createPaymentPolicy`
-   [ ] `deletePaymentPolicy`
-   [ ] `getPaymentPolicy`
-   [ ] `getPaymentPolicyByName`
-   [ ] `updatePaymentPolicy`
-   [ ] `getPaymentsProgram`
-   [ ] `getPaymentsProgramOnboarding`
-   [ ] `getOptedInPrograms`
-   [ ] `optInToProgram`
-   [ ] `optOutOfProgram`
-   [ ] `getRateTables`
-   [ ] `createReturnPolicy`
-   [ ] `deleteReturnPolicy`
-   [ ] `getReturnPolicy`
-   [ ] `getReturnPolicyByName`
-   [ ] `updateReturnPolicy`
-   [ ] `getSubscription`
-   [ ] `createOrReplaceSalesTax`
-   [ ] `deleteSalesTax`
-   [ ] `getSalesTax`
-   [ ] `getSalesTaxes`
-   [ ] `bulkCreateOrReplaceSalesTax`

### Listing & Inventory Management
This section has several placeholder type files, indicating that the implementation is incomplete.

-   [ ] **Perform Gap Analysis**: A contributor needs to analyze the OpenAPI specs for these APIs and create a detailed checklist similar to the Account API one.
-   [ ] **Feed API**: Implement handlers and types.
-   [ ] **Media API**: Implement handlers and types.
-   [ ] **Merchant Integration Platform**: Implement handlers and types.
-   [ ] **Stores API**: Implement handlers and types.
-   [ ] **Traditional Listing API**: Implement handlers and types.

### Other APIs
A full gap analysis is needed for the remaining APIs.

-   [ ] **Perform Gap Analysis**: For each API below, a contributor needs to compare the implementation in `src/api/` with the spec in `docs/` and create a detailed checklist of missing operations.
    -   [ ] Analytics & Report (`sell_analytics_v1_oas3.json`)
    -   [ ] Communication (Feedback, Message, Notification, Negotiation)
    -   [ ] Marketing & Promotions
    -   [ ] Order Management
    -   [ ] Other APIs (Identity, Translation, VERO, etc.)

---

## 🧹 Refactoring & Cleanup

-   [ ] **Investigate Code Duplication**: The function `getReturnPolicies` is implemented in both `src/api/account-management/account.ts` and `src/api/listing-metadata/metadata.ts`. This needs to be investigated and consolidated into the correct API client.
-   [ ] **Remove extraneous directories**: The directory `docs/sell-apps/listing-metadata copy/` appears to be an accidental duplication and should be removed after verification.
-   [ ] **Scan for TODO/FIXME comments**: A global search for `// TODO` and `// FIXME` comments should be performed to identify and address smaller, isolated tasks.

---

## 🧪 Testing

The project currently lacks an automated testing framework. This is a high-priority area for contributions.

-   [ ] **Setup Testing Framework**:
    -   Integrate a testing framework like [Jest](https://jestjs.io/), [Vitest](https://vitest.dev/), or [Mocha](https://mochajs.org/) into the project.
    -   Configure scripts in `package.json` to run tests.
-   [ ] **Write Unit Tests**:
    -   Add unit tests for existing API handlers in the `src/api/` directory.
    -   Mock dependencies like the `axios` client to isolate tests.
-   [ ] **Write Integration Tests**:
    -   Develop integration tests that call the MCP server and verify that it correctly interacts with a mock eBay API.

---

## 🏗️ Project Infrastructure & Developer Experience

-   [ ] **Setup CI/CD**:
    -   Create a GitHub Actions workflow (`.github/workflows/`) to automatically run tests, linting, and type-checking on pull requests.
    -   Add a workflow to publish the package to npm on new releases.
-   [ ] **Add Linter and Formatter**:
    -   Integrate [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to enforce a consistent code style.
    -   Add a `lint` and `format` script to `package.json`.
-   [ ] **Improve In-Code Documentation**:
    -   Add TSDoc comments to functions, classes, and types to explain their purpose, parameters, and return values.

---

## 🤝 Contributor Guidance

-   [ ] **Create `CONTRIBUTING.md`**:
    -   Write a guide for new contributors explaining how to set up the development environment, run tests, and submit pull requests.
-   [ ] **Create `CODE_OF_CONDUCT.md`**:
    -   Add a standard Code of Conduct to foster a welcoming and inclusive community.

---

### How to Contribute
1.  **Pick a Task**: Choose an unchecked task from this list.
2.  **Open an Issue**: Create a new issue to let us know you're working on it.
3.  **Fork & Code**: Fork the repository and create a new branch for your feature or fix.
4.  **Submit a Pull Request**: Once your work is complete, submit a PR and link it to the issue you created.

Thank you for helping to improve the project!
