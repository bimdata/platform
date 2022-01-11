<template>
  <div class="project-bcf">
    <app-slot-content name="project-board-action">
      <BIMDataButton width="140px" color="primary" fill radius>
        <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
        <span>Ajouter un BCF</span>
      </BIMDataButton>
    </app-slot-content>
    <div class="project-bcf__actions flex justify-between m-t-24">
      <BIMDataSearch
        placeholder="Search"
        color="secondary"
        radius
        width="38%"
        v-model="searchText"
      >
      </BIMDataSearch>
      <div class="flex">
        <BIMDataButton
          data-test="btn-sort-index"
          color="default"
          fill
          square
          icon
          class="m-r-12"
          :class="{ active: activeButton === 'indexSort' }"
          @click="sortByIndex"
        >
          <span v-if="isSortByIndexActive">#</span>
          <span v-else>?</span>
        </BIMDataButton>
        <BIMDataButton
          data-test="btn-sort-name"
          color="default"
          fill
          square
          icon
          class="m-r-12"
          :class="{ active: activeButton === 'nameSort' }"
          @click="sortByName"
        >
          <AlphabeticalAscending
            v-if="isSortByNameActive"
            style="heiht: 18px; width: 18px"
          />
          <AlphabeticalDescending v-else style="heiht: 18px; width: 18px" />
        </BIMDataButton>
        <BIMDataButton
          data-test="btn-sort-date"
          color="default"
          fill
          square
          icon
          class="m-r-12"
          :class="{ active: activeButton === 'dateSort' }"
          @click="sortByDate"
        >
          <BIMDataIcon name="calendar" fill color="granite-light" />
        </BIMDataButton>
        <BIMDataButton color="default" fill square icon class="m-r-12">
          List
        </BIMDataButton>
        <BcfFilters :bcfTopics="bcfTopics" @submit="onFiltersSubmit" />
      </div>
    </div>
    <div class="project-bcf__content flex m-t-36">
      <div
        class="project-bcf__content__metrics flex items-center justify-center"
        style="width: 701px; background-color: white"
      >
        Some stats here
      </div>
      <transition-group name="grid">
        <div
          class="project-bcf__content__empty flex items-center justify-center"
          v-if="loading"
        >
          <ProjectBcfOnboardingImage class="m-r-48" />
          <div class="flex items-center">
            <BIMDataSpinner class="m-b-12" />
            <span> loading Bcf topics </span>
          </div>
        </div>
        <BcfTopics
          v-else
          v-for="bcfTopic in displayedBcfTopics"
          :key="bcfTopic.guid"
          :project="project"
          :bcfTopic="bcfTopic"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useProjects } from "@/state/projects.js";
import { useBcf } from "@/state/bcf.js";
import useFilter from "./composables/filter.js";
import useSearch from "./composables/search.js";
import useSort from "./composables/sort.js";

// Components
import AppSlotContent from "@/components/generic/app-slot/AppSlotContent.vue";
import BcfFilters from "../../../components/specific/bcf/bcf-filters/BcfFilters.vue";
import BcfTopics from "../../../components/specific/bcf/bcf-topics/BcfTopics.vue";
import ProjectBcfOnboardingImage from "./ProjectBcfOnboardingImage.vue";

export default {
  components: {
    BcfFilters,
    BcfTopics,
    AppSlotContent,
    ProjectBcfOnboardingImage
  },
  setup() {
    const { currentProject } = useProjects();
    const { loadBcfTopics } = useBcf();
    const bcfTopics = ref([]);
    const loading = ref(false);

    watch(
      currentProject,
      async () => {
        try {
          loading.value = true;
          bcfTopics.value = await loadBcfTopics(currentProject.value);
        } finally {
          loading.value = false;
        }
      },
      {
        immediate: true
      }
    );

    const { onFiltersSubmit, filteredTopics } = useFilter(bcfTopics);

    const { searchText, searchedTopics: displayedBcfTopics } =
      useSearch(filteredTopics);

    const {
      sortByName,
      sortByIndex,
      sortByDate,
      activeButton,
      isSortByNameActive,
      isSortByIndexActive,
      isSortByDateActive
    } = useSort(bcfTopics);

    return {
      loading,
      bcfTopics,
      project: currentProject,
      displayedBcfTopics,
      filteredTopics,
      onFiltersSubmit,
      searchText,
      sortByName,
      sortByIndex,
      sortByDate,
      activeButton,
      isSortByNameActive,
      isSortByIndexActive,
      isSortByDateActive
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBcf.scss"></style>
