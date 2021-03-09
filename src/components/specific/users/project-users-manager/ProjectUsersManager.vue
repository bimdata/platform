<template>
  <BIMDataCard
    class="project-users-manager"
    :titleHeader="$t('ProjectBoard.ProjectUsersManager.title')"
  >
    <template #content>
      <EmptyUsersManager :project="project" />
    </template>
  </BIMDataCard>
</template>

<script>
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import EmptyUsersManager from "@/components/specific/users/empty-users-manager/EmptyUsersManager";

export default {
  components: {
    BIMDataCard,
    EmptyUsersManager
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

<style scoped lang="scss" src="./ProjectUsersManager.scss"></style>
