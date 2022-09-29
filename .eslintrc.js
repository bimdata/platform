module.exports = {
  root: true,
  ignorePatterns: ["/dist", "/tests"],
  env: {
    node: true,
    browser: true,
    es2021: true
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
