<template>
  <BIMDataCard class="viewer-card">
    <template #left>
      <BIMDataButton color="primary" fill radius @click="goToViewer">
        <BIMDataIcon name="show" size="xs" />
        <span>{{ $t("ViewerCard.buttonOpen") }}</span>
      </BIMDataButton>
    </template>
    <template #content>
      <ViewerCardModelPreview
        :models="models"
        @model-change="$emit('model-change', $event)"
      />
    </template>
  </BIMDataCard>
</template>

<script>
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
  emits: ["model-change"],
  setup() {
    const goToViewer = () => {};

    return {
      goToViewer
    };
  }
};
</script>

<style scoped lang="scss" src="./ViewerCard.scss"></style>
