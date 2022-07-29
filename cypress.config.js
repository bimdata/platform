const { defineConfig } = require("cypress");

module.exports = defineConfig({
  downloadsFolder: "tests/e2e/downloads",
  fixturesFolder: "tests/e2e/fixtures",
  screenshotsFolder: "tests/e2e/screenshots",
  videosFolder: "tests/e2e/videos",
  e2e: {
    baseUrl: "https://platform-dev-e2e-tests.bimdata.io",
    specPattern: "tests/e2e/specs/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "tests/e2e/support/index.js",
    experimentalSessionAndOrigin: true
  }
});
