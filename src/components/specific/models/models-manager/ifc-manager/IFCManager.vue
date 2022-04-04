<template>
  <ModelsManagerWrapper :project="project" :models="models" :tabs="tabs" />
</template>

<script>
import { ref, watch } from "vue";
import { segregateBySource } from "@/utils/models.js";
// Components
import ModelsManagerWrapper from "../models-manager-wrapper/ModelsManagerWrapper.vue";

const tabsDef = [{ id: "upload" }, { id: "split" }, { id: "archive" }];

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
  },
  setup(props) {
    const tabs = ref(tabsDef);

    watch(
      () => props.models,
      models => {
        const modelsBySource = segregateBySource(models);
        tabs.value = tabs.value.map(tab => ({
          ...tab,
          label: tab.label || tab.id,
          models: modelsBySource[tab.id]
        }));
      },
      { immediate: true }
    );

    return {
      tabs
    };
  }
};
</script>
