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
      Filters
    </BIMDataButton>
    <transition name="slide-fade-up">
      <div class="bcf-filters__container p-18" v-show="showFilters">
        <div
          class="bcf-filters__container__header flex items-center justify-between"
        >
          <div class="bcf-filters__container__header__title">Filters</div>
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
          width="264px"
          :multi="true"
          label="Priority"
          :options="priorityOptions"
          v-model="priorities"
          class="m-t-24"
        />
        <BIMDataSelect
          width="264px"
          :multi="true"
          label="Status"
          :options="statusOptions"
          v-model="status"
          class="m-t-24"
        />
        <div class="bcf-filters__container__date flex justify-between m-t-24">
          <BIMDataInput
            margin="0"
            v-model="startDateInput"
            placeholder="Début de création"
            :error="hasStartDateError"
            errorMessage="Error"
          />
          <BIMDataInput
            margin="0"
            v-model="endDateInput"
            placeholder="Fin de création"
            :error="hasEndDateError"
            errorMessage="Error"
          />
        </div>
        <BIMDataSelect
          width="264px"
          :multi="tagOptions ? false : true"
          label="Tags"
          :nullValue="tagOptions ? true : false"
          :options="tagOptions ? null : tagOptions"
          :v-model="tagOptions ? noTag : tags"
          class="m-t-24"
        />
        <div class="flex justify-center m-t-24">
          <BIMDataButton
            color="primary"
            ghost
            radius
            class="m-r-12"
            @click="resetFilters"
            >Réinitialiser</BIMDataButton
          >
          <BIMDataButton color="primary" fill radius @click="submitFilters"
            ><BIMDataIcon
              name="search"
              fill
              color="default"
              margin="0 6px 0 0"
              size="xxs"
            /><span>Search</span></BIMDataButton
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, ref } from "vue";
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
    const {
      isOpen: showFilters,
      close: closeFilters,
      toggle: toggleFilters
    } = useToggle();

    // priority list
    const priorities = ref([]);
    const priorityOptions = computed(() => {
      const uniquePriorityList = [
        ...new Set(props.bcfTopics.map(bcfTopic => bcfTopic.priority))
      ];
      return uniquePriorityList.map(value =>
        value === undefined ? "Non défini" : value
      );
    });

    // status list
    const status = ref([]);
    const statusOptions = computed(() => {
      const uniqueStatusList = [
        ...new Set(props.bcfTopics.map(bcfTopic => bcfTopic.topicStatus))
      ];
      return uniqueStatusList.map(value =>
        value === undefined ? "Non défini" : value
      );
    });

    // tags list
    const tags = ref([]);
    const noTag = ref(null);
    const tagOptions = computed(() => {
      return [...new Set(props.bcfTopics.flatMap(bcfTopic => bcfTopic.labels))];
    });

    // date
    const startDateInput = ref("");
    const endDateInput = ref("");
    const hasStartDateError = ref(false);
    const hasEndDateError = ref(false);
    const isDateConform = ({ value }) => {
      const dateToCompare = formatToDateObject(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return (
        value.match(regexDate) && dateToCompare.getTime() <= today.getTime()
      );
    };

    const submitFilters = () => {
      const startDateConform = isDateConform(startDateInput);
      const endDateConform = isDateConform(endDateInput);
      if (
        priorities.value.length ||
        status.value.length ||
        tags.value.length ||
        (startDateConform && endDateConform)
      ) {
        emit("submit", {
          priorities: priorities.value,
          status: status.value,
          tags: tags.value,
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
      startDateInput.value = "";
      endDateInput.value = "";

      emit("submit", {
        priorities: priorities.value,
        status: status.value,
        tags: tags.value,
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
      noTag,
      tagOptions,
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
