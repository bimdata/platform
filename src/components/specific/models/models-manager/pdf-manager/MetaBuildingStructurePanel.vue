<template>
  <div class="meta-building-structure-panel">
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
      <BIMDataMetaBuildingStructure
        :apiClient="apiClient"
        :space="space"
        :project="project"
        :model="model"
        :selectable="false"
      />
    </div>
  </div>
</template>

<script setup>
import apiClient from "../../../../../services/api-client.js";

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
    required: true
  },
});

defineEmits(["close"]);
</script>

<style scoped>
.meta-building-structure-panel {
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

  &:deep(.bimdata-tree) {
    height: calc(100% - 44px);
  }
}
</style>
