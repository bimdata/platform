module.exports = {
  root: true,
  ignorePatterns: ["/dist", "/tests"],
  env: {
    browser: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:vue/vue3-essential"
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        trailingComma: "none",
        arrowParens: "avoid"
      }
    ]
  }
};
