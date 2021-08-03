<template>
  <BIMDataCard class="models-card">
    <template #left>
      <BIMDataButton color="primary" fill radius @click="goToModelViewer">
        <BIMDataIcon name="show" size="xs" margin="0 6px 0 0" />
        <span>{{ $t("ModelsCard.openButtonText") }}</span>
      </BIMDataButton>
    </template>
    <template #content>
      <ModelsCardModelPreview :models="models" @model-changed="onModelChange" />
    </template>
  </BIMDataCard>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
// Components
import ModelsCardModelPreview from "./models-card-model-preview/ModelsCardModelPreview";

export default {
  components: {
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
    const router = useRouter();

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

    const goToModelViewer = () => {
      router.push({
        name: routeNames.modelViewer,
        params: {
          spaceID: props.project.cloud.id,
          projectID: props.project.id,
          modelIDs: currentModel.value.id
        }
      });
    };

    return {
      // Methods
      goToModelViewer,
      onModelChange
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsCard.scss"></style>
