<template>
  <div class="project-notifications-settings p-b-12">
    <div class="flex items-center justify-between">
      <BIMDataButton color="primary" ghost radius icon @click="$emit('close')">
        <BIMDataIconArrow size="xxs" />
        <span style="margin-left: 6px">{{ $t("t.back") }}</span>
      </BIMDataButton>
      <div class="flex items-center">
        <BIMDataIconSettings fill color="default" margin="0 6px 0 0" />
        <span>{{ $t("ProjectOverview.notifications.title") }}</span>
      </div>
      <BIMDataButton ghost rounded icon @click="$emit('close')">
        <BIMDataIconClose size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>
    <div class="header">
      {{ $t("ProjectOverview.notifications.headerText") }}
    </div>
    <div class="m-t-18">
      <ProjectNotificationCard
        :title="$t('ProjectOverview.notifications.settings.activity.title')"
        type="activity"
        :selectedRecipientsIds="selectedRecipientsIds"
        v-model:notification-mode-value="notificationModeActivity"
        v-model:model-days="checkedDaysActivity"
        v-model:model-activity="checkedActivity"
        :defaultOpen="true"
        @open-recipients-settings="$emit('open-recipients-settings')"
      >
        <template #icon>
          <BIMDataIconProject fill color="default" margin="0 6px 0 0" />
        </template>
      </ProjectNotificationCard>
    </div>

    <div class="footer m-t-18">
      <BIMDataButton color="primary" fill radius width="100%" @click="updateNotifications">
        {{ $t("ProjectOverview.notifications.validateButton") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

import { useAppNotification } from "../../app/app-notification/app-notification.js";
import { useProjects } from "../../../../state/projects.js";
import {
  getActivityMapping,
  getDefaultCheckedActivity,
  getDefaultCheckedDays,
} from "../../../../utils/notifications.js";

import ProjectNotificationCard from "../project-notification-card/ProjectNotificationCard.vue";

const props = defineProps({
  selectedRecipientsIds: {
    type: Array,
    default: () => [],
  },
});
defineEmits(["open-recipients-settings", "close"]);

const { t, locale } = useI18n();
const route = useRoute();
const { pushNotification } = useAppNotification();
const { notifications, fetchProjectNotification, updateProjectNotification } = useProjects();

const spaceID = +route.params.spaceID;
const projectID = +route.params.projectID;
// "disabled", "immediate", "scheduled"
const notificationModeActivity = ref("disabled");
const checkedDaysActivity = ref(getDefaultCheckedDays(t));
const checkedActivity = ref(getDefaultCheckedActivity(t));
const activityMapping = getActivityMapping(t);

onMounted(async () => {
  const notification = await fetchProjectNotification(spaceID, projectID);
  initializeStateFromNotification(notification);
});

const updateNotifications = async () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const schedule =
    notificationModeActivity.value === "scheduled"
      ? {
          time: "08:00",
          timezone,
          monday: checkedDaysActivity.value["Lundi"],
          tuesday: checkedDaysActivity.value["Mardi"],
          wednesday: checkedDaysActivity.value["Mercredi"],
          thursday: checkedDaysActivity.value["Jeudi"],
          friday: checkedDaysActivity.value["Vendredi"],
          saturday: checkedDaysActivity.value["Samedi"],
          sunday: checkedDaysActivity.value["Dimanche"],
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
    payload.schedule = null;
  }

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
};

const initializeStateFromNotification = (notification) => {
  Object.entries(checkedActivity.value).forEach(([label]) => {
    const key = activityMapping[label];
    if (key) {
      checkedActivity.value[label] = !!notification[key];
    }
  });

  if (notification.schedule) {
    Object.assign(checkedDaysActivity.value, {
      Lundi: notification.schedule.monday,
      Mardi: notification.schedule.tuesday,
      Mercredi: notification.schedule.wednesday,
      Jeudi: notification.schedule.thursday,
      Vendredi: notification.schedule.friday,
      Samedi: notification.schedule.saturday,
      Dimanche: notification.schedule.sunday,
    });

    notificationModeActivity.value = Object.values(checkedDaysActivity.value).some(Boolean)
      ? "scheduled"
      : "immediate";
  } else {
    notificationModeActivity.value = "disabled";
  }
};
</script>

<style scoped src="./ProjectNotificationsSettings.css"></style>
