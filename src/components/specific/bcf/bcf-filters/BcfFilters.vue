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
      :class="{ 'btn-active': isFiltersActive }"
    >
      Filters
    </BIMDataButton>
    <transition name="slide-fade-up">
      <div class="bcf-filters__container p-18" v-show="showFilters">
        <div
          class="bcf-filters__container__header flex items-center justify-between"
        >
          <div class="bcf-filters__container__header__title">Filters</div>
          <BIMDataIcon
            name="close"
            size="xxs"
            fill
            color="primary"
            @click="showFilters = false"
          />
        </div>
        <BIMDataSelect
          width="264px"
          label="Priority"
          :options="priorityOptions"
          v-model="priority"
          class="m-t-24"
        />
        <BIMDataSelect
          width="264px"
          label="Status"
          :options="priorityOptions"
          v-model="priority"
          class="m-t-24"
        />
        <div class="flex justify-between m-t-24">
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
        </div>
        <BIMDataSelect
          width="264px"
          label="Tags"
          :options="priorityOptions"
          v-model="priority"
          class="m-t-24"
        />
        <div class="flex justify-center m-t-24">
          <BIMDataButton color="primary" ghost radius class="m-r-12"
            >Réinitialiser</BIMDataButton
          >
          <BIMDataButton color="primary" fill radius
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
import { ref } from "vue";

export default {
  setup() {
    const showFilters = ref(false);
    const isFiltersActive = ref(false);
    const toggleFilters = () => {
      showFilters.value = !showFilters.value;
      isFiltersActive.value = !isFiltersActive.value;
    };
    const priorityOptions = ref([]);
    const priority = ref(null);

    return {
      // References
      isFiltersActive,
      priority,
      priorityOptions,
      showFilters,
      // Methods
      toggleFilters
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfFilters.scss"></style>
