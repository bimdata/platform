<template>
  <BIMDataCard
    class="models-overview"
    :titleHeader="$t('ModelsOverview.title')"
  >
    <template #content>
      <template v-if="models.length > 0">
        <ModelsCard
          :project="project"
          :models="models"
          @model-changed="onModelChange"
        />
        <ModelLocation v-if="!isLG" :project="project" :model="currentModel" />
      </template>
      <template v-else>
        <ModelsOverviewOnboarding
          @open-file-uploader="$emit('open-file-uploader')"
        />
      </template>
    </template>
  </BIMDataCard>
</template>

<script>
import { ref, watch } from "vue";
import { useStandardBreakpoints } from "../../../../composables/responsive.js";
// Components
import ModelLocation from "../model-location/ModelLocation.vue";
import ModelsCard from "../models-card/ModelsCard.vue";
import ModelsOverviewOnboarding from "./models-overview-onboarding/ModelsOverviewOnboarding.vue";

export default {
  components: {
    ModelLocation,
    ModelsCard,
    ModelsOverviewOnboarding
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
  emits: ["open-file-uploader"],
  setup(props) {
    const currentModel = ref(null);

    const onModelChange = model => {
      if (!currentModel.value || currentModel.value.id !== model.id) {
        currentModel.value = model;
      }
    };

    watch(
      () => props.models,
      () => {
        currentModel.value = props.models[0];
      },
      { immediate: true }
    );

    return {
      // References
      currentModel,
      // Methods
      onModelChange,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsOverview.scss"></style>
