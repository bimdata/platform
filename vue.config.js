module.exports = {
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
