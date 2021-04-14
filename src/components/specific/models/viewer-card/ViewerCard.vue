<template>
  <BIMDataCard class="viewer-card">
    <template #left>
      <BIMDataButton color="primary" fill radius @click="goToModelViewer">
        <BIMDataIcon name="show" size="xs" />
        <span>{{ $t("ViewerCard.buttonOpen") }}</span>
      </BIMDataButton>
    </template>
    <template #content>
      <ViewerCardModelPreview :models="models" @model-changed="onModelChange" />
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
import ViewerCardModelPreview from "@/components/specific/models/viewer-card-model-preview/ViewerCardModelPreview";

export default {
  components: {
    BIMDataButton,
    BIMDataCard,
    BIMDataIcon,
    ViewerCardModelPreview
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

<style scoped lang="scss" src="./ViewerCard.scss"></style>
