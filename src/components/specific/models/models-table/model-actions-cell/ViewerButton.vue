<template>
  <BIMDataTooltip :text="disabled ? tooltip : ''" position="bottom">
    <AppLink
      data-test-id="btn-open-viewer"
      :data-test-param="window"
      :disabled="disabled"
      :to="{
        name: routeNames.modelViewer,
        params: {
          spaceID: project.cloud.id,
          projectID: project.id,
          modelIDs: model.id,
        },
        query: {
          window,
        },
      }"
    >
      <BIMDataButton :disabled="disabled" class="viewer-button" :color="color" outline radius icon>
        <span>
          {{ text || window.toUpperCase() }}
        </span>
        <slot name="subtext"> </slot>
      </BIMDataButton>
    </AppLink>
  </BIMDataTooltip>
</template>

<script setup>
import { DEFAULT_WINDOW } from "../../../../../config/viewer.js";
import routeNames from "../../../../../router/route-names.js";
// Components
import AppLink from "../../../app/app-link/AppLink.vue";

defineProps({
  project: {
    type: Object,
    required: true,
  },
  model: {
    type: Object,
    required: true,
  },
  window: {
    type: String,
    default: DEFAULT_WINDOW,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
  },
  tooltip: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "granite",
  },
});
</script>

<style scoped>
.viewer-button {
  color: var(--color-granite-light);

  &:disabled {
    opacity: 0.4;
  }
}
</style>
