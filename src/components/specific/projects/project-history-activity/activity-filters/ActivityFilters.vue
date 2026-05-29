<template>
  <div class="activity-filters" v-click-away="close">
    <BIMDataButton
      color="primary"
      outline
      radius
      class="activity-filters__btn"
      :class="{ 'activity-filters__btn--active': isOpen || hasActiveFilters }"
      @click="toggle"
    >
      <BIMDataIconFilterList size="xxs" />
      <span>{{ $t("t.filters") }}</span>
      <span v-if="activeFilterCount > 0" class="activity-filters__badge">
        {{ activeFilterCount }}
      </span>
    </BIMDataButton>

    <transition name="filters-panel">
      <div v-if="isOpen" class="activity-filters__panel">
        <!-- Header -->
        <div class="activity-filters__panel-header">
          <span>{{ $t("ProjectOverview.activity.filters.title") }}</span>
        </div>

        <!-- Types -->
        <div class="activity-filters__section">
          <div class="activity-filters__title">
            {{ $t("ProjectOverview.activity.filters.types") }}
          </div>
          <div class="activity-filters__types">
            <label
              v-for="type in availableTypes"
              :key="type.action"
              class="activity-filters__row flex"
              :class="{
                'is-checked': localFilters.types.includes(type.action),
                'is-disabled': type.disabled,
              }"
              @click="!type.disabled && toggleItem(localFilters.types, type.action)"
            >
              <BIMDataCheckbox
                :modelValue="localFilters.types.includes(type.action)"
                :disabled="type.disabled"
                @update:modelValue="!type.disabled && toggleItem(localFilters.types, type.action)"
                margin="0 6px 0 0"
                @click.stop
              />
              <span>{{ $t(type.badgeKey) }}</span>
            </label>
          </div>
        </div>

        <!-- Users -->
        <div class="activity-filters__section">
          <div class="activity-filters__title">
            {{ $t("ProjectOverview.activity.filters.users") }}
          </div>
          <div class="activity-filters__users">
            <label
              v-for="user in availableUsers"
              :key="user"
              class="activity-filters__row flex"
              @click="toggleItem(localFilters.users, user)"
            >
              <BIMDataCheckbox
                :modelValue="localFilters.users.includes(user)"
                @update:modelValue="toggleItem(localFilters.users, user)"
                margin="0 6px 0 0"
                @click.stop
              />
              <span>{{ user }}</span>
            </label>
          </div>
        </div>

        <!-- Date -->
        <div class="activity-filters__section">
          <div class="activity-filters__title">
            {{ $t("ProjectOverview.activity.filters.period") }}
          </div>
          <div class="activity-filters__date-range">
            <BIMDataDatePicker
              :placeholder="$t('ProjectOverview.activity.filters.period')"
              :isDateRange="true"
              :autoCloseRange="true"
              :clearButton="true"
              :modelValue="localFilters.dateFrom"
              :toDate="localFilters.dateTo"
              :language="locale"
              fixedPosition="bottom-left"
              width="100%"
              @update:modelValue="localFilters.dateFrom = $event"
              @to-date-change="localFilters.dateTo = $event"
              @cleared="
                localFilters.dateFrom = null;
                localFilters.dateTo = null;
              "
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="activity-filters__footer">
          <BIMDataButton ghost @click="reset">
            {{ $t("t.reset") }}
          </BIMDataButton>
          <BIMDataButton color="primary" fill @click="apply">
            {{ $t("t.apply") }}
          </BIMDataButton>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ACTION_CONFIG } from "../../../../../config/activity-config.js";

export default {
  name: "ActivityFilters",

  props: {
    modelValue: {
      type: Object,
      default: () => ({
        types: [],
        users: [],
        dateFrom: null,
        dateTo: null,
      }),
    },
    availableUsers: {
      type: Array,
      default: () => [],
    },
    availableActions: {
      type: Set,
      default: () => new Set(),
    },
  },

  emits: ["update:modelValue"],

  setup(props, { emit }) {
    const { locale } = useI18n();
    const isOpen = ref(false);

    const cloneFilters = () => ({
      ...props.modelValue,
      dateFrom: props.modelValue.dateFrom ? new Date(props.modelValue.dateFrom) : null,
      dateTo: props.modelValue.dateTo ? new Date(props.modelValue.dateTo) : null,
      types: [...props.modelValue.types],
      users: [...props.modelValue.users],
    });
    const localFilters = ref(cloneFilters());

    watch(
      () => props.modelValue,
      () => {
        localFilters.value = cloneFilters();
      },
      { deep: true },
    );

    const availableTypes = computed(() =>
      Object.entries(ACTION_CONFIG).map(([action, config]) => ({
        action,
        badgeKey: config.badgeKey,
        disabled: props.availableActions.size > 0 && !props.availableActions.has(action),
      })),
    );

    const toggleItem = (arr, value) => {
      const index = arr.indexOf(value);
      if (index === -1) arr.push(value);
      else arr.splice(index, 1);
    };

    const activeFilterCount = computed(() => {
      const f = props.modelValue;
      return f.types.length + f.users.length + (f.dateFrom || f.dateTo ? 1 : 0);
    });

    const hasActiveFilters = computed(() => activeFilterCount.value > 0);

    const toggle = () => {
      isOpen.value = !isOpen.value;
      if (isOpen.value) localFilters.value = cloneFilters();
    };

    const close = () => {
      isOpen.value = false;
    };

    const reset = () => {
      localFilters.value.types = [];
      localFilters.value.users = [];
      localFilters.value.dateFrom = null;
      localFilters.value.dateTo = null;
    };

    const apply = () => {
      emit("update:modelValue", {
        ...localFilters.value,
        dateFrom: localFilters.value.dateFrom ? new Date(localFilters.value.dateFrom) : null,
        dateTo: localFilters.value.dateTo ? new Date(localFilters.value.dateTo) : null,
        types: [...localFilters.value.types],
        users: [...localFilters.value.users],
      });
      isOpen.value = false;
    };

    return {
      locale,
      isOpen,
      localFilters,
      availableTypes,
      activeFilterCount,
      hasActiveFilters,
      toggleItem,
      toggle,
      close,
      reset,
      apply,
    };
  },
};
</script>

<style scoped src="./ActivityFilters.css"></style>
