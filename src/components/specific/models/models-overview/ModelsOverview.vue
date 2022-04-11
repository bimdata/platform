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
        <ModelLocation
          v-if="!isLG"
          :project="project"
          :model="displayedModel"
        />
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
import { useStandardBreakpoints } from "@/composables/responsive.js";
// Components
import ModelLocation from "@/components/specific/models/model-location/ModelLocation.vue";
import ModelsCard from "@/components/specific/models/models-card/ModelsCard.vue";
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
    const displayedModel = ref(null);

    watch(
      () => props.models,
      () => {
        displayedModel.value = props.models.length > 0 ? props.models[0] : null;
      },
      { immediate: true }
    );

    const onModelChange = model => {
      if (!displayedModel.value || displayedModel.value.id !== model.id) {
        displayedModel.value = model;
      }
    };

    return {
      // References
      displayedModel,
      // Methods
      onModelChange,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsOverview.scss"></style>
