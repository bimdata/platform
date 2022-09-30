<template>
  <BreadcrumbSelector
    :list="spaces"
    labelProp="name"
    :header="selectedSpace?.name"
    @item-selected="selectSpace"
    @header-clicked="goToSpace"
  />
  <div class="breadcrumb-separator"></div>
  <BreadcrumbSelector
    v-if="projects.length > 0"
    :list="projects"
    labelProp="name"
    :header="selectedProject?.name"
    @item-selected="goToProject"
  />
  <div v-else>
    {{ $t("BreadcrumbProjectSelector.placeholder") }}
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import routeNames from "../../../../../router/route-names.js";
import { useProjects } from "../../../../../state/projects.js";
import { useSpaces } from "../../../../../state/spaces.js";
// Components
import BreadcrumbSelector from "../breadcrumb-selector/BreadcrumbSelector.vue";

export default {
  components: {
    BreadcrumbSelector
  },
  setup() {
    const router = useRouter();
    const { userSpaces, currentSpace } = useSpaces();
    const { userProjects, spaceProjects, currentProject } = useProjects();

    const projects = ref([]);
    const selectedSpace = ref(null);
    const selectedProject = ref(null);

    watch(
      () => spaceProjects.value,
      () => (projects.value = spaceProjects.value),
      { immediate: true }
    );
    watch(
      () => currentSpace.value,
      space => (selectedSpace.value = space),
      { immediate: true }
    );
    watch(
      () => currentProject.value,
      project => (selectedProject.value = project),
      { immediate: true }
    );

    const goToProject = project => {
      router.push({
        name: routeNames.projectBoard,
        params: {
          spaceID: project.cloud.id,
          projectID: project.id
        }
      });
    };

    const goToSpace = () => {
      router.push({
        name: routeNames.spaceBoard,
        params: {
          spaceID: selectedSpace.value.id
        }
      });
    };

    const selectSpace = space => {
      selectedSpace.value = space;
      projects.value = userProjects.value.filter(
        proj => proj.cloud.id === space.id
      );
      if (projects.value.length === 1) {
        // Automatically change project if there is only one
        // in the selected space
        selectedProject.value = projects.value[0];
        goToProject(projects.value[0]);
      } else if (projects.value.length > 1) {
        selectedProject.value = projects.value[0];
      } else {
        selectedProject.value = {};
      }
    };

    return {
      // References
      projects,
      selectedProject,
      selectedSpace,
      spaces: userSpaces,
      // Methods
      goToProject,
      goToSpace,
      selectSpace
    };
  }
};
</script>
