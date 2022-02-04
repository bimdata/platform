<template>
  <ModelsManagerWrapper :project="project" :models="models" />
</template>

<script>
import ModelsManagerWrapper from "../models-manager-wrapper/ModelsManagerWrapper.vue";

export default {
  components: {
    ModelsManagerWrapper
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
