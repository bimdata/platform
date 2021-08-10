<template>
  <div style="cursor: pointer" @click="goToProjectGroups">
    {{ $t("BreadcrumbGroupSelector.text") }}
  </div>
  <div class="breadcrumb-separator"></div>
  <BreadcrumbSelector
    :list="groups"
    labelProp="name"
    :header="selectedGroup.name"
    @item-selected="goToGroupBoard"
  />
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
import { useGroups } from "@/state/groups";
import { useProjects } from "@/state/projects";
// Components
import BreadcrumbSelector from "@/components/generic/breadcrumb-selector/BreadcrumbSelector";

export default {
  components: {
    BreadcrumbSelector
  },
  setup() {
    const router = useRouter();
    const { currentProject } = useProjects();
    const { projectGroups, currentGroup } = useGroups();

    const goToProjectGroups = () => {
      router.push({
        name: routeNames.projectGroups,
        params: {
          spaceID: currentProject.value.cloud.id,
          projectID: currentProject.value.id
        }
      });
    };

    const goToGroupBoard = group => {
      router.push({
        name: routeNames.groupBoard,
        params: {
          spaceID: currentProject.value.cloud.id,
          projectID: currentProject.value.id,
          groupID: group.id
        }
      });
    };

    return {
      // References
      selectedGroup: currentGroup,
      groups: projectGroups,
      // Methods
      goToGroupBoard,
      goToProjectGroups
    };
  }
};
</script>
