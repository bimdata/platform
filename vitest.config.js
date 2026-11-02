import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["tests/unit/**/*.spec.js"],
    setupFiles: ["tests/unit/setup.js"],
  },
});
