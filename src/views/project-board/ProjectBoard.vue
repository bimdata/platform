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
      <template #right>
        <BIMDataButton
          data-test="btn-toggle-upload"
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
              ? $t("ProjectBoard.closeFileUploadButtonText")
              : $t("ProjectBoard.openFileUploadButtonText")
          }}</span>
        </BIMDataButton>
      </template>
    </ViewHeader>

    <div class="project-board__container">
      <transition name="fade">
        <FileUploader
          v-show="showFileUploader"
          class="project-board__container__block--upload"
          :project="project"
          :allowedFileTypes="['.ifc', '.ifczip']"
          @file-uploaded="reloadModels"
          @close="closeFileUploader"
        />
      </transition>
      <ModelsOverview
        class="project-board__container__block--overview"
        :project="project"
        :models="models"
        @open-file-uploader="openFileUploader"
      />
      <ProjectUsersManager
        class="project-board__container__block--users"
        :project="project"
        :users="users"
        :invitations="invitations"
      />
      <ModelsManager
        class="project-board__container__block--models"
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
import FileUploader from "@/components/specific/files/file-uploader/FileUploader";
import ModelsManager from "@/components/specific/models/models-manager/ModelsManager";
import ModelsOverview from "@/components/specific/models/models-overview/ModelsOverview";
import ProjectUsersManager from "@/components/specific/users/project-users-manager/ProjectUsersManager";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataTabs,
    ViewHeader,
    AppBreadcrumb,
    FileUploader,
    ModelsManager,
    ModelsOverview,
    ProjectUsersManager
  },
  setup() {
    const { t } = useI18n();
    const { currentProject, currentProjectUsers, currentProjectInvitations } =
      useProjects();
    const { projectModels, loadProjectModels } = useModels();

    const tabs = ref([]);
    watchEffect(() => {
      tabs.value = [
        { id: "project", label: t("ProjectBoard.tabs.project") },
        { id: "files", label: t("ProjectBoard.tabs.files") },
        { id: "bcf", label: t("ProjectBoard.tabs.bcf") }
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
    const openFileUploader = () => {
      showFileUploader.value = true;
    };
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
      openFileUploader,
      reloadModels,
      toggleFileUploader
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBoard.scss"></style>
