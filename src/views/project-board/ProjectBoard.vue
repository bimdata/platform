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

    <div class="project-board-view__container">
      <ProjectModelsOverview
        class="project-board-view__container__block--overview"
        :project="project"
        :models="models"
      />
      <ProjectUsersManager
        class="project-board-view__container__block--users"
        :project="project"
      />
      <!--
      <ProjectModelsManager
        class="project-board-view__container__block--models"
        :project="project"
        :models="models"
      />
      -->
      <ProjectFilesManager
        class="project-board-view__container__block--files"
        :project="project"
      />
    </div>
  </div>
</template>

<script>
import { useModels } from "@/state/models";
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
    const { projectModels } = useModels();

    return {
      project: currentProject,
      models: projectModels
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBoard.scss"></style>
