<template>
  <BIMDataCard
    class="project-models-manager"
    :titleHeader="$t('ProjectBoard.ProjectModelsManager.title')"
  >
    <template #content>
      <EmptyModelsManager :project="project" />
    </template>
  </BIMDataCard>
</template>

<script>
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import EmptyModelsManager from "@/components/specific/models/empty-models-manager/EmptyModelsManager";

export default {
  components: {
    BIMDataCard,
    EmptyModelsManager
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

<style scoped lang="scss" src="./ProjectModelsManager.scss"></style>
