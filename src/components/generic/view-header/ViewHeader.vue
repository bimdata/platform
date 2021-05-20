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
      <app-slot name="view-header-right" />
    </div>
  </div>
</template>

<script>
import AppSlot from "@/components/generic/app-slot/AppSlot";

export default {
  components: {
    AppSlot
  }
};
</script>

<style scoped lang="scss" src="./ViewHeader.scss"></style>
