<template>
  <div class="bcf-filters" v-click-away="closeFilters">
    <BIMDataButton
      data-test="btn-toggle-menu"
      color="default"
      fill
      square
      icon
      width="120px"
      @click="toggleFilters"
      class="btn-color-granite-light"
      :class="{ 'btn-active': showFilters }"
      :disabled="!bcfTopics.length"
    >
      <BIMDataIcon
        name="filter"
        fill
        color="default"
        size="xxs"
        margin="0 6px 0 0"
      />
      {{ $t("BcfFilters.filtersButton") }}
    </BIMDataButton>
    <transition name="slide-fade-up">
      <div class="bcf-filters__container p-18" v-show="showFilters">
        <div
          class="bcf-filters__container__header flex items-center justify-between"
        >
          <div class="bcf-filters__container__header__title">
            {{ $t("BcfFilters.filtersTitle") }}
          </div>
          <BIMDataButton color="primary" ghost rounded icon>
            <BIMDataIcon
              name="close"
              size="xxs"
              fill
              color="primary"
              @click="showFilters = false"
            />
          </BIMDataButton>
        </div>
        <BIMDataSelect
          width="100%"
          :multi="true"
          :label="$t('BcfFilters.priorityLabel')"
          :options="priorityOptions"
          v-model="priorities"
          optionKey="value"
          optionLabelKey="label"
          class="m-t-24"
        />
        <BIMDataSelect
          width="100%"
          :multi="true"
          :label="$t('BcfFilters.statusLabel')"
          :options="statusOptions"
          v-model="status"
          optionKey="value"
          optionLabelKey="label"
          class="m-t-24"
        />
        <div class="bcf-filters__container__date flex justify-between m-t-24">
          <div class="m-r-6">
            <BIMDataInput
              margin="0"
              v-model="startDateInput"
              :placeholder="$t('BcfFilters.startDatePlaceholder')"
              :error="hasStartDateError"
              errorMessage="Error"
            />
            <p class="m-y-6">{{ $t("BcfFilters.startDateExample") }}</p>
          </div>
          <div>
            <BIMDataInput
              margin="0"
              v-model="endDateInput"
              :placeholder="$t('BcfFilters.endDatePlaceholder')"
              :error="hasEndDateError"
              errorMessage="Error"
            />
            <p class="m-y-6">{{ $t("BcfFilters.endDateExample") }}</p>
          </div>
        </div>
        <BIMDataSelect
          width="100%"
          :multi="true"
          :label="$t('BcfFilters.assignedToLabel')"
          :options="userOptions"
          v-model="users"
          optionKey="value"
          optionLabelKey="label"
          class="m-t-24"
        />
        <BIMDataSelect
          width="100%"
          :multi="true"
          label="creator"
          :options="creatorOptions"
          v-model="creators"
          optionKey="value"
          optionLabelKey="label"
          class="m-t-24"
        />
        <BIMDataSelect
          width="100%"
          :multi="true"
          :label="$t('BcfFilters.tagsLabel')"
          :options="tagOptions"
          v-model="tags"
          class="m-t-24"
        />
        <div class="flex justify-center m-t-24">
          <BIMDataButton
            color="primary"
            ghost
            radius
            class="m-r-12"
            @click="resetFilters"
            >{{ $t("BcfFilters.resetButton") }}</BIMDataButton
          >
          <BIMDataButton color="primary" fill radius @click="submitFilters">
            <BIMDataIcon
              name="search"
              fill
              color="default"
              margin="0 6px 0 0"
              size="xxs"
            />
            <span>{{ $t("BcfFilters.searchButton") }}</span>
          </BIMDataButton>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToggle } from "@/composables/toggle";
import { formatToDateObject, regexDate } from "@/utils/date";

export default {
  props: {
    bcfTopics: {
      type: Array,
      required: true
    }
  },
  emits: ["submit"],
  setup(props, { emit }) {
    const { t } = useI18n();

    const {
      isOpen: showFilters,
      close: closeFilters,
      toggle: toggleFilters
    } = useToggle();

    // priority list
    const priorities = ref([]);
    const priorityOptions = computed(() => {
      return Array.from(
        new Set(props.bcfTopics.map(bcfTopic => bcfTopic.priority))
      )
        .sort((a, b) => (a > b ? 1 : -1))
        .map(priorityOption => {
          return {
            label: priorityOption || t("BcfFilters.noPriority"),
            value: priorityOption
          };
        });
    });

    // status list
    const status = ref([]);
    const statusOptions = computed(() => {
      return Array.from(
        new Set(props.bcfTopics.map(bcfTopic => bcfTopic.topicStatus))
      )
        .sort((a, b) => (a > b ? 1 : -1))
        .map(statusOption => {
          return {
            label: statusOption || t("BcfFilters.undefinedStatus"),
            value: statusOption
          };
        });
    });

    // tags list
    const tags = ref([]);
    const tagOptions = computed(() => {
      return Array.from(
        new Set(props.bcfTopics.flatMap(bcfTopic => bcfTopic.labels))
      )
        .flat()
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    });

    // assigned to list
    const users = ref([]);
    const userOptions = computed(() => {
      return Array.from(
        new Set(props.bcfTopics.map(bcfTopic => bcfTopic.assignedTo))
      )
        .sort((a, b) => (a > b ? 1 : -1))
        .map(userOption => {
          return {
            label: userOption || t("BcfFilters.undefinedUser"),
            value: userOption
          };
        });
    });

    // creator's list
    const creators = ref([]);
    const creatorOptions = computed(() => {
      return Array.from(
        new Set(props.bcfTopics.map(bcfTopic => bcfTopic.creationAuthor))
      )
        .sort((a, b) => (a > b ? 1 : -1))
        .map(creatorOption => {
          return {
            label: creatorOption || t("BcfFilters.undefinedCreator"),
            value: creatorOption
          };
        });
    });

    // date
    const startDateInput = ref("");
    const endDateInput = ref("");
    const hasStartDateError = ref(false);
    const hasEndDateError = ref(false);

    const isStartDateConform = ({ value }) => {
      const dateToCompare = formatToDateObject(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return (
        value.match(regexDate) && dateToCompare.getTime() <= today.getTime()
      );
    };
    const isEndDateConform = (startValue, endValue) => {
      const startDateToCompare = formatToDateObject(startValue.value);
      const endDateToCompare = formatToDateObject(endValue.value);
      if (startValue.value < endValue.value) {
        return startDateToCompare.getTime() <= endDateToCompare.getTime();
      } else {
        return false;
      }
    };

    // Validation date + emit formulaire
    const submitFilters = () => {
      const startDateConform = isStartDateConform(startDateInput);
      const endDateConform = isEndDateConform(startDateInput, endDateInput);

      if (
        priorities.value.length ||
        status.value.length ||
        tags.value.length ||
        users.value.length ||
        creators.value.length ||
        (startDateConform && endDateConform)
      ) {
        emit("submit", {
          priorities: priorities.value.map(prio => prio.value),
          status: status.value.map(statut => statut.value),
          tags: tags.value,
          users: users.value.map(user => user.value),
          creators: creators.value.map(creator => creator.value),
          startDate: startDateInput.value,
          endDate: endDateInput.value
        });
        showFilters.value = false;
      } else if (
        startDateInput.value &&
        endDateInput.value &&
        !startDateConform &&
        !endDateConform
      ) {
        hasStartDateError.value = true;
        hasEndDateError.value = true;
      } else {
        console.log("message d'erreur ici");
      }
    };
    const resetFilters = () => {
      priorities.value = [];
      status.value = [];
      tags.value = [];
      users.value = [];
      creators.value = [];
      startDateInput.value = "";
      endDateInput.value = "";

      emit("submit", {
        priorities: priorities.value,
        status: status.value,
        tags: tags.value,
        users: users.value,
        creators: creators.value,
        startDate: startDateInput.value,
        endDate: endDateInput.value
      });
      hasStartDateError.value = false;
      hasEndDateError.value = false;
    };

    return {
      // References
      priorities,
      priorityOptions,
      status,
      statusOptions,
      tags,
      tagOptions,
      users,
      userOptions,
      creators,
      creatorOptions,
      showFilters,
      startDateInput,
      endDateInput,
      hasStartDateError,
      hasEndDateError,
      // Methods
      resetFilters,
      submitFilters,
      closeFilters,
      toggleFilters
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfFilters.scss"></style>
