<template>
  <BIMDataCard
    class="project-models-overview"
    :titleHeader="$t('ProjectBoard.ProjectModelsOverview.title')"
  >
    <template #content>
      <EmptyModelsOverview :project="project" />
    </template>
  </BIMDataCard>
</template>

<script>
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import EmptyModelsOverview from "@/components/specific/models/empty-models-overview/EmptyModelsOverview";

export default {
  components: {
    BIMDataCard,
    EmptyModelsOverview
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
