<template>
  <ModelsSubManager :project="project" :models="models" />
</template>

<script>
import ModelsSubManager from "../models-sub-manager/ModelsSubManager.vue";

export default {
  components: {
    ModelsSubManager
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
