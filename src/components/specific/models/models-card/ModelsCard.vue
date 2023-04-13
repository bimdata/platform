<template>
  <BIMDataCard class="models-card">
    <template #left>
      <AppLink
        data-test-id="btn-open-viewer"
        :data-test-param="model.id"
        :to="{
          name: routeNames.modelViewer,
          params: {
            spaceID: project.cloud.id,
            projectID: project.id,
            modelIDs: model.id
          },
          query: {
            window: MODEL_CONFIG[model.type].window
          }
        }"
      >
        <BIMDataButton color="primary" fill radius>
          <BIMDataIcon name="show" size="xs" margin="0 6px 0 0" />
          <span>{{ $t("ModelsCard.openButtonText") }}</span>
        </BIMDataButton>
      </AppLink>
    </template>
    <template #content>
      <ModelsCardModelPreview
        data-guide="preview-ifc"
        :models="models"
        @model-changed="onModelChange"
      />
    </template>
  </BIMDataCard>
</template>

<script>
import { ref, watch } from "vue";
import { MODEL_CONFIG } from "../../../../config/models.js";
import routeNames from "../../../../router/route-names.js";
// Components
import AppLink from "../../app/app-link/AppLink.vue";
import ModelsCardModelPreview from "./models-card-model-preview/ModelsCardModelPreview.vue";

export default {
  components: {
    AppLink,
    ModelsCardModelPreview
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
  emits: ["model-changed"],
  setup(props, { emit }) {
    const currentModel = ref(null);

    watch(
      () => props.models,
      () => {
        currentModel.value = props.models.length > 0 ? props.models[0] : null;
      },
      { immediate: true }
    );

    const onModelChange = model => {
      if (!currentModel.value || currentModel.value.id !== model.id) {
        currentModel.value = model;
        emit("model-changed", model);
      }
    };

    return {
      // References
      model: currentModel,
      MODEL_CONFIG,
      routeNames,
      // Methods
      onModelChange
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsCard.scss"></style>
