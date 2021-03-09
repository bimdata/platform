<template>
  <BIMDataCard
    class="project-files-manager"
    :titleHeader="$t('ProjectBoard.ProjectFilesManager.title')"
  >
    <template #content>
      <EmptyFilesManager :project="project" />
    </template>
  </BIMDataCard>
</template>

<script>
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import EmptyFilesManager from "@/components/specific/files/empty-files-manager/EmptyFilesManager";

export default {
  components: {
    BIMDataCard,
    EmptyFilesManager
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

<style scoped lang="scss" src="./ProjectFilesManager.scss"></style>
