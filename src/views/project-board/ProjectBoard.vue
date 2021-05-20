<template>
  <div data-test="project-board" class="view project-board">
    <ViewHeader class="project-board__header">
      <template #left>
        <AppBreadcrumb />
      </template>
      <template #center>
        <BIMDataTabs
          width="300px"
          height="32px"
          tabSize="100px"
          selected="project"
          :tabs="tabs"
        />
      </template>
    </ViewHeader>

    <div class="project-board__body">
      <ProjectOverview
        :project="project"
        :models="models"
        :users="users"
        :invitations="invitations"
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
import BIMDataTabs from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTabs.js";
import ViewHeader from "@/components/generic/view-header/ViewHeader";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import ProjectOverview from "./project-overview/ProjectOverview";

export default {
  components: {
    BIMDataTabs,
    ViewHeader,
    AppBreadcrumb,
    ProjectOverview
  },
  setup() {
    const { t } = useI18n();
    const { currentProject, currentProjectUsers, currentProjectInvitations } =
      useProjects();
    const { projectModels } = useModels();

    const tabs = ref([]);
    watchEffect(() => {
      tabs.value = [
        { id: "project", label: t("ProjectBoard.tabs.project") },
        { id: "files", label: t("ProjectBoard.tabs.files") },
        { id: "bcf", label: t("ProjectBoard.tabs.bcf") }
      ];
    });

    return {
      // References
      invitations: currentProjectInvitations,
      models: projectModels,
      project: currentProject,
      tabs,
      users: currentProjectUsers
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBoard.scss"></style>
