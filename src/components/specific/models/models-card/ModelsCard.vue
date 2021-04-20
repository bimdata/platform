<template>
  <BIMDataCard class="models-card">
    <template #left>
      <BIMDataButton color="primary" fill radius @click="goToModelViewer">
        <BIMDataIcon name="show" size="xs" />
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
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import ModelsCardModelPreview from "./models-card-model-preview/ModelsCardModelPreview";

export default {
  components: {
    BIMDataButton,
    BIMDataCard,
    BIMDataIcon,
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

    const currentModel = ref();
    watch(
      () => props.models,
      () => {
        currentModel.value = props.models[0];
      },
      { immediate: true }
    );

    const onModelChange = model => {
      currentModel.value = model;
      emit("model-changed", model);
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
      goToModelViewer,
      onModelChange
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsCard.scss"></style>
