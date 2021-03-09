<template>
  <div class="project-board-view">
    <ViewHeader>
      <template #left>
        <AppBreadcrumb />
      </template>
      <template #center>
        <BIMDataTabs
          width="200px"
          height="32px"
          tabSize="50%"
          selected="project"
          :tabs="[
            { id: 'project', label: 'Projet' },
            { id: 'bcf', label: 'BCF' }
          ]"
        />
      </template>
      <template #right>
        <BIMDataButton color="primary" fill radius>
          <BIMDataIcon name="plus" size="xxxs" />
          <span>{{ $t("ProjectBoard.addIFC") }}</span>
        </BIMDataButton>
      </template>
    </ViewHeader>

    <div class="container">
      <ProjectModelsOverview class="block--overview" :project="project" />
      <ProjectUsersManager class="block--users" :project="project" />
      <!-- <ProjectModelsManager class="block--models" :project="project" /> -->
      <ProjectFilesManager class="block--files" :project="project" />
    </div>
  </div>
</template>

<script>
import { useProjects } from "@/state/projects";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataTabs from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTabs.js";
import ViewHeader from "@/components/generic/view-header/ViewHeader";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import ProjectFilesManager from "@/components/specific/files/project-files-manager/ProjectFilesManager";
// import ProjectModelsManager from "@/components/specific/models/project-models-manager/ProjectModelsManager";
import ProjectModelsOverview from "@/components/specific/models/project-models-overview/ProjectModelsOverview";
import ProjectUsersManager from "@/components/specific/users/project-users-manager/ProjectUsersManager";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataTabs,
    ViewHeader,
    AppBreadcrumb,
    ProjectFilesManager,
    // ProjectModelsManager,
    ProjectModelsOverview,
    ProjectUsersManager
  },
  setup() {
    const { currentProject } = useProjects();

    return {
      project: currentProject
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBoard.scss"></style>
