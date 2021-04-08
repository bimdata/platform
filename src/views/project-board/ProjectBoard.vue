<template>
  <div class="project-board-view">
    <ViewHeader class="project-board-view__header">
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
      <template #right>
        <BIMDataButton
          width="120px"
          :color="showFileUploader ? 'tertiary-darkest' : 'primary'"
          fill
          radius
          @click="toggleFileUploader"
        >
          <BIMDataIcon
            :name="showFileUploader ? 'close' : 'plus'"
            size="xxxs"
          />
          <span>{{
            showFileUploader
              ? $t("ProjectBoard.closeFileUploader")
              : $t("ProjectBoard.addIFC")
          }}</span>
        </BIMDataButton>
      </template>
    </ViewHeader>

    <div class="project-board-view__container">
      <transition name="fade">
        <ProjectFileUploader
          v-show="showFileUploader"
          class="project-board-view__container__block--upload"
          :project="project"
          :allowedFileTypes="['.ifc', '.ifczip']"
          @file-uploaded="reloadModels"
          @close="closeFileUploader"
        />
      </transition>
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
import ProjectFileUploader from "@/components/specific/files/project-file-uploader/ProjectFileUploader";
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
    ProjectFileUploader,
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
    const { projectModels, loadProjectModels } = useModels();

    const tabs = ref([]);
    watchEffect(() => {
      tabs.value = [
        { id: "project", label: t("ProjectBoard.projectTabLabel") },
        { id: "files", label: t("ProjectBoard.filesTabLabel") },
        { id: "bcf", label: t("ProjectBoard.bcfTabLabel") }
      ];
    });

    let reloadDebounce = null;
    const reloadModels = () => {
      clearTimeout(reloadDebounce);
      reloadDebounce = setTimeout(async () => {
        await loadProjectModels(currentProject.value);
      }, 1000);
    };

    const showFileUploader = ref(false);
    const closeFileUploader = () => {
      showFileUploader.value = false;
    };
    const toggleFileUploader = () => {
      showFileUploader.value = !showFileUploader.value;
    };

    return {
      // References
      invitations: currentProjectInvitations,
      models: projectModels,
      project: currentProject,
      showFileUploader,
      tabs,
      users: currentProjectUsers,
      // Methods
      closeFileUploader,
      reloadModels,
      toggleFileUploader
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBoard.scss"></style>
