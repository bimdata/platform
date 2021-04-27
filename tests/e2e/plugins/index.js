// ***********************************************
// See documentation for more info:
// https://docs.cypress.io/guides/guides/plugins-guide.html
// ***********************************************

module.exports = (on, config) => {
  return Object.assign({}, config, {
    integrationFolder: "tests/e2e/specs",
    fixturesFolder: "tests/e2e/fixtures",
    supportFile: "tests/e2e/support/index.js",
    downloadsFolder: "tests/e2e/downloads",
    screenshotsFolder: "tests/e2e/screenshots",
    videosFolder: "tests/e2e/videos"
  });
};
