module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:cypress/recommended"
  ],
  rules: {
    "cypress/require-data-selectors": "off",
    "prettier/prettier": ["error", { trailingComma: "none" }]
  }
};
