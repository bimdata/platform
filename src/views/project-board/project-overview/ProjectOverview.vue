<template>
  <div class="project-overview">
    <AppSlotContent name="project-board-action">
      <BIMDataButton
        data-test="btn-toggle-upload"
        :width="isMD ? undefined : '120px'"
        :color="showFileUploader ? 'granite' : 'primary'"
        fill
        radius
        :icon="isMD"
        :disabled="spaceSubInfo.remainingSmartDataSize <= 0"
        @click="toggleFileUploader"
      >
        <BIMDataIcon
          :name="showFileUploader ? 'close' : isMD ? 'addFile' : 'plus'"
          :size="isMD ? 'xxs' : 'xxxs'"
        />
        <span v-if="!isMD" style="margin-left: 6px">
          {{
            showFileUploader
              ? $t("ProjectOverview.closeFileUploadButtonText")
              : $t("ProjectOverview.openFileUploadButtonText")
          }}
        </span>
      </BIMDataButton>
    </AppSlotContent>

    <transition name="fade">
      <FileUploader
        class="project-overview__block--upload"
        v-show="showFileUploader && spaceSubInfo.remainingSmartDataSize > 0"
        isModelUploader
        autoclose
        :project="project"
        :allowedFileTypes="allowedExtensions"
        @file-uploaded="reloadData"
        @forbidden-upload-attempt="notifyForbiddenUpload"
        @close="closeFileUploader"
      />
    </transition>

    <div class="project-overview__block--overview">
      <AppLoading name="project-models">
        <ModelsOverview
          :project="project"
          :models="ifcs"
          @open-file-uploader="openFileUploader"
        />
      </AppLoading>
    </div>

    <div class="project-overview__block--users">
      <AppLoading name="project-users">
        <ProjectUsersManager
          data-guide="users-manager"
          :project="project"
          :users="users"
          :invitations="invitations"
        />
      </AppLoading>
    </div>

    <div class="project-overview__block--models">
      <AppLoading name="project-models">
        <ModelsManager
          data-guide="models-manager"
          :project="project"
          :models="models"
        />
      </AppLoading>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useAppNotification } from "@/components/specific/app/app-notification/app-notification.js";
import { useStandardBreakpoints } from "@/composables/responsive.js";
import { useToggle } from "@/composables/toggle.js";
import { MODEL_TYPE, UPLOADABLE_EXTENSIONS } from "@/config/models.js";
import { useFiles } from "@/state/files.js";
import { useModels } from "@/state/models.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
import { debounce } from "@/utils/async.js";
// Components
import AppLoading from "@/components/specific/app/app-loading/AppLoading.vue";
import AppSlotContent from "@/components/specific/app/app-slot/AppSlotContent.vue";
import FileUploader from "@/components/specific/files/file-uploader/FileUploader.vue";
import ModelsManager from "@/components/specific/models/models-manager/ModelsManager.vue";
import ModelsOverview from "@/components/specific/models/models-overview/ModelsOverview.vue";
import ProjectUsersManager from "@/components/specific/users/project-users-manager/ProjectUsersManager.vue";

export default {
  components: {
    AppLoading,
    AppSlotContent,
    FileUploader,
    ModelsManager,
    ModelsOverview,
    ProjectUsersManager
  },
  setup() {
    const { t } = useI18n();
    const { currentSpace, spaceSubInfo, loadSpaceSubInfo } = useSpaces();
    const { currentProject, projectUsers, projectInvitations } = useProjects();
    const { loadProjectModels, projectModels } = useModels();
    const { loadProjectFileStructure } = useFiles();
    const { pushNotification } = useAppNotification();

    const ifcs = computed(() =>
      projectModels.value.filter(
        model => model.type === MODEL_TYPE.IFC && !model.archived
      )
    );

    const {
      isOpen: showFileUploader,
      open: openFileUploader,
      close: closeFileUploader,
      toggle: toggleFileUploader
    } = useToggle();

    const reloadData = debounce(async () => {
      await Promise.all([
        loadSpaceSubInfo(currentSpace.value),
        loadProjectFileStructure(currentProject.value),
        loadProjectModels(currentProject.value)
      ]);
    }, 1000);

    const notifyForbiddenUpload = () => {
      pushNotification({
        type: "error",
        title: t("ProjectOverview.forbiddenUploadNotification.title"),
        message: t("ProjectOverview.forbiddenUploadNotification.message", {
          extensions: UPLOADABLE_EXTENSIONS.join(", ")
        })
      });
    };

    return {
      // References
      ifcs,
      invitations: projectInvitations,
      allowedExtensions: UPLOADABLE_EXTENSIONS,
      models: projectModels,
      project: currentProject,
      showFileUploader,
      spaceSubInfo,
      users: projectUsers,
      // Methods
      closeFileUploader,
      notifyForbiddenUpload,
      openFileUploader,
      reloadData,
      toggleFileUploader,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectOverview.scss"></style>
