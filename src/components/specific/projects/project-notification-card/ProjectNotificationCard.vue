<template>
  <BIMDataCard class="project-notification-card">
    <template #content>
      <div class="card-header flex items-center justify-between" @click="toggle">
        <div class="flex items-center">
          <slot name="icon" />
          <strong>{{ title }}</strong>
        </div>
        <BIMDataButton color="primary" ghost radius icon>
          <BIMDataIconChevron fill color="default" :rotate="open ? 90 : 0" size="xxs" />
        </BIMDataButton>
      </div>

      <transition name="slide-fade-up">
        <div v-show="open">
          <!-- Activité : cases à cocher par catégorie -->
          <div v-if="type === 'activity'">
            <div v-for="(options, section) in activityOptions" :key="section">
              <h5>{{ section }}</h5>
              <BIMDataCheckbox
                v-for="label in options"
                :key="label"
                :text="label"
                v-model="modelActivity[label]"
                margin="6px 0"
              />
            </div>
            <div class="separator"></div>
          </div>

          <!-- Radios -->
          <BIMDataRadio
            :text="$t('ProjectOverview.notifications.settings.general.sendNever')"
            value="disabled"
            v-model="notificationModeValue"
          />
          <BIMDataRadio
            v-if="type !== 'activity'"
            :text="$t('ProjectOverview.notifications.settings.general.sendEventOccurs')"
            value="immediate"
            v-model="notificationModeValue"
          />
          <BIMDataRadio
            :text="$t('ProjectOverview.notifications.settings.general.sendEvery')"
            value="scheduled"
            v-model="notificationModeValue"
          />

          <!-- Jours -->
          <BIMDataCheckbox
            v-for="[day, isChecked] in Object.entries(modelDays)"
            :key="`${type}-${day}`"
            :text="day"
            v-model="modelDays[day]"
            margin="6px 0 6px 23px"
          />
        </div>
      </transition>
    </template>
  </BIMDataCard>
</template>

<script setup>
import { ref, defineModel } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  title: String,
  type: String,
  defaultOpen: { type: Boolean, default: false },
});

const emit = defineEmits([
  "update:notification-mode-value",
  "update:model-days",
  "update:model-activity",
]);

const open = ref(props.defaultOpen);
const toggle = () => (open.value = !open.value);

const notificationModeValue = defineModel("notificationModeValue");
const modelDays = defineModel("modelDays");
const modelActivity = defineModel("modelActivity");

const activityOptions = {
  GED: [
    t("ProjectOverview.notifications.settings.activity.ged.fileUpload"),
    t("ProjectOverview.notifications.settings.activity.ged.fileDeletion"),
    t("ProjectOverview.notifications.settings.activity.ged.newVersion"),
    t("ProjectOverview.notifications.settings.activity.ged.folderCreation"),
    t("ProjectOverview.notifications.settings.activity.ged.folderDeletion"),
  ],
  Visa: [
    t("ProjectOverview.notifications.settings.activity.visa.visaCreation"),
    t("ProjectOverview.notifications.settings.activity.visa.visaDeletion"),
    t("ProjectOverview.notifications.settings.activity.visa.visaValidation"),
    t("ProjectOverview.notifications.settings.activity.visa.visaRejection"),
  ],
  BCF: [
    t("ProjectOverview.notifications.settings.activity.bcf.bcfCreation"),
    t("ProjectOverview.notifications.settings.activity.bcf.bcfDeletion"),
  ],
  "Autres évènements": [
    t("ProjectOverview.notifications.settings.activity.otherEvents.acceptInvit"),
    t("ProjectOverview.notifications.settings.activity.otherEvents.removeModels"),
    t("ProjectOverview.notifications.settings.activity.otherEvents.createMetaBuilding"),
    t("ProjectOverview.notifications.settings.activity.otherEvents.deleteMetaBuilding"),
  ],
};

</script>

<style scoped src="./ProjectNotificationCard.css"></style>
