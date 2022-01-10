<template>
  <div class="project-bcf">
    <app-slot-content name="project-board-action">
      <BIMDataButton width="140px" color="primary" fill radius>
        <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
        <span>Ajouter un BCF</span>
      </BIMDataButton>
    </app-slot-content>
    <div
      class="project-bcf__actions flex justify-between m-t-24"
      v-if="displayedBcfTopics.length"
    >
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
        <BcfFilters :bcfTopics="displayedBcfTopics" />
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
          :key="bcfTopic.index"
          :project="project"
          :bcfTopic="bcfTopic"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useProjects } from "@/state/projects.js";
import { useListSort } from "@/composables/list-sort.js";
import { useListFilter } from "@/composables/list-filter";
import { useBcf } from "@/state/bcf.js";
import AppSlotContent from "@/components/generic/app-slot/AppSlotContent.vue";

// Components
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
      () => currentProject.value,
      async () => {
        try {
          loading.value = true;
          bcfTopics.value = await loadBcfTopics(currentProject.value);
        } finally {
          loading.value = false;
        }
      },
      { immediate: true }
    );

    // sort by topic title
    const { sortToggle: sortToggleName, sortOrder: nameSortOrder } =
      useListSort(bcfTopics, topic => topic.title);
    const isSortByNameActive = computed(() => nameSortOrder.value === "asc");

    // sort by topic index
    const { sortToggle: sortToggleIndex, sortOrder: indexSortOrder } =
      useListSort(bcfTopics, topic => topic.index);
    const isSortByIndexActive = computed(() => indexSortOrder.value === "asc");

    // sort by topic date
    const { sortToggle: sortToggleDate, sortOrder: dateSortOrder } =
      useListSort(bcfTopics, topic => topic.creationDate);
    const isSortByDateActive = computed(() => dateSortOrder.value === "asc");

    const { filteredList: displayedBcfTopics, searchText } = useListFilter(
      bcfTopics,
      topic => topic.title
    );

    const activeButton = ref("");
    const sortByName = () => {
      sortToggleName();
      activeButton.value = "nameSort";
    };
    const sortByIndex = () => {
      sortToggleIndex();
      activeButton.value = "indexSort";
    };
    const sortByDate = () => {
      sortToggleDate();
      activeButton.value = "dateSort";
    };

    return {
      loading,
      project: currentProject,
      displayedBcfTopics,
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
