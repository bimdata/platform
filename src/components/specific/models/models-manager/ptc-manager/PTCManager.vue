<template>
  <div class="ptc-manager">
    <!-- TODO -->
    <h2>Point Cloud Manager</h2>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    models: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style scoped lang="scss">
.ptc-manager {
  width: 100%;
  height: 100%;

  // TODO
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
