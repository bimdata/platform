const { defineConfig } = require("cypress");
const { existsSync } = require("fs");
const { generateLogins } = require("./tests/e2e/test-utils.cjs");

const users = new Map();

let baseUrl = process.env.CYPRESS_APP_BASE_URL;
if (existsSync("./cypress.env.json")) {
  baseUrl = require("./cypress.env.json").APP_BASE_URL;
}

module.exports = defineConfig({
  // This is necessary to handle signup/login scenarios with redirection
  chromeWebSecurity: false,

  downloadsFolder: "tests/e2e/downloads",
  fixturesFolder: "tests/e2e/fixtures",
  screenshotsFolder: "tests/e2e/screenshots",
  videosFolder: "tests/e2e/videos",

  viewportWidth: 1625,
  viewportHeight: 728,

  e2e: {
    supportFile: "tests/e2e/support/index.js",
    specPattern: [
      // Execute "setup tests" first in order to create test users
      "tests/e2e/specs/setup/*.cy.{js,jsx,ts,tsx}",
      // Then run all feature tests
      "tests/e2e/specs/features/*.cy.{js,jsx,ts,tsx}",
      // Finally, execute "teardown tests" to delete users
      "tests/e2e/specs/teardown/*.cy.{js,jsx,ts,tsx}"
    ],

    baseUrl,

    setupNodeEvents(on) {
      on("task", {
        "create-user": ({ key, firstname, lastname }) => {
          const user = { firstname, lastname, ...generateLogins() };
          users.set(key, user);
          return user;
        },
        "get-user": key => {
          return users.get(key);
        }
      });
    }
  }
});
