<template>
  <GenericModelsManager
    :project="project"
    :types="types"
    :tabs="tabs"
    @file-uploaded="$emit('file-uploaded')"
  />
</template>

<script>
import { ref, watch } from "vue";
import { segregateBySource } from "../../../../../utils/models.js";
// Components
import GenericModelsManager from "../generic-models-manager/GenericModelsManager.vue";

const tabsDef = [{ id: "upload" }, { id: "split" }, {id: "merge"}, { id: "archive" }];

export default {
  components: {
    GenericModelsManager
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    models: {
      type: Array,
      required: true
    },
    types: {
      type: Array,
      required: true
    }
  },
  emits: ["file-uploaded"],
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
