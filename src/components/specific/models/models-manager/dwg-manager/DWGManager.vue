<template>
  <div class="dwg-manager">
    <DWGTable :project="project" :models="models" />
  </div>
</template>

<script>
// Components
import DWGTable from "./dwg-table/DWGTable.vue";

export default {
  components: {
    DWGTable
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    models: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped lang="scss">
.dwg-manager {
  width: 100%;
  height: 100%;
}
</style>
