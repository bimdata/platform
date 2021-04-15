<template>
  <BIMDataCard
    class="project-models-overview"
    :titleHeader="$t('ProjectModelsOverview.title')"
  >
    <template #content>
      <template v-if="models.length > 0">
        <ViewerCard
          :project="project"
          :models="models"
          @model-changed="onModelChange"
        />
        <ModelLocation :project="project" :model="displayedModel" />
      </template>
      <template v-else>
        <EmptyModelsOverview
          @open-file-uploader="$emit('open-file-uploader')"
        />
      </template>
    </template>
  </BIMDataCard>
</template>

<script>
import { ref, watchEffect } from "vue";
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import EmptyModelsOverview from "@/components/specific/models/empty-models-overview/EmptyModelsOverview";
import ModelLocation from "@/components/specific/models/model-location/ModelLocation";
import ViewerCard from "@/components/specific/models/viewer-card/ViewerCard";

export default {
  components: {
    BIMDataCard,
    EmptyModelsOverview,
    ModelLocation,
    ViewerCard
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

    watchEffect(() => {
      displayedModel.value = props.models.length > 0 ? props.models[0] : null;
    });

    const onModelChange = model => {
      displayedModel.value = model;
    };

    return {
      // References
      displayedModel,
      // Methods
      onModelChange
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectModelsOverview.scss"></style>
