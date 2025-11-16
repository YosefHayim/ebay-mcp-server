import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
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
        // Exclude schema definition files (no logic to test)
        "src/utils/**",
        "src/schemas/**",
        // Exclude server entry points (tested via integration)
        "src/index.ts",
        "src/server-http.ts",
        // Exclude simple template generators
        "src/tools/token-template.ts",
        "src/tools/tool-definitions.ts",
        // Exclude script files
        "src/scripts/**",
      ],
      include: ["src/**/*.ts"],
      thresholds: {
        lines: 75,
        functions: 90,
        branches: 65,
        statements: 75,
      },
    },
    include: ["tests/unit/**/*.test.ts"],
    exclude: [
      "node_modules",
      "build",
      "dist",
      "tests/integration/**",
    ],
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
