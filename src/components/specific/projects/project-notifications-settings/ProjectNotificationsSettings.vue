<template>
  <div class="project-notifications-settings p-b-12">
    <div class="header">
      {{ $t('ProjectOverview.notifications.headerText') }}
    </div>
    <div class="m-t-18">
      <ProjectNotificationCard
        :title="$t('ProjectOverview.notifications.settings.visa.title')"
        type="visa"
        v-model:modelValue="selectedVisa"
        v-model:modelChecked="checkedVisa"
        :defaultOpen="true"
      >
        <template #icon>
          <BIMDataIconVisa fill color="default" margin="0 6px 0 0" />
        </template>
      </ProjectNotificationCard>
    </div>
    <div class="m-t-18">
      <ProjectNotificationCard
        :title="$t('ProjectOverview.notifications.settings.bcf.title')"
        type="bcf"
        v-model:modelValue="selectedBcf"
        v-model:modelChecked="checkedBcf"
      >
        <template #icon>
          <BIMDataIconBcf fill color="default" margin="0 6px 0 0" />
        </template>
      </ProjectNotificationCard>
    </div>
    <div class="m-t-18">
      <ProjectNotificationCard
        :title="$t('ProjectOverview.notifications.settings.activity.title')"
        type="activity"
        v-model:modelValue="selectedActivity"
        v-model:modelChecked="checkedActivity"
      >
        <template #icon>
          <BIMDataIconProject fill color="default" margin="0 6px 0 0" />
        </template>
      </ProjectNotificationCard>
    </div>
    <div class="footer m-t-18">
      <BIMDataButton color="primary" fill radius width="100%">
        {{ $t('ProjectOverview.notifications.validateButton') }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script setup>
import ProjectNotificationCard from "../project-notification-card/ProjectNotificationCard.vue";
import { ref } from "vue";

const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const selectedVisa = ref("v0");
const selectedBcf = ref("v0");
const selectedActivity = ref("v0");

const checkedVisa = ref(Object.fromEntries(daysOfWeek.map((day) => [day, false])));
const checkedBcf = ref(Object.fromEntries(daysOfWeek.map((day) => [day, false])));
const checkedActivity = ref(Object.fromEntries(daysOfWeek.map((day) => [day, false])));
</script>

<style scoped src="./ProjectNotificationsSettings.css"></style>
