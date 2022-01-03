<template>
  <div class="app-loader">
    <BIMDataSpinner />
  </div>
</template>

<style scoped lang="scss">
.app-loader {
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  .bimdata-spinner {
    transform: scale(2);
  }
}
</style>
