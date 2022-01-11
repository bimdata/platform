<template>
  <div class="bcf-filters">
    <BIMDataButton
      data-test="btn-toggle-menu"
      color="default"
      fill
      square
      width="124px"
      @click="toggleFilters"
      class="btn-color-granite-light"
      :class="{ 'btn-active': filtersShown }"
    >
      Filters
    </BIMDataButton>
    <transition name="slide-fade-up">
      <div class="bcf-filters__container p-18" v-show="filtersShown">
        <div
          class="bcf-filters__container__header flex items-center justify-between"
        >
          <div class="bcf-filters__container__header__title">Filters</div>
          <BIMDataIcon
            name="close"
            size="xxs"
            fill
            color="primary"
            @click="filtersShown = false"
          />
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
        <!-- <div class="flex justify-between m-t-24">
          <BIMDataSelect
            width="47%"
            label="Début de création"
            :options="priorityOptions"
            v-model="priority"
          />
          <BIMDataSelect
            width="47%"
            label="Fin de création"
            :options="priorityOptions"
            v-model="priority"
          />
        </div> -->
        <BIMDataSelect
          width="264px"
          :multi="true"
          label="Tags"
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

export default {
  props: {
    bcfTopics: {
      type: Array,
      required: true
    }
  },
  emits: ["submit"],
  setup(props, { emit }) {
    const filtersShown = ref(false);
    const toggleFilters = () => {
      filtersShown.value = !filtersShown.value;
    };

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
    const tagOptions = computed(() => {
      return [...new Set(props.bcfTopics.flatMap(bcfTopic => bcfTopic.labels))];
    });

    const submitFilters = () => {
      emit("submit", {
        priorities: priorities.value,
        status: status.value,
        tags: tags.value
      });
      filtersShown.value = false;
    };

    const resetFilters = () => {
      priorities.value = [];
      status.value = [];
      tags.value = [];

      emit("submit", {
        priorities: priorities.value,
        status: status.value,
        tags: tags.value
      });
    };

    return {
      // References
      priorities,
      priorityOptions,
      status,
      statusOptions,
      tags,
      tagOptions,
      filtersShown,
      // Methods
      toggleFilters,
      resetFilters,
      submitFilters
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfFilters.scss"></style>
