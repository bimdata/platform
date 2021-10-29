<template>
  <div class="project-overview">
    <app-slot-content name="project-board-action">
      <BIMDataButton
        data-test="btn-toggle-upload"
        width="120px"
        :color="showFileUploader ? 'tertiary-darkest' : 'primary'"
        fill
        radius
        :disabled="spaceInfo.remainingSmartDataSize <= 0"
        @click="toggleFileUploader"
      >
        <BIMDataIcon
          :name="showFileUploader ? 'close' : 'plus'"
          size="xxxs"
          margin="0 6px 0 0"
        />
        <span>{{
          showFileUploader
            ? $t("ProjectOverview.closeFileUploadButtonText")
            : $t("ProjectOverview.openFileUploadButtonText")
        }}</span>
      </BIMDataButton>
    </app-slot-content>

    <transition name="fade">
      <FileUploader
        v-show="showFileUploader && spaceInfo.remainingSmartDataSize > 0"
        class="project-overview__block--upload"
        :project="project"
        :allowedFileTypes="['.ifc', '.ifczip']"
        @file-uploaded="reloadModels"
        @forbidden-upload-attempt="notifyForbiddenUpload"
        @close="closeFileUploader"
      />
    </transition>
    <ModelsOverview
      class="project-overview__block--overview"
      :project="project"
      :models="models"
      @open-file-uploader="openFileUploader"
    />
    <ProjectUsersManager
      class="project-overview__block--users"
      :project="project"
      :users="users"
      :invitations="invitations"
    />
    <ModelsManager
      class="project-overview__block--models"
      :project="project"
      :models="models"
    />
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useNotifications } from "@/composables/notifications.js";
import { useToggle } from "@/composables/toggle.js";
import { useFiles } from "@/state/files.js";
import { useModels } from "@/state/models.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
import { debounce } from "@/utils/async.js";
// Components
import AppSlotContent from "@/components/generic/app-slot/AppSlotContent.vue";
import FileUploader from "@/components/specific/files/file-uploader/FileUploader.vue";
import ModelsManager from "@/components/specific/models/models-manager/ModelsManager.vue";
import ModelsOverview from "@/components/specific/models/models-overview/ModelsOverview.vue";
import ProjectUsersManager from "@/components/specific/users/project-users-manager/ProjectUsersManager.vue";

export default {
  components: {
    AppSlotContent,
    FileUploader,
    ModelsManager,
    ModelsOverview,
    ProjectUsersManager
  },
  setup() {
    const { t } = useI18n();
    const { currentSpace, spaceInfo, loadSpaceInfo } = useSpaces();
    const { currentProject, projectUsers, projectInvitations } = useProjects();
    const { loadProjectModels, projectModels } = useModels();
    const { loadProjectFileStructure } = useFiles();
    const { pushNotification } = useNotifications();

    const {
      isOpen: showFileUploader,
      open: openFileUploader,
      close: closeFileUploader,
      toggle: toggleFileUploader
    } = useToggle();

    const reloadModels = debounce(() => {
      loadSpaceInfo(currentSpace.value);
      loadProjectFileStructure(currentProject.value);
      loadProjectModels(currentProject.value);
    }, 1000);

    const notifyForbiddenUpload = () => {
      pushNotification({
        type: "error",
        title: t("ProjectOverview.forbiddenUploadNotification.title"),
        message: t("ProjectOverview.forbiddenUploadNotification.message")
      });
    };

    return {
      // References
      invitations: projectInvitations,
      models: projectModels,
      project: currentProject,
      showFileUploader,
      spaceInfo,
      users: projectUsers,
      // Methods
      closeFileUploader,
      notifyForbiddenUpload,
      openFileUploader,
      reloadModels,
      toggleFileUploader
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectOverview.scss"></style>
