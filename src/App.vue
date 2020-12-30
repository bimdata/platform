<template>
  <router-view />
</template>

<style lang="scss">
@import '~@bimdata/design-system/dist/scss/utilities/spacing.scss';
@import '~@bimdata/design-system/dist/scss/utilities/text.scss';

body {
  margin: 0;
  padding: 0;
  min-width: 100vw;
  min-height: 100vh;
  background-color: $color-tertiary-lightest;
  font-family: $primary-font;
  font-size: $font-size;
}
</style>
