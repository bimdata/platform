<template>
  <div class="project-board-view">
    <ViewHeader class="project-board-view__header">
      <template #left>
        <AppBreadcrumb />
      </template>
      <template #center>
        <BIMDataTabs
          width="200px"
          height="32px"
          tabSize="50%"
          selected="project"
          :tabs="tabs"
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
        :users="users"
        :invitations="invitations"
      />
      <ProjectModelsManager
        v-if="models.length > 0"
        class="project-board-view__container__block--models"
        :project="project"
        :models="models"
      />
      <ProjectFilesManager
        class="project-board-view__container__block--files"
        :project="project"
      />
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useModels } from "@/state/models";
import { useProjects } from "@/state/projects";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataTabs from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTabs.js";
import ViewHeader from "@/components/generic/view-header/ViewHeader";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import ProjectFilesManager from "@/components/specific/files/project-files-manager/ProjectFilesManager";
import ProjectModelsManager from "@/components/specific/models/project-models-manager/ProjectModelsManager";
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
    ProjectModelsManager,
    ProjectModelsOverview,
    ProjectUsersManager
  },
  setup() {
    const { t } = useI18n();
    const {
      currentProject,
      currentProjectUsers,
      currentProjectInvitations
    } = useProjects();
    const { projectModels } = useModels();

    const tabs = ref([]);
    watchEffect(() => {
      tabs.value = [
        { id: "project", label: t("ProjectBoard.projectTabLabel") },
        { id: "bcf", label: t("ProjectBoard.bcfTabLabel") }
      ];
    });

    return {
      tabs,
      project: currentProject,
      models: projectModels,
      users: currentProjectUsers,
      invitations: currentProjectInvitations
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBoard.scss"></style>
