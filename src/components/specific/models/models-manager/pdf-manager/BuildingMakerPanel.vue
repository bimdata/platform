<template>
  <div class="building-maker-panel">
    <BIMDataButton
      class="close"
      ghost
      rounded
      icon
      @click="$emit('close')"
    >
      <BIMDataIconClose size="xxs" fill color="granite-light" />
    </BIMDataButton>
    <div class="content">
      <BIMDataBuildingMaker
        :apiClient="apiClient"
        :space="space"
        :project="project"
        :model="model"
        @metaBuilding-created="loadProjectModels(project)"
        @metaBuilding-updated="loadProjectModels(project)"
        @metaBuilding-deleted="loadProjectModels(project)"
      />
    </div>
  </div>
</template>

<script setup>
import apiClient from "../../../../../services/api-client.js";
import { useModels } from "../../../../../state/models.js";

const { loadProjectModels } = useModels();

defineProps({
  space: {
    type: Object,
    required: true
  },
  project: {
    type: Object,
    required: true
  },
  model: {
    type: Object,
    default: null
  },
});

defineEmits(["close"]);
</script>

<style scoped>
.building-maker-panel {
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .close {
    position: absolute;
    z-index: 1;
    top: calc(var(--spacing-unit) / 2);
    right: var(--spacing-unit);
  }

  .content {
    height: 100%;
  }
}
</style>
