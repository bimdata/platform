<template>
  <div>{{ $t("BreadcrumbGroupSelector.text") }}</div>
  <div class="breadcrumb-separator"></div>
  <BreadcrumbSelector
    :header="currentGroup.name"
    :list="groups"
    labelProp="name"
    @item-selected="changeGroup"
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

    const changeGroup = group => {
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
      currentGroup,
      groups: projectGroups,
      // Methods
      changeGroup
    };
  }
};
</script>
