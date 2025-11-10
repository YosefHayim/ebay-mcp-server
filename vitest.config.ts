import { defineConfig } from "vitest/config";

export default defineConfig({
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
      ],
      include: ["src/**/*.ts"],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules", "build", "dist"],
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
