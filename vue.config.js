module.exports = {
  // Avoid compilation failure on linter errors
  lintOnSave: "warning",
  css: {
    loaderOptions: {
      sass: {
        // Make SASS variables and mixins available everywhere
        prependData: `
          @import "@/styles/variables.scss";
          @import "@/styles/mixins.scss";
        `
      }
    }
  }
};
