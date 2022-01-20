<template>
  <div class="pdf-manager">
    <PDFTable :project="project" :models="models" />
  </div>
</template>

<script>
// Components
import PDFTable from "./pdf-table/PDFTable.vue";

export default {
  components: {
    PDFTable
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
.pdf-manager {
  width: 100%;
  height: 100%;
}
</style>
