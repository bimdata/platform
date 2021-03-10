<template>
  <BIMDataCard
    class="project-models-overview"
    :titleHeader="$t('ProjectBoard.ProjectModelsOverview.title')"
  >
    <template #content>
      <template v-if="true">
        <ViewerCard :project="project" />
        <ModelLocation :project="project" />
      </template>
      <template v-else>
        <EmptyModelsOverview :project="project" />
      </template>
    </template>
  </BIMDataCard>
</template>

<script>
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
    }
  },
  setup() {
    // TODO
  }
};
</script>

<style scoped lang="scss" src="./ProjectModelsOverview.scss"></style>
