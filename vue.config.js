module.exports = {
  // Avoid compilation failure on linter errors
  lintOnSave: "warning",
  css: {
    loaderOptions: {
      sass: {
        // Make SCSS variables available everywhere
        prependData: `
          @import '@/styles/variables.scss';
        `
      }
    }
  }
};
