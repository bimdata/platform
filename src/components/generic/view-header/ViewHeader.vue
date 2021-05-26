<template>
  <div class="view-header">
    <div class="view-header__slot view-header__slot--left">
      <slot name="left"></slot>
    </div>
    <div class="view-header__slot view-header__slot--center">
      <slot name="center"></slot>
    </div>
    <div class="view-header__slot view-header__slot--right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss" src="./ViewHeader.scss"></style>
