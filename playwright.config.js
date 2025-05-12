const { defineConfig, devices } = require("@playwright/test");

const STORAGE_STATE = "playwright/.auth/user.json";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: "./playwright",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "dot",

  /* Shared settings for all the projects below.
   * See https://playwright.dev/docs/api/class-testoptions.
   */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://127.0.0.1:8080",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry"
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testMatch: /setup\.js/
    },
    {
      name: "chromium",
      dependencies: ["setup"],
      testMatch: "features/*.spec.js",
      use: {
        ...devices["Desktop Chrome"],
        storageState: STORAGE_STATE
      }
    }
    // {
    //   name: "firefox",
    //   dependencies: ["setup"],
    //   testMatch: "features/*.spec.js",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //     storageState: STORAGE_STATE
    //   }
    // }
    // {
    //   name: "webkit",
    //   dependencies: ["setup"],
    //   use: {
    //     ...devices["Desktop Safari"],
    //     storageState: STORAGE_STATE
    //   }
    // }
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:8080",
    reuseExistingServer: !process.env.CI
  }
});
