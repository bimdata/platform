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
  types: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(["file-uploaded"]);

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
  <GenericModelsManager
    :project="project"
    :types="types"
    :tabs="tabs"
    @file-uploaded="emit('file-uploaded')"
  />
</template>
