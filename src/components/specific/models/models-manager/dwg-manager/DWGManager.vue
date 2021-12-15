<template>
  <div class="dwg-manager">
    <!-- TODO -->
    <h2>DWG Manager</h2>
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
.dwg-manager {
  width: 100%;
  height: 100%;

  // TODO
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
