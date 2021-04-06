<template>
  <BreadcrumbSelector
    :header="selectedSpace.name"
    :list="spaces"
    labelProp="name"
    @item-selected="changeSpace"
  />
  <div class="breadcrumb-separator"></div>
  <BreadcrumbSelector
    v-if="projects.length > 0"
    :header="selectedProject.name"
    :list="projects"
    labelProp="name"
    @item-selected="changeProject"
  />
  <div v-else>
    {{ $t("BreadcrumbProjectSelector.noProject") }}
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
// Components
import BreadcrumbSelector from "@/components/generic/breadcrumb-selector/BreadcrumbSelector";

export default {
  components: {
    BreadcrumbSelector
  },
  setup() {
    const router = useRouter();
    const { userSpaces, currentSpace } = useSpaces();
    const { userProjects, spaceProjects, currentProject } = useProjects();

    const projects = ref(spaceProjects.value);
    const selectedSpace = ref(currentSpace.value);
    const selectedProject = ref(currentProject.value);

    const changeProject = project => {
      router.push({
        name: routeNames.projectBoard,
        params: {
          spaceID: project.cloud.id,
          projectID: project.id
        }
      });
    };

    const changeSpace = space => {
      selectedSpace.value = space;
      projects.value = userProjects.value.filter(
        proj => proj.cloud.id === space.id
      );
      if (projects.value.length === 1) {
        // Automatically change project if there is only one
        // in the selected space
        selectedProject.value = projects.value[0];
        changeProject(projects.value[0]);
      } else {
        selectedProject.value =
          projects.value.length > 0 ? projects.value[0] : {};
      }
    };

    return {
      // References
      spaces: userSpaces,
      projects,
      selectedSpace,
      selectedProject,
      // Methods
      changeSpace,
      changeProject
    };
  }
};
</script>
