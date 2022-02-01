<template>
  <div class="project-bcf">
    <app-slot-content name="project-board-action">
      <BIMDataButton
        color="default"
        fill
        radius
        @click="openCreateBcfTopic"
        class="m-r-12"
      >
        <BIMDataIcon name="import" size="xxs" margin="0 6px 0 0" /> Importer
      </BIMDataButton>
      <BIMDataButton
        color="default"
        fill
        radius
        @click="openCreateBcfTopic"
        class="m-r-12"
      >
        <BIMDataIcon name="export" size="xs" margin="0 6px 0 0" /> Exporter
      </BIMDataButton>
      <BIMDataButton
        width="130px"
        color="primary"
        fill
        radius
        @click="openCreateBcfTopic"
      >
        <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
        <span>Créer un BCF</span>
      </BIMDataButton>
    </app-slot-content>
    <AppSidePanel title="Signaler un problème">
      <CreateBcfTopic :bcfTopics="bcfTopics" />
    </AppSidePanel>
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
        <BIMDataTooltip
          :message="
            isSortByIndexActive ? 'index ascendant' : 'index descendant'
          "
          className="bimdata-tooltip--bottom bimdata-tooltip--primary bimdata-tooltip--arrow"
        >
          <template #content>
            <BIMDataButton
              data-test="btn-sort-index"
              color="default"
              fill
              square
              icon
              class="m-r-12"
              :class="{ active: activeButton === 'indexSort' }"
              @click="sortByIndex"
              :disabled="!bcfTopics.length"
            >
              <IndexAscending
                v-if="isSortByIndexActive"
                style="heiht: 18px; width: 18px"
              />
              <IndexDescending v-else style="heiht: 18px; width: 18px" />
            </BIMDataButton>
          </template>
        </BIMDataTooltip>

        <BIMDataTooltip
          :message="
            isSortByNameActive
              ? 'ordre alphabétique'
              : 'ordre alphabétique inverse'
          "
          className="bimdata-tooltip--bottom bimdata-tooltip--primary bimdata-tooltip--arrow"
        >
          <template #content>
            <BIMDataButton
              data-test="btn-sort-name"
              color="default"
              fill
              square
              icon
              class="m-r-12"
              :class="{ active: activeButton === 'nameSort' }"
              @click="sortByName"
              :disabled="!bcfTopics.length"
            >
              <AlphabeticalAscending
                v-if="isSortByNameActive"
                style="heiht: 18px; width: 18px"
              />
              <AlphabeticalDescending v-else style="heiht: 18px; width: 18px" />
            </BIMDataButton>
          </template>
        </BIMDataTooltip>
        <BIMDataTooltip
          ref="dateTooltip"
          :message="
            isSortByDateActive ? 'date croissante' : 'date décroissante'
          "
          class="m-r-12"
          className="bimdata-tooltip--bottom bimdata-tooltip--primary bimdata-tooltip--arrow"
        >
          <template #content>
            <BIMDataButton
              data-test="btn-sort-date"
              color="default"
              fill
              square
              icon
              :class="{ active: activeButton === 'dateSort' }"
              @click="sortByDate"
              :disabled="!bcfTopics.length"
            >
              <DateAscending
                v-if="isSortByDateActive"
                style="heiht: 18px; width: 18px"
              />
              <DateDescending v-else style="heiht: 18px; width: 18px" />
            </BIMDataButton>
          </template>
        </BIMDataTooltip>
        <BIMDataTooltip
          :message="isDisplayByListActive ? 'vue grid' : 'vue list'"
          className="bimdata-tooltip--bottom bimdata-tooltip--primary bimdata-tooltip--arrow"
        >
          <template #content>
            <BIMDataButton
              color="default"
              fill
              square
              icon
              class="m-r-12"
              @click="toggleDisplayBcfTopics"
              :disabled="!bcfTopics.length"
            >
              <Grid
                v-if="isDisplayByListActive"
                style="heiht: 18px; width: 18px"
              />
              <List v-else style="heiht: 18px; width: 18px" />
            </BIMDataButton>
          </template>
        </BIMDataTooltip>
        <BcfFilters :bcfTopics="bcfTopics" @submit="onFiltersSubmit" />
      </div>
    </div>
    <div class="project-bcf__content flex m-t-36">
      <BIMDataCard class="project-bcf__content__metrics" titleHeader="Stats">
        <template #content>
          <BcfTopicsMetrics
            :bcfTopics="displayedBcfTopics"
            :loading="loading"
          />
        </template>
      </BIMDataCard>

      <!-- loading BCF -->
      <div
        class="project-bcf__content__empty flex items-center justify-center"
        v-if="loading"
      >
        <BIMDataSpinner />
      </div>
      <!-- if no Bcf topics -->
      <BcfTopicCreationCard v-else-if="displayedBcfTopics.length === 0" />
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
        <BcfTopicGrid
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

import { useAppSidePanel } from "@/components/specific/app/app-side-panel/app-side-panel.js";

// Components
import AppSlotContent from "@/components/specific/app/app-slot/AppSlotContent.vue";
import AppSidePanel from "@/components/specific/app/app-side-panel/AppSidePanel.vue";
import CreateBcfTopic from "../../../components/specific/bcf/create-bcf-topic/CreateBcfTopic.vue";
import BcfFilters from "../../../components/specific/bcf/bcf-filters/BcfFilters.vue";
import BcfTopicGrid from "../../../components/specific/bcf/bcf-topic-grid/BcfTopicGrid.vue";
import BcfTopicsList from "../../../components/specific/bcf/bcf-topics-list/BcfTopicsList.vue";
import BcfTopicsMetrics from "../../../components/specific/bcf/bcf-topics-metrics/BcfTopicsMetrics.vue";
import BcfTopicCreationCard from "../../../components/specific/bcf/bcf-topic-creation-card/BcfTopicCreationCard.vue";
import ProjectBcfOnboardingImage from "./ProjectBcfOnboardingImage.vue";

export default {
  components: {
    AppSlotContent,
    AppSidePanel,
    CreateBcfTopic,
    BcfFilters,
    BcfTopicGrid,
    BcfTopicsList,
    BcfTopicsMetrics,
    BcfTopicCreationCard,
    ProjectBcfOnboardingImage
  },
  setup() {
    const { currentProject } = useProjects();
    const { openSidePanel } = useAppSidePanel();
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
      isDisplayByListActive,
      openCreateBcfTopic: openSidePanel,
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBcf.scss"></style>
