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
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
// Components
import BreadcrumbSelector from "@/components/breadcrumb-selector/BreadcrumbSelector";

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

    const changeSpace = space => {
      selectedSpace.value = space;
      projects.value = userProjects.value.filter(
        proj => proj.cloud.id === space.id
      );
      selectedProject.value =
        projects.value.length > 0 ? projects.value[0] : {};
    };

    const changeProject = project => {
      router.push({
        name: routeNames.projectBoard,
        params: {
          spaceID: project.cloud.id,
          projectID: project.id
        }
      });
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
