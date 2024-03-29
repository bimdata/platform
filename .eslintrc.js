module.exports = {
  root: true,
  ignorePatterns: ["/dist", "/tests"],
  env: {
    node: true,
    browser: true,
    es2023: true
  },
  globals: {
    ENV: "readonly",
    Paddle: "readonly"
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:vue/vue3-essential"
  ],
  rules: {
    "vue/multi-word-component-names": "off",
    "prettier/prettier": [
      "error",
      {
        trailingComma: "none",
        arrowParens: "avoid"
      }
    ]
  }
};
