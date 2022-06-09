<template>
  <ModelsManagerWrapper
    :project="project"
    :tabs="tabs"
    :modelType="MODEL_TYPE.PDF"
  />
</template>

<script>
import { ref, watch } from "vue";
import { MODEL_TYPE } from "@/config/models.js";
import { segregateBySource } from "@/utils/models.js";
// Components
import ModelsManagerWrapper from "../models-manager-wrapper/ModelsManagerWrapper.vue";

const tabsDef = [{ id: "upload" }, { id: "metaBuildings" }, { id: "archive" }];

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
        const modelsBySource = segregateBySource(
          models.filter(model => model.type !== MODEL_TYPE.META_BUILDING)
        );
        const metaBuildings = models.filter(
          model => model.type === MODEL_TYPE.META_BUILDING
        );
        tabs.value = tabs.value.map(tab => ({
          ...tab,
          label: tab.label || tab.id,
          models:
            tab.id === "metaBuildings" ? metaBuildings : modelsBySource[tab.id]
        }));
      },
      { immediate: true }
    );

    return {
      MODEL_TYPE,
      tabs
    };
  }
};
</script>
