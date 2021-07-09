<template>
  <div>{{ $t("BreadcrumbGroupSelector.text") }}</div>
  <div class="breadcrumb-separator"></div>
  <BreadcrumbSelector
    :list="groups"
    labelProp="name"
    :header="selectedGroup.name"
    @item-selected="goToGroup"
  />
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
import { useGroups } from "@/state/groups";
// Components
import BreadcrumbSelector from "@/components/generic/breadcrumb-selector/BreadcrumbSelector";

export default {
  components: {
    BreadcrumbSelector
  },
  setup() {
    const router = useRouter();
    const { projectGroups, currentGroup } = useGroups();

    const goToGroup = group => {
      router.push({
        name: routeNames.groupBoard,
        params: {
          spaceID: group.project.cloud.id,
          projectID: group.project.id,
          groupID: group.id
        }
      });
    };

    return {
      // References
      selectedGroup: currentGroup,
      groups: projectGroups,
      // Methods
      goToGroup
    };
  }
};
</script>
