<template>
  <div class="dashboard-button-tile" :class="color">
    <span class="dashboard-button-tile__icon">
      <slot name="icon"></slot>
    </span>
    <span class="dashboard-button-tile__count">
      <slot name="count"></slot>
    </span>
    <span class="dashboard-button-tile__label">
      <slot name="label"></slot>
    </span>
    <span class="dashboard-button-tile__button">
      {{ buttonText }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: ""
    },
    buttonText: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped lang="scss" src="./DashboardButtonTile.scss"></style>
