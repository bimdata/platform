module.exports = {
  extends: [
    "@bimdata/eslint-config",
    "plugin:vue/vue3-essential"
  ],
  rules: {
    "vue/no-v-for-template-key": "off",
    "vue/no-multiple-template-root": "off"
  }
};
