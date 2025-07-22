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
          <div v-if="type === 'activity'">
            <span>Qui reçoit les notifications ?</span>
            <BIMDataButton
              color="primary"
              fill
              radius
              width="100%"
              class="m-t-12"
              @click="$emit('open-recipients-settings')"
            >
              {{ $t("ProjectOverview.notifications.settings.activity.recipientsNotificationsButton") }}
              ({{ selectedRecipientsIds.length }})
            </BIMDataButton>

            <div v-for="(labels, section) in activityOptions" :key="section">
              <h5>{{ section }}</h5>
              <BIMDataCheckbox
                v-for="(label, index) in labels"
                :key="`${section}-${index}`"
                :text="label"
                v-model="modelActivity[getActivityKey(section, index)]"
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

          <!-- Days -->
          <BIMDataCheckbox
            v-for="(label, key) in daysLabels"
            :key="`${type}-${key}`"
            :text="label"
            v-model="modelDays[key]"
            margin="6px 0 6px 23px"
          />

          <div class="flex items-center m-l-24 m-t-12">
            <span>À :</span>
            <TimePicker v-model="notificationTime" class="m-x-12" />
            <BIMDataButton
              color="primary"
              outline
              radius
              @click="$emit('open-timezone-choice')"
              height="25px"
              style="flex:1;"
              class="justify-between"
            >
              {{ currentTimezone }}
              <BIMDataIconChevron size="xxs" fill color="default" />
            </BIMDataButton>
          </div>
        </div>
      </transition>
    </template>
  </BIMDataCard>
</template>

<script setup>
import { ref, defineModel, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useNotificationSchedule } from "../../../../state/notifications.js";
import {
  getActivityOptions,
  getDaysLabels,
  RAW_ACTIVITY_OPTIONS,
} from "../../../../utils/notifications.js";
import TimePicker from "../../../generic/time-picker/TimePicker.vue";

const props = defineProps({
  title: String,
  type: String,
  defaultOpen: { type: Boolean, default: false },
  selectedRecipientsIds: {
    type: Array,
    default: () => [],
  },
  notification: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits([
  "update:notification-mode-value",
  "update:model-days",
  "update:model-activity",
  "update:selected-time",
  "open-recipients-settings",
  "open-timezone-choice",
]);

const open = ref(props.defaultOpen);
const toggle = () => (open.value = !open.value);

const { t } = useI18n();
const { selectedTimezone } = useNotificationSchedule();

const notificationModeValue = defineModel("notificationModeValue");
const modelDays = defineModel("modelDays");
const modelActivity = defineModel("modelActivity");
const selectedTime = defineModel("selectedTime");

const daysLabels = computed(() => getDaysLabels(t));
const activityOptions = computed(() => getActivityOptions(t));

const getActivityKey = (section, index) => RAW_ACTIVITY_OPTIONS[section][index];

const notificationTime = computed({
  get: () => selectedTime.value,
  set: (val) => {
    selectedTime.value = val;
  },
});

const currentTimezone = computed(() =>
  props.notification?.schedule?.timezone || selectedTimezone.value || "Timezone"
);

watch(
  modelDays,
  (days) => {
    const hasCheckedDay = Object.values(days).some(Boolean);
    if (hasCheckedDay) {
      notificationModeValue.value = "scheduled";
    }
  },
  { deep: true }
);

watch(notificationModeValue, (newValue) => {
  if (newValue !== "scheduled") {
    Object.keys(modelDays.value).forEach((day) => {
      modelDays.value[day] = false;
    });
  }
});
</script>

<style scoped src="./ProjectNotificationCard.css"></style>
