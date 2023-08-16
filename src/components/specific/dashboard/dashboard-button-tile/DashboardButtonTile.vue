<template>
  <div class="dashboard-button-tile" :class="color">
    <span class="dashboard-button-tile__title">
      <slot name="title"></slot>
    </span>
    <span class="dashboard-button-tile__content">
      <slot name="content"></slot>
    </span>
    <span class="dashboard-button-tile__bottom-text">
      <slot name="bottom-text"></slot>
      <BIMDataIconArrow size="xs" margin="0 0 0 12px" :rotate="180" />
    </span>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped lang="scss" src="./DashboardButtonTile.scss"></style>
