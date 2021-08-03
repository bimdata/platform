<template>
  <div class="dashboard-button-tile" :class="color">
    <span class="dashboard-button-tile__title">
      <slot name="title"></slot>
    </span>
    <span class="dashboard-button-tile__number">
      <slot name="number"></slot>
    </span>
    <span class="dashboard-button-tile__text">
      <slot name="text"></slot>
      <BIMDataIcon
        class="arrow-icon"
        name="arrow"
        size="s"
        margin="0 0 0 6px"
      />
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
