<script setup>
import { ref, watch } from "vue";
import { segregateBySource } from "../../../../../utils/models.js";
// Components
import GenericModelsManager from "../generic-models-manager/GenericModelsManager.vue";

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  models: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});

const tabsDef = [{ id: "upload" }, { id: "archive" }];
const tabs = ref([]);

watch(
  () => props.models,
  models => {
    const modelsBySource = segregateBySource(models);
    tabs.value = tabsDef.map(tab => ({
      ...tab,
      label: tab.label || tab.id,
      models: modelsBySource[tab.id]
    }));
  },
  { immediate: true }
);
</script>

<template>
  <GenericModelsManager :project="project" :type="type" :tabs="tabs" />
</template>
