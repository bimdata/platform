<template>
  <div class="history-activity-panel">
    <div class="m-b-12">
      <div class="header">
        <h3>{{ $t("ProjectOverview.activity.title") }}</h3>
      </div>

      <div class="actions flex">
        <BIMDataSearch
          class="input-search"
          width="95%"
          :placeholder="$t('t.search')"
          v-model="searchText"
          clear
          color="primary"
        />
        <ActivityFilters
          v-model="filters"
          :availableUsers="availableUsers"
          :availableActions="availableActions"
        />
      </div>
    </div>

    <div class="content">
      <template v-if="loading">
        <BIMDataSpinner class="flex items-center justify-center" style="height: 100%" />
      </template>
      <template v-else-if="hasDisplayedLogs">
        <div v-for="(logs, day) in displayedGroupedLogs" :key="day" class="day-group">
          <div class="day-title">{{ day }}</div>
          <ActivityItem
            v-for="log in logs"
            :key="log.id"
            :log="log"
            :formatTimeAgo="formatTimeAgo"
            @go-folder="$emit('go-folder', $event)"
          />
        </div>
      </template>
      <template v-else>
        <p>{{ $t("ProjectOverview.activity.empty") }}</p>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";

import { getActivityFromLog } from "../../../../config/activity-config.js";
import { useTimeAgo } from "../../../../composables/time.js";
import ProjectService from "../../../../services/ProjectService.js";

import ActivityItem from "./activity-item/ActivityItem.vue";
import ActivityFilters from "./activity-filters/ActivityFilters.vue";

export default {
  props: {
    project: Object,
  },
  components: {
    ActivityItem,
    ActivityFilters,
  },
  emits: ["go-folder"],

  setup(props) {
    const { t, locale } = useI18n();

    const logs = ref([]);
    const searchText = ref("");

    const { formatTimeAgo } = useTimeAgo();
    const loading = ref(false);
    const fetchLogs = async () => {
      loading.value = true;
      logs.value = [];
      try {
        const fetchedLogs = await ProjectService.fetchLogs(props.project);
        logs.value = fetchedLogs
          .map((log) => {
            const activity = getActivityFromLog(log);

            if (!activity) return null;

            return {
              ...log,
              activity,
              dateObj: new Date(log.date),

              _search: [
                log.action,
                log.user_email,
                log.project_name,
                activity?.target,
                log.path,
                t(activity?.actionKey ?? ""),
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase(),
            };
          })
          .filter(Boolean);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchLogs);

    watch(() => props.project, fetchLogs);

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

    const sortedLogs = computed(() => logs.value.slice().sort((a, b) => b.dateObj - a.dateObj));

    const displayedGroupedLogs = computed(() => {
      const search = searchText.value.trim().toLowerCase();
      const f = filters.value;

      return sortedLogs.value
        .filter((log) => {
          if (search && !log._search.includes(search)) return false;

          // Types
          if (f.types.length && !f.types.includes(log.action)) return false;

          // Users
          if (f.users.length && !f.users.includes(log.user_email)) return false;

          // Date
          if (f.dateFrom && log.dateObj < f.dateFrom) return false;
          if (f.dateTo) {
            const endOfDay = new Date(f.dateTo);
            endOfDay.setHours(23, 59, 59, 999);
            if (log.dateObj > endOfDay) return false;
          }

          return true;
        })
        .reduce((groups, log) => {
          const day = formatDay(log.dateObj);
          groups[day] ??= [];
          groups[day].push(log);
          return groups;
        }, {});
    });

    const hasDisplayedLogs = computed(() => Object.keys(displayedGroupedLogs.value).length > 0);

    const filters = ref({
      types: [],
      users: [],
      dateFrom: null,
      dateTo: null,
    });

    const availableUsers = computed(() => [
      ...new Set(logs.value.map((l) => l.user_email).filter(Boolean)),
    ]);

    const availableActions = computed(() => new Set(logs.value.map((l) => l.action)));

    return {
      loading,
      displayedGroupedLogs,
      hasDisplayedLogs,
      searchText,
      filters,
      availableUsers,
      availableActions,
      formatTimeAgo,
    };
  },
};
</script>

<style scoped src="./ProjectHistoryActivity.css"></style>
