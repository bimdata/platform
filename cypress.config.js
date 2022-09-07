const { defineConfig } = require("cypress");
const { webcrypto } = require("node:crypto");

// Password generation config
const PWD_LENGTH = 16;
const PWD_CHARS =
  "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";

module.exports = defineConfig({
  e2e: {
    specPattern: [
      // Execute "signup tests" first in order to create test users
      "tests/e2e/specs/signup/*.cy.{js,jsx,ts,tsx}",
      "tests/e2e/specs/*.cy.{js,jsx,ts,tsx}"
    ],
    supportFile: "tests/e2e/support/index.js",
    downloadsFolder: "tests/e2e/downloads",
    fixturesFolder: "tests/e2e/fixtures",
    screenshotsFolder: "tests/e2e/screenshots",
    videosFolder: "tests/e2e/videos",
    experimentalSessionAndOrigin: true,

    baseUrl: "https://platform-dev-e2e-tests.bimdata.io",

    setupNodeEvents(on) {
      on("task", {
        "generate-logins": () => {
          let email = `${webcrypto.randomUUID()}@bimdata.test`;
          let password = webcrypto
            .getRandomValues(new Uint32Array(PWD_LENGTH))
            .reduce((p, byte) => (p += PWD_CHARS[byte % PWD_CHARS.length]), "");

          return {
            email,
            password
          };
        }
      });
    }
  }
});
