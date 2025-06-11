<template>
  <BIMDataCard class="project-notiication-card">
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
            <div v-if="type === 'activity'">
              <div v-for="(options, section) in activityOptions" :key="section">
                <h5>{{ section }}</h5>
                <BIMDataCheckbox
                  v-for="label in options"
                  :key="label"
                  :text="label"
                  v-model="activityChecked[label]"
                  margin="6px 0"
                />
              </div>
            </div>
            <div class="separator"></div>
          </div>
          <BIMDataRadio
            :text="$t('ProjectOverview.notifications.settings.general.sendNever')"
            value="v0"
            v-model="selected"
          />
          <BIMDataRadio
            v-if="type !== 'activity'"
            :text="$t('ProjectOverview.notifications.settings.general.sendEventOccurs')"
            value="v1"
            v-model="selected"
          />
          <BIMDataRadio
            :text="$t('ProjectOverview.notifications.settings.general.sendEvery')"
            value="v2"
            v-model="selected"
          />
          <BIMDataCheckbox
            v-for="day in daysOfWeek"
            :key="`${type}-${day}`"
            :text="day"
            v-model="checked[day]"
            margin="6px 0 6px 23px"
          />
        </div>
      </transition>
    </template>
  </BIMDataCard>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  title: String,
  type: String,
  modelValue: String,
  modelChecked: Object,
  defaultOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "update:modelChecked"]);

const open = ref(props.defaultOpen);
const toggle = () => (open.value = !open.value);

const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

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

const activityChecked = ref(
  Object.fromEntries(
    Object.values(activityOptions)
      .flat()
      .map((label) => [label, false])
  )
);

const selected = ref(props.modelValue);
const checked = ref({ ...props.modelChecked });

watch(selected, (val) => {
  emit("update:modelValue", val);
  if (val !== "v2") {
    for (const day of daysOfWeek) checked.value[day] = false;
    emit("update:modelChecked", { ...checked.value });
  }
});

watch(
  checked,
  (newVal) => {
    const anyChecked = Object.values(newVal).some(Boolean);
    if (anyChecked && selected.value !== "v2") {
      selected.value = "v2";
      emit("update:modelValue", "v2");
    }
    emit("update:modelChecked", { ...newVal });
  },
  { deep: true }
);

if (props.type === "activity") {
  watch(
    activityChecked,
    (newVal) => {
      const anyChecked = Object.values(newVal).some(Boolean);
      if (anyChecked && selected.value !== "v2") {
        selected.value = "v2";
        emit("update:modelValue", "v2");
      }
    },
    { deep: true }
  );
}
</script>

<style scoped src="./ProjectNotificationCard.css"></style>
