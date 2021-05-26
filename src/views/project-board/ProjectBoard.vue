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
          :selected="0"
          :tabs="tabs"
          @tab-click="selectTab"
        />
      </template>
    </ViewHeader>

    <div class="project-board__body">
      <transition name="fade" mode="out-in">
        <ProjectOverview
          v-if="currentTab === 'overview'"
          :project="project"
          :models="models"
          :users="users"
          :invitations="invitations"
        />

        <ProjectFiles
          v-else-if="currentTab === 'files'"
          :project="project"
          :fileStructure="fileStructure"
        />

        <ProjectBcf v-else-if="currentTab === 'bcf'" :project="project" />
      </transition>
    </div>
  </div>
</template>

<script>
import { provide, ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { useModels } from "@/state/models";
import { useProjects } from "@/state/projects";
import { useFiles } from "@/state/files";
// Components
import BIMDataTabs from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTabs.js";
import ViewHeader from "@/components/generic/view-header/ViewHeader";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import ProjectBcf from "./project-bcf/ProjectBcf";
import ProjectFiles from "./project-files/ProjectFiles";
import ProjectOverview from "./project-overview/ProjectOverview";

export default {
  components: {
    BIMDataTabs,
    ViewHeader,
    AppBreadcrumb,
    ProjectBcf,
    ProjectFiles,
    ProjectOverview
  },
  setup() {
    const { t } = useI18n();
    const { currentProject, projectUsers, projectInvitations } = useProjects();
    const { projectModels } = useModels();
    const { projectFileStructure, fileStructureHandler } = useFiles();

    const tabs = ref([]);
    const currentTab = ref("overview");
    watchEffect(() => {
      tabs.value = [
        { id: "overview", label: t("ProjectBoard.tabs.overview") },
        { id: "files", label: t("ProjectBoard.tabs.files") },
        { id: "bcf", label: t("ProjectBoard.tabs.bcf") }
      ];
    });
    const selectTab = tab => {
      currentTab.value = tab.id;
    };

    provide("fileStructureHandler", fileStructureHandler);

    return {
      // References
      currentTab,
      fileStructure: projectFileStructure,
      invitations: projectInvitations,
      models: projectModels,
      project: currentProject,
      tabs,
      users: projectUsers,
      // Methods
      selectTab
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBoard.scss"></style>
