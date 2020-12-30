module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import '~@bimdata/design-system/dist/scss/BIMDataVariables.scss';
        `
      }
    }
  }
}