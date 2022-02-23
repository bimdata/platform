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
  }
};
