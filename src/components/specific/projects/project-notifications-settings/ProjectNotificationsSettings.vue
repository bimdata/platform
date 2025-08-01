<template>
  <div class="project-notifications-settings p-b-12">
    <div class="header flex items-center justify-between">
      <BIMDataButton color="primary" ghost radius icon @click="$emit('close')">
        <BIMDataIconArrow size="xxs" />
        <span style="margin-left: 6px">{{ $t("t.back") }}</span>
      </BIMDataButton>
      <div class="flex items-center">
        <BIMDataIconSettings fill color="default" margin="0 6px 0 0" size="xs" />
        <span>{{ $t("ProjectOverview.notifications.title") }}</span>
      </div>
      <BIMDataButton ghost rounded icon @click="$emit('close')">
        <BIMDataIconClose size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>

    <div class="content p-x-6">
      <div class="content-text m-t-12">
        <p class="text-center">
          {{ $t("ProjectOverview.notifications.headerText") }}
        </p>
      </div>

      <div class="m-t-18">
        <ProjectNotificationCard
          :notification="notification"
          :title="$t('ProjectOverview.notifications.settings.activity.title')"
          type="activity"
          :selectedRecipientsIds="selectedRecipientsIds"
          v-model:notification-mode-value="notificationModeActivity"
          v-model:model-days="checkedDaysActivity"
          v-model:model-activity="checkedActivity"
          v-model:selected-time="selectedTime"
          :defaultOpen="true"
          @open-recipients-settings="$emit('open-recipients-settings')"
          @open-timezone-choice="$emit('open-timezone-choice')"
        >
          <template #icon>
            <BIMDataIconProject fill color="default" margin="0 6px 0 0" />
          </template>
        </ProjectNotificationCard>
      </div>
    </div>

    <div class="footer m-t-6">
      <BIMDataButton
        color="primary"
        fill
        radius
        width="100%"
        :disabled="selectedRecipientsIds.length === 0"
        @click="updateNotifications"
      >
        {{ $t("ProjectOverview.notifications.validateButton") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

import { useAppNotification } from "../../app/app-notification/app-notification.js";
import { useProjects } from "../../../../state/projects.js";
import { useNotificationSchedule } from "../../../../state/notifications.js";
import { getActivityMapping } from "../../../../utils/notifications.js";

import ProjectNotificationCard from "../project-notification-card/ProjectNotificationCard.vue";

const props = defineProps({
  notification: {
    type: Object,
    default: () => ({}),
  },
  selectedRecipientsIds: {
    type: Array,
    default: () => [],
  },
});
defineEmits(["open-recipients-settings", "close", "open-timezone-choice"]);

const notificationModeActivity = defineModel("notificationModeActivity");
const checkedDaysActivity = defineModel("checkedDaysActivity");
const checkedActivity = defineModel("checkedActivity");

const { t, locale } = useI18n();
const route = useRoute();
const { pushNotification } = useAppNotification();
const { updateProjectNotification, deleteProjectNotification } = useProjects();
const { selectedTime, selectedTimezone } = useNotificationSchedule();

const spaceID = +route.params.spaceID;
const projectID = +route.params.projectID;
const activityMapping = getActivityMapping(t);

const defaultDays = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
};

if (
  !checkedDaysActivity.value ||
  Object.keys(checkedDaysActivity.value).some((k) => !defaultDays.hasOwnProperty(k))
) {
  checkedDaysActivity.value = { ...defaultDays };
}

const initializeStateFromNotification = (notification) => {
  Object.entries(checkedActivity.value).forEach(([label]) => {
    const key = activityMapping[label];
    if (key) {
      checkedActivity.value[label] = !!notification[key];
    }
  });

  if (notification.schedule) {
    Object.assign(checkedDaysActivity.value, {
      monday: notification.schedule.monday,
      tuesday: notification.schedule.tuesday,
      wednesday: notification.schedule.wednesday,
      thursday: notification.schedule.thursday,
      friday: notification.schedule.friday,
      saturday: notification.schedule.saturday,
      sunday: notification.schedule.sunday,
    });

    selectedTime.value = notification.schedule.time;
    selectedTimezone.value = notification.schedule.timezone;

    notificationModeActivity.value = Object.values(checkedDaysActivity.value).some(Boolean)
      ? "scheduled"
      : "immediate";
  } else {
    notificationModeActivity.value = "disabled";
  }
};

watch(
  () => props.notification,
  (newNotification) => {
    if (newNotification && Object.keys(newNotification).length > 0) {
      initializeStateFromNotification(newNotification);
    }
  },
  { immediate: true }
);

const handleDeleteNotification = async () => {
  try {
    await deleteProjectNotification(spaceID, projectID);
    pushNotification({
      type: "success",
      title: t("t.success"),
      message: t("ProjectOverview.notifications.settings.general.successDeleteNotifText"),
    });
  } catch (error) {
    console.error(error);
    pushNotification({
      type: "error",
      title: t("t.error"),
      message: t("ProjectOverview.notifications.settings.general.errorDeleteNotifText"),
    });
  }
};

const updateNotifications = async () => {
  const schedule =
    notificationModeActivity.value === "scheduled"
      ? {
          time: selectedTime.value,
          timezone: selectedTimezone.value,
          ...checkedDaysActivity.value,
        }
      : null;

  const eventFields = {};
  Object.entries(checkedActivity.value).forEach(([label, isChecked]) => {
    if (isChecked && activityMapping[label]) {
      eventFields[activityMapping[label]] = true;
    }
  });

  const payload = {
    recipients_group_ids: props.selectedRecipientsIds,
    locale: locale.value,
    schedule,
    ...eventFields,
  };

  if (notificationModeActivity.value === "disabled") {
    await handleDeleteNotification();
    Object.keys(checkedActivity.value).forEach((key) => {
      checkedActivity.value[key] = false;
    });
    Object.assign(checkedDaysActivity.value, { ...defaultDays });
    props.selectedRecipientsIds.splice(0);
    return;
  } else {
    try {
      await updateProjectNotification(spaceID, projectID, payload);
      pushNotification({
        type: "success",
        title: t("t.success"),
        message: t("ProjectOverview.notifications.settings.general.successNotifText"),
      });
    } catch (error) {
      console.error(error);
      pushNotification({
        type: "error",
        title: t("t.error"),
        message: t("ProjectOverview.notifications.settings.general.errorNotifText"),
      });
    }
  }
};
</script>

<style scoped src="./ProjectNotificationsSettings.css"></style>
