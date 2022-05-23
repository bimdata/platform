const { resolve } = require("path");

module.exports = {
  // Avoid compilation failure on linter errors
  lintOnSave: "warning",
  css: {
    loaderOptions: {
      sass: {
        // Make global SASS mixins available everywhere
        additionalData: `
          @import "@/styles/mixins.scss";
        `
      }
    }
  },
  chainWebpack: config => {
    // This is to ensure that the same vue instance is used
    // even when working in dev mode with locally linked libs.
    // See: https://github.com/vuejs/core/issues/1503#issuecomment-653849674
    config.resolve.alias.set("vue$", resolve(__dirname, "node_modules/vue"));
  }
};
