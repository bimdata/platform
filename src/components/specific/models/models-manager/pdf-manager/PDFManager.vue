<template>
  <div class="pdf-manager">
    <!-- TODO -->
    <h2>PDF Manager</h2>
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
.pdf-manager {
  width: 100%;
  height: 100%;

  // TODO
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
