<template>
  <div class="project-bcf">
    <AddBcf />
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
          <IndexAscending
            v-if="isSortByIndexActive"
            style="heiht: 18px; width: 18px"
          />
          <IndexDescending v-else style="heiht: 18px; width: 18px" />
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
          <DateAscending
            v-if="isSortByDateActive"
            style="heiht: 18px; width: 18px"
          />
          <DateDescending v-else style="heiht: 18px; width: 18px" />
        </BIMDataButton>
        <BIMDataButton
          color="default"
          fill
          square
          icon
          class="m-r-12"
          @click="toggleDisplayBcfTopics"
        >
          <Grid v-if="isDisplayByListActive" style="heiht: 18px; width: 18px" />
          <List v-else style="heiht: 18px; width: 18px" />
        </BIMDataButton>
        <BcfFilters :bcfTopics="bcfTopics" @submit="onFiltersSubmit" />
      </div>
    </div>
    <div class="project-bcf__content flex m-t-36">
      <BcfTopicsMetrics :bcfTopics="displayedBcfTopics" />

      <!-- loading BCF -->
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
      <!-- if no Bcf topics -->
      <CreateBcfTopicCard v-else-if="displayedBcfTopics.length === 0" />
      <transition-group v-else-if="isDisplayByListActive" name="list">
        <!-- display Bcf topics in list mode -->
        <BcfTopicsList
          key="display-bcf-list"
          class="project-bcf__content__list"
          :bcfTopics="displayedBcfTopics"
        />
      </transition-group>
      <transition-group v-else name="grid">
        <!-- display Bcf topics in grid mode -->
        <BcfTopicsGrid
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
import { provide, ref, watch } from "vue";
import { useProjects } from "@/state/projects.js";
import { useBcf } from "@/state/bcf.js";

import useFilter from "./composables/filter.js";
import useSearch from "./composables/search.js";
import useSort from "./composables/sort.js";

// Components
import AddBcf from "../../../components/specific/bcf/add-bcf/AddBcf.vue";
import BcfFilters from "../../../components/specific/bcf/bcf-filters/BcfFilters.vue";
import BcfTopicsGrid from "../../../components/specific/bcf/bcf-topics-grid/BcfTopicsGrid.vue";
import BcfTopicsList from "../../../components/specific/bcf/bcf-topics-list/BcfTopicsList.vue";
import BcfTopicsMetrics from "../../../components/specific/bcf/bcf-topics-metrics/BcfTopicsMetrics.vue";
import CreateBcfTopicCard from "../../../components/specific/bcf/create-bcf-topic-card/CreateBcfTopicCard.vue";
import ProjectBcfOnboardingImage from "./ProjectBcfOnboardingImage.vue";

export default {
  components: {
    AddBcf,
    BcfFilters,
    BcfTopicsGrid,
    BcfTopicsList,
    BcfTopicsMetrics,
    CreateBcfTopicCard,
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

    const isDisplayByListActive = ref(false);
    const toggleDisplayBcfTopics = () => {
      isDisplayByListActive.value = !isDisplayByListActive.value;
    };

    provide("bcfTopics", bcfTopics);

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
      isSortByDateActive,
      toggleDisplayBcfTopics,
      isDisplayByListActive
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBcf.scss"></style>
