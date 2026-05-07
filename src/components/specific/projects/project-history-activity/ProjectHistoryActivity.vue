<template>
  <div class="history-activity-panel">
    <div class="header">
      <h3>{{ $t("ProjectOverview.activity.title") }}</h3>
    </div>

    <div v-for="(logs, day) in groupedLogs" :key="day" class="day-group">
      <div class="day-title">{{ day }}</div>
      <ActivityItem v-for="log in logs" :key="log.id" :log="log" :formatTimeAgo="formatTimeAgo" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import { getActivityFromLog } from "./activityConfig";

import { useTimeAgo } from "../../../../composables/time.js";
import ProjectService from "../../../../services/ProjectService.js";

import ActivityItem from "./activity-item/ActivityItem.vue";

export default {
  props: {
    project: Object,
  },
  components: {
    ActivityItem,
  },
  setup(props) {
    const { t, locale } = useI18n();
    const logs = ref([]);

    const { formatTimeAgo } = useTimeAgo();

    onMounted(async () => {
      const fetchedLogs = await ProjectService.fetchLogs(props.project);

      logs.value = fetchedLogs
        .map((log) => {
          const activity = getActivityFromLog(log);

          if (!activity) return null;

          return {
            ...log,
            dateObj: new Date(log.date),
            activity,
          };
        })
        .filter(Boolean);
    });

    const formatDay = (date) => {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return t("t.today");
      }

      if (date.toDateString() === yesterday.toDateString()) {
        return t("t.yesterday");
      }

      return date.toLocaleDateString(locale.value, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    };

    const groupedLogs = computed(() =>
      logs.value
        .slice()
        .sort((a, b) => b.dateObj - a.dateObj)
        .reduce((groups, log) => {
          const key = formatDay(log.dateObj);

          groups[key] ??= [];
          groups[key].push(log);

          return groups;
        }, {}),
    );

    return {
      groupedLogs,
      formatTimeAgo,
    };
  },
};
</script>

<style scoped src="./ProjectHistoryActivity.css"></style>
