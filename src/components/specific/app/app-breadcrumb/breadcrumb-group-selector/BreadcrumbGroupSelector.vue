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
import routeNames from "../../../../../router/route-names.js";
import { useGroups } from "../../../../../state/groups.js";
import { useProjects } from "../../../../../state/projects.js";
// Components
import BreadcrumbSelector from "../breadcrumb-selector/BreadcrumbSelector.vue";

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
      groups: projectGroups,
      selectedGroup: currentGroup,
      // Methods
      goToGroupBoard,
      goToProjectGroups
    };
  }
};
</script>
