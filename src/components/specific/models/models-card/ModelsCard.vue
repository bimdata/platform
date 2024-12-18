<template>
  <BIMDataCard class="models-card">
    <template #left>
      <AppLink
        data-test-id="btn-open-viewer"
        :data-test-param="currentModel.id"
        :to="{
          name: routeNames.modelViewer,
          params: {
            spaceID: project.cloud.id,
            projectID: project.id,
            modelIDs: currentModel.id
          },
          query: {
            window: MODEL_CONFIG[currentModel.type].window
          }
        }"
      >
        <BIMDataButton color="primary" fill radius :disabled="currentModel.status !== 'C'">
          <BIMDataIconShow size="xs" margin="0 6px 0 0" />
          <span>{{ $t("t.open") }}</span>
        </BIMDataButton>
      </AppLink>
    </template>
    <template #content>
      <ModelsCardModelPreview
        data-guide="preview-ifc"
        :project="project"
        :models="models"
        @model-changed="onModelChange"
      />
    </template>
  </BIMDataCard>
</template>

<script setup>
import { ref, watch } from "vue";
import { MODEL_CONFIG } from "../../../../config/models.js";
import routeNames from "../../../../router/route-names.js";
// Components
import AppLink from "../../app/app-link/AppLink.vue";
import ModelsCardModelPreview from "./models-card-model-preview/ModelsCardModelPreview.vue";

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  models: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(["model-changed"]);

const currentModel = ref(null);

const onModelChange = model => {
  if (!currentModel.value || currentModel.value.id !== model.id) {
    currentModel.value = model;
    emit("model-changed", model);
  }
};

watch(
  () => props.models,
  () => {
    currentModel.value = props.models[0];
  },
  { immediate: true }
);
</script>

<style scoped src="./ModelsCard.css"></style>
