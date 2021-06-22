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
        <ModelLocation :project="project" :model="displayedModel" />
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
import { onMounted, ref } from "vue";
// Components
import ModelLocation from "@/components/specific/models/model-location/ModelLocation";
import ModelsCard from "@/components/specific/models/models-card/ModelsCard";
import ModelsOverviewOnboarding from "./models-overview-onboarding/ModelsOverviewOnboarding";

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

    const onModelChange = model => {
      if (!displayedModel.value || displayedModel.value.id !== model.id) {
        displayedModel.value = model;
      }
    };

    onMounted(() => {
      displayedModel.value = props.models.length > 0 ? props.models[0] : null;
    });

    return {
      // References
      displayedModel,
      // Methods
      onModelChange
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsOverview.scss"></style>
