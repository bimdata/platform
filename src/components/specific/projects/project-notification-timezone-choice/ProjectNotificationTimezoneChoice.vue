<template>
  <div class="project-notification-timezone-choice">
    <div class="flex items-center justify-between">
      <BIMDataButton color="primary" ghost radius icon @click="$emit('back-to-settings')">
        <BIMDataIconArrow size="xxs" />
        <span style="margin-left: 6px">{{ $t("t.back") }}</span>
      </BIMDataButton>
      <div class="flex items-center">
        <BIMDataIconKey fill color="default" margin="0 6px 0 0" size="xs" />
        <span>{{ $t("ProjectOverview.notifications.recipients.title") }}</span>
      </div>
      <BIMDataButton ghost rounded icon @click="$emit('close')">
        <BIMDataIconClose size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>
    <div class="project-notification-timezone-choice__content">
      <BIMDataSearch
        class="m-y-12"
        :placeholder="$t('t.search')"
        color="primary"
        radius
        :clear="true"
        width="100%"
        height="32px"
        v-model="searchText"
      />
      <div class="timezones">
        <div class="timezone" v-for="timezone in timezoneOptions" :id="timezone.id">
          <BIMDataRadio :text="timezone" :value="timezone" v-model="selectedTimezone" />
        </div>
      </div>
      <BIMDataButton color="primary" fill radius width="100%" class="m-t-12" @click="$emit('back-to-settings')">Valider la time zone</BIMDataButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useListFilter } from "../../../../composables/list-filter.js";
import { useNotificationSchedule } from "../../../../state/notifications.js";

defineEmits(["close", "back-to-settings"]);

const { selectedTimezone } = useNotificationSchedule();
const { filteredList: timezoneOptions, searchText } = useListFilter(
  computed(() => Intl.supportedValuesOf("timeZone"))
);
</script>

<style scoped src="./ProjectNotificationTimezoneChoice.css"></style>
