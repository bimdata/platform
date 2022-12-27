module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:cypress/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "cypress/require-data-selectors": "off",
  },
};
