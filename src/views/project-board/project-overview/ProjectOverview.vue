<template>
  <div class="project-overview">
    <AppSlotContent name="project-board-action">
      <BIMDataTooltip
        v-if="!project.isGuest"
        class="project-overview__tooltip-upload"
        color="high"
        position="left"
        :disabled="space.isUserOrga || !isFullTotal(spaceSubInfo)"
        :text="
          $t(
            `SubscriptionModal.uploadDisableMessage.${
              isFullTotal(spaceSubInfo) ? 'size' : 'permission'
            }`
          )
        "
      >
        <BIMDataButton
          data-test-id="btn-toggle-upload"
          :width="isLG ? undefined : '120px'"
          :color="showFileUploader ? 'granite' : 'primary'"
          fill
          radius
          :icon="isLG"
          :disabled="!space.isUserOrga && isFullTotal(spaceSubInfo)"
          @click="() => (isAbleToSub ? modalOpener() : toggleFileUploader())"
        >
          <BIMDataIcon
            :name="showFileUploader ? 'close' : isLG ? 'addFile' : 'plus'"
            :size="isLG ? 'xxs' : 'xxxs'"
          />
          <span v-if="!isLG" style="margin-left: 6px">
            {{
              showFileUploader
                ? $t("ProjectOverview.closeFileUploadButtonText")
                : $t("ProjectOverview.openFileUploadButtonText")
            }}
          </span>
        </BIMDataButton>
      </BIMDataTooltip>
    </AppSlotContent>

    <transition name="fade">
      <FileUploader
        class="project-overview__block--upload"
        v-show="showFileUploader"
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
          :models="modelsPreview"
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
          @file-uploaded="reloadData"
        />
      </AppLoading>
    </div>
  </div>
</template>

<script>
import { computed, inject } from "vue";
import { useI18n } from "vue-i18n";
import { useAppModal } from "../../../components/specific/app/app-modal/app-modal.js";
import { useAppNotification } from "../../../components/specific/app/app-notification/app-notification.js";
import { useStandardBreakpoints } from "../../../composables/responsive.js";
import { useToggle } from "../../../composables/toggle.js";
import { MODEL_TYPE, UPLOADABLE_EXTENSIONS } from "../../../config/models.js";
import { useFiles } from "../../../state/files.js";
import { useModels } from "../../../state/models.js";
import { useProjects } from "../../../state/projects.js";
import { useSpaces } from "../../../state/spaces.js";
import { debounce } from "../../../utils/async.js";
import { isFullTotal } from "../../../utils/spaces.js";
// Components
import AppLoading from "../../../components/specific/app/app-loading/AppLoading.vue";
import AppSlotContent from "../../../components/specific/app/app-slot/AppSlotContent.vue";
import FileUploader from "../../../components/specific/files/file-uploader/FileUploader.vue";
import ModelsManager from "../../../components/specific/models/models-manager/ModelsManager.vue";
import ModelsOverview from "../../../components/specific/models/models-overview/ModelsOverview.vue";
import ProjectUsersManager from "../../../components/specific/users/project-users-manager/ProjectUsersManager.vue";

export default {
  components: {
    AppLoading,
    AppSlotContent,
    FileUploader,
    ModelsManager,
    ModelsOverview,
    ProjectUsersManager
  },
  emits: ["switch-sub-modal"],
  setup(_, { emit }) {
    const { t } = useI18n();
    const { currentSpace, spaceSubInfo, loadSpaceSubInfo } = useSpaces();
    const { currentProject, projectUsers, projectInvitations } = useProjects();
    const { loadProjectModels, projectModels } = useModels();
    const { openModal } = useAppModal();
    const { loadProjectFileStructure } = useFiles();
    const { pushNotification } = useAppNotification();

    const modelsPreview = computed(() =>
      projectModels.value.filter(
        model => !model.archived && model.type !== MODEL_TYPE.META_BUILDING
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

    const isAbleToSub = inject("isAbleToSub");
    const modalOpener = () => {
      openModal();
      emit("switch-sub-modal", true);
    };

    return {
      // References
      allowedExtensions: UPLOADABLE_EXTENSIONS,
      modelsPreview,
      invitations: projectInvitations,
      isAbleToSub,
      models: projectModels,
      project: currentProject,
      showFileUploader,
      space: currentSpace,
      spaceSubInfo,
      users: projectUsers,
      // Methods
      closeFileUploader,
      isFullTotal,
      notifyForbiddenUpload,
      openFileUploader,
      modalOpener,
      reloadData,
      toggleFileUploader,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectOverview.scss"></style>
