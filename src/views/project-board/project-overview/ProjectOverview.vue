<template>
  <div class="project-overview">
    <AppSlotContent name="project-board-action">
      <BIMDataButton color="primary" outline radius icon @click="openNotificationsSettings">
        <BIMDataIconSettings fill color="default" size="xs" />
      </BIMDataButton>
      <BIMDataTooltip
        v-if="!isProjectGuest(project)"
        class="project-overview__tooltip-upload"
        color="high"
        position="left"
        :disabled="isUserOrga(space) || !isFullTotal(spaceSubInfo)"
        :text="
          $t(
            `ProjectOverview.uploadDisableMessage.${
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
          :disabled="!isUserOrga(space) && isFullTotal(spaceSubInfo)"
          @click="() => (shouldSubscribe ? openSubscriptionModal() : toggleFileUploader())"
        >
          <BIMDataIcon
            :name="showFileUploader ? 'close' : isLG ? 'addFile' : 'plus'"
            :size="isLG ? 'xxs' : 'xxxs'"
          />
          <span v-if="!isLG" style="margin-left: 6px">
            {{ showFileUploader ? $t("t.close") : $t("ProjectOverview.openFileUploadButtonText") }}
          </span>
        </BIMDataButton>
      </BIMDataTooltip>
    </AppSlotContent>

    <AppSidePanelContent :header="false">
      <Transition name="fade" mode="out-in">
        <div style="height: 100%;">
          <!-- Notification Settings Panel -->
          <ProjectNotificationsSettings
            v-show="sidePanelView === 'settings'"
            :notification="notification"
            :selectedRecipientsIds="selectedRecipientsIds"
            v-model:notification-mode-activity="notificationModeActivity"
            v-model:checked-days-activity="checkedDaysActivity"
            v-model:checked-activity="checkedActivity"
            @open-recipients-settings="switchToRecipients"
            @open-timezone-choice="switchToTimezoneChoice"
            @close="closeSidePanel"
          />

          <!-- Recipients Panel -->
          <ProjectNotificationsRecipients
            v-show="sidePanelView === 'recipients'"
            :selectedRecipientsIds="selectedRecipientsIds"
            @back-to-settings="switchToSettings"
            @close="closeNotificationPanel"
            @update-recipients="
              (groupIds) => {
                selectedRecipientsIds = groupIds;
              }
            "
          />

          <!-- Timezone Panel -->
          <ProjectNotificationTimezoneChoice
            v-show="sidePanelView === 'timezone'"
            @close="closeNotificationPanel"
            @back-to-settings="switchToSettings"
          />
        </div>
      </Transition>
    </AppSidePanelContent>

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
import { computed, inject, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import { useAppModal } from "../../../components/specific/app/app-modal/app-modal.js";
import { useAppNotification } from "../../../components/specific/app/app-notification/app-notification.js";
import { useAppSidePanel } from "../../../components/specific/app/app-side-panel/app-side-panel.js";
import { useStandardBreakpoints } from "../../../composables/responsive.js";
import { useToggle } from "../../../composables/toggle.js";

import { useFiles } from "../../../state/files.js";
import { useModels } from "../../../state/models.js";
import { useProjects } from "../../../state/projects.js";
import { useSpaces } from "../../../state/spaces.js";
import { useUser } from "../../../state/user.js";

import { debounce } from "../../../utils/async.js";
import { isFullTotal } from "../../../utils/spaces.js";
import { getDefaultCheckedActivity, getDefaultCheckedDays } from "../../../utils/notifications.js";

import { MODEL_TYPE, UPLOADABLE_EXTENSIONS } from "../../../config/models.js";

// Components
import AppLoading from "../../../components/specific/app/app-loading/AppLoading.vue";
import AppSidePanelContent from "../../../components/specific/app/app-side-panel/AppSidePanelContent.vue";
import AppSlotContent from "../../../components/specific/app/app-slot/AppSlotContent.js";
import FileUploader from "../../../components/specific/files/file-uploader/FileUploader.vue";
import ModelsManager from "../../../components/specific/models/models-manager/ModelsManager.vue";
import ModelsOverview from "../../../components/specific/models/models-overview/ModelsOverview.vue";
import ProjectNotificationsSettings from "../../../components/specific/projects/project-notifications-settings/ProjectNotificationsSettings.vue";
import ProjectNotificationsRecipients from "../../../components/specific/projects/project-notifications-recipients/ProjectNotificationsRecipients.vue";
import ProjectNotificationTimezoneChoice from "../../../components/specific/projects/project-notification-timezone-choice/ProjectNotificationTimezoneChoice.vue";
import ProjectUsersManager from "../../../components/specific/users/project-users-manager/ProjectUsersManager.vue";
import SubscriptionModal from "../../../components/specific/subscriptions/subscription-modal/SubscriptionModal.vue";

export default {
  components: {
    AppLoading,
    AppSidePanelContent,
    AppSlotContent,
    FileUploader,
    ModelsManager,
    ModelsOverview,
    ProjectUsersManager,
    ProjectNotificationsSettings,
    ProjectNotificationsRecipients,
    ProjectNotificationTimezoneChoice,
  },
  setup() {
    const { t } = useI18n();
    const { openModal } = useAppModal();
    const { pushNotification } = useAppNotification();
    const { openSidePanel, closeSidePanel } = useAppSidePanel();
    const { isUserOrga, isProjectGuest } = useUser();

    const { currentSpace, spaceSubInfo, loadSpaceSubInfo } = useSpaces();
    const { currentProject, projectUsers, projectInvitations, fetchProjectNotification } =
      useProjects();
    const { projectModels, loadProjectModels } = useModels();
    const { loadProjectFileStructure } = useFiles();

    const notificationModeActivity = ref("disabled");
    const checkedDaysActivity = ref(getDefaultCheckedDays(t));
    const checkedActivity = ref(getDefaultCheckedActivity(t));
    const selectedRecipientsIds = ref([]);
    const notification = ref({});
    const sidePanelView = ref("settings");

    const {
      isOpen: showFileUploader,
      open: openFileUploader,
      close: closeFileUploader,
      toggle: toggleFileUploader,
    } = useToggle();

    const modelsPreview = computed(() =>
      projectModels.value.filter(
        (model) =>
          !model.archived &&
          model.type !== MODEL_TYPE.META_BUILDING &&
          model.type !== MODEL_TYPE.PHOTOSPHERE_BUILDING
      )
    );

    const reloadData = debounce(async () => {
      await Promise.all([
        loadSpaceSubInfo(currentSpace.value),
        loadProjectFileStructure(currentProject.value),
        loadProjectModels(currentProject.value),
      ]);
    }, 1000);

    const notifyForbiddenUpload = () => {
      pushNotification({
        type: "error",
        title: t("t.error"),
        message: t("ProjectOverview.forbiddenUploadNotification", {
          extensions: UPLOADABLE_EXTENSIONS.join(", "),
        }),
      });
    };
    const shouldSubscribe = inject("shouldSubscribe");
    const openSubscriptionModal = () => {
      openModal({ component: SubscriptionModal });
    };

    const openNotificationsSettings = () => openSidePanel();
    const switchToRecipients = () => (sidePanelView.value = "recipients");
    const switchToSettings = () => (sidePanelView.value = "settings");
    const switchToTimezoneChoice = () => {
      sidePanelView.value = "timezone";
      openSidePanel();
    };
    const closeNotificationPanel = () => {
      sidePanelView.value = "settings";
      closeSidePanel();
    };

    onMounted(async () => {
      try {
        notification.value = await fetchProjectNotification(
          currentSpace.value.id,
          currentProject.value.id
        );
        selectedRecipientsIds.value = notification.value?.recipients_group_ids || [];
      } catch (e) {
        selectedRecipientsIds.value = [];
      }
    });

    return {
      // References
      allowedExtensions: UPLOADABLE_EXTENSIONS,
      checkedActivity,
      checkedDaysActivity,
      invitations: projectInvitations,
      models: projectModels,
      modelsPreview,
      notification,
      notificationModeActivity,
      project: currentProject,
      selectedRecipientsIds,
      shouldSubscribe,
      showFileUploader,
      sidePanelView,
      space: currentSpace,
      spaceSubInfo,
      switchToRecipients,
      switchToSettings,
      switchToTimezoneChoice,
      users: projectUsers,
      // Methods
      closeFileUploader,
      closeSidePanel,
      closeNotificationPanel,
      isFullTotal,
      isProjectGuest,
      isUserOrga,
      notifyForbiddenUpload,
      openFileUploader,
      openSubscriptionModal,
      openNotificationsSettings,
      reloadData,
      toggleFileUploader,
      // Responsive breakpoints
      ...useStandardBreakpoints(),
    };
  },
};
</script>

<style scoped lang="scss" src="./ProjectOverview.scss"></style>
