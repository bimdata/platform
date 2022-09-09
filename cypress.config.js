const { defineConfig } = require("cypress");
const { APP_BASE_URL } = require("./cypress.env.json");
const { generateLogins } = require("./tests/e2e/test-utils.js");

const users = new Map();

module.exports = defineConfig({
  chromeWebSecurity: false,
  e2e: {
    specPattern: [
      // Execute "setup tests" first in order to create test users
      "tests/e2e/specs/setup/*.cy.{js,jsx,ts,tsx}",
      // Then run all feature tests
      "tests/e2e/specs/features/*.cy.{js,jsx,ts,tsx}",
      // Finally, execute "teardown tests" to delete users
      "tests/e2e/specs/teardown/*.cy.{js,jsx,ts,tsx}"
    ],
    supportFile: "tests/e2e/support/index.js",
    downloadsFolder: "tests/e2e/downloads",
    fixturesFolder: "tests/e2e/fixtures",
    screenshotsFolder: "tests/e2e/screenshots",
    videosFolder: "tests/e2e/videos",
    experimentalSessionAndOrigin: true,

    baseUrl: APP_BASE_URL,

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
