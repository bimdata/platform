const { defineConfig } = require("cypress");

module.exports = defineConfig({
  downloadsFolder: "tests/e2e/downloads",
  fixturesFolder: "tests/e2e/fixtures",
  screenshotsFolder: "tests/e2e/screenshots",
  videosFolder: "tests/e2e/videos",
  e2e: {
    baseUrl: "https://platform.bimdata.test",
    specPattern: [
      // Execute "signup tests" first in order to create test users
      "tests/e2e/specs/signup/*.cy.{js,jsx,ts,tsx}",
      "tests/e2e/specs/*.cy.{js,jsx,ts,tsx}"
    ],
    supportFile: "tests/e2e/support/index.js",
    experimentalSessionAndOrigin: true
  }
});
