<template>
  <div
    class="responsive-grid"
    :style="{ gridTemplateColumns: `repeat(auto-fill, ${itemWidth})` }"
  >
    <transition-group name="grid">
      <slot></slot>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    itemWidth: {
      type: String,
      default: "100px"
    }
  }
};
</script>

<style scoped lang="scss" src="./ResponsiveGrid.scss"></style>
