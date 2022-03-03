<template>
  <div class="project-bcf">
    <app-slot-content name="project-board-action">
      <BIMDataButton
        color="primary"
        outline
        radius
        icon
        class="m-r-12"
        @click="openBcfSettings"
      >
        <BIMDataIcon name="settings" size="xxs" color="default" />
      </BIMDataButton>
      <FileUploadButton
        class="m-r-12"
        width="auto"
        multiple
        color="default"
        :accept="['.bcf']"
        @upload="uploadFiles"
      >
        <BIMDataIcon name="import" size="xs" margin="0 6px 0 0" />
        {{ $t("ProjectBcf.importButtonText") }}
      </FileUploadButton>
      <BIMDataButton
        color="default"
        fill
        radius
        @click="exportBcfTopics"
        class="m-r-12"
      >
        <BIMDataIcon name="export" size="xs" margin="0 6px 0 0" />
        {{ $t("ProjectBcf.exportButtonText") }}
      </BIMDataButton>
      <BIMDataButton
        width="130px"
        color="primary"
        fill
        radius
        @click="openCreateBcfTopic"
      >
        <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
        <span>{{ $t("ProjectBcf.createBcfButtonText") }}</span>
      </BIMDataButton>
    </app-slot-content>
    <AppSidePanel :title="$t('ProjectBcf.createBcfTitle')">
      <CreateBcfTopic :bcfTopics="bcfTopics" />
    </AppSidePanel>
    <div class="project-bcf__settings" v-show="showBcfSettings">
      <BcfSettings @close="closeBcfSettings" />
    </div>
    <div class="project-bcf__actions flex justify-between m-t-24">
      <BIMDataSearch
        :placeholder="$t('ProjectBcf.searchInputPlaceholder')"
        color="secondary"
        radius
        width="38%"
        v-model="searchText"
      >
      </BIMDataSearch>
      <div class="flex">
        <BIMDataTooltip
          :message="
            isSortByIndexActive
              ? $t('ProjectBcf.ascendingIndexTooltip')
              : $t('ProjectBcf.descendingIndexTooltip')
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
              ? $t('ProjectBcf.alphabeticalAscendingOrderTooltip')
              : $t('ProjectBcf.alphabeticalDescendingOrderTooltip')
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
            isSortByDateActive
              ? $t('ProjectBcf.ascendingDateTooltip')
              : $t('ProjectBcf.ascendingDateTooltip')
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
            v-if="detailedExtensions"
            :bcfTopics="displayedBcfTopics"
            :priorities="detailedExtensions.priorities"
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
        <BcfTopicGridItem
          v-for="bcfTopic in displayedBcfTopics"
          :key="bcfTopic.guid"
          :project="project"
          :bcfTopic="bcfTopic"
          :detailedExtensions="detailedExtensions"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useAppSidePanel } from "@/components/specific/app/app-side-panel/app-side-panel.js";
import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";

// composables
import useFilter from "./composables/filter.js";
import useSearch from "./composables/search.js";
import useSort from "./composables/sort.js";
import { useToggle } from "@/composables/toggle";

// Components
import AppSlotContent from "@/components/specific/app/app-slot/AppSlotContent.vue";
import AppSidePanel from "@/components/specific/app/app-side-panel/AppSidePanel.vue";
import FileUploadButton from "@/components/specific/files/file-upload-button/FileUploadButton";
import BcfFilters from "../../../components/specific/bcf/bcf-filters/BcfFilters.vue";
import BcfSettings from "../../../components/specific/bcf/bcf-settings/BcfSettings.vue";

import BcfTopicCreationCard from "../../../components/specific/bcf/bcf-topic-creation-card/BcfTopicCreationCard.vue";
import BcfTopicGridItem from "../../../components/specific/bcf/bcf-topic-grid-item/BcfTopicGridItem.vue";
import BcfTopicsList from "../../../components/specific/bcf/bcf-topics-list/BcfTopicsList.vue";
import BcfTopicsMetrics from "../../../components/specific/bcf/bcf-topics-metrics/BcfTopicsMetrics.vue";
import CreateBcfTopic from "../../../components/specific/bcf/create-bcf-topic/CreateBcfTopic.vue";

export default {
  components: {
    AppSlotContent,
    AppSidePanel,
    CreateBcfTopic,
    BcfFilters,
    BcfSettings,
    BcfTopicGridItem,
    BcfTopicsList,
    BcfTopicsMetrics,
    BcfTopicCreationCard,
    FileUploadButton
  },
  setup() {
    const { currentProject } = useProjects();
    const { openSidePanel } = useAppSidePanel();
    const {
      bcfTopics,
      loadBcfTopics,
      importBcf,
      exportBcf,
      detailedExtensions
    } = useBcf();
    const loading = ref(false);

    watch(
      currentProject,
      async () => {
        try {
          loading.value = true;
          await loadBcfTopics(currentProject.value);
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
    } = useSort(displayedBcfTopics);

    const isDisplayByListActive = ref(false);
    const toggleDisplayBcfTopics = () => {
      isDisplayByListActive.value = !isDisplayByListActive.value;
    };

    const uploadFiles = async files => {
      try {
        loading.value = true;
        await importBcf(currentProject.value, files[0]);
      } finally {
        loading.value = false;
      }
    };

    const saveAs = async (response, fileName) => {
      const content = await response.arrayBuffer();
      const blob = new Blob([content], { type: "application/octet-stream" });

      const URL = window.URL;
      const a = document.createElement("a");
      a.download = fileName;
      a.rel = "noopener";
      a.href = URL.createObjectURL(blob);
      setTimeout(function () {
        URL.revokeObjectURL(a.href);
      }, 4e4);
      setTimeout(function () {
        a.click();
      }, 0);
    };

    const exportBcfTopics = async () => {
      const response = await exportBcf(currentProject.value);
      const fileName = decodeURI(
        response.headers.get("Content-Disposition")
      ).match("[^']*$");
      if (fileName) {
        fileName[0];
      }
      if (response.ok) {
        await saveAs(response, fileName);
      } else {
        console.log("erreur");
      }
    };

    const {
      isOpen: showBcfSettings,
      close: closeBcfSettings,
      open: openBcfSettings
    } = useToggle();

    return {
      loading,
      bcfTopics,
      project: currentProject,
      displayedBcfTopics,
      detailedExtensions,
      onFiltersSubmit,
      searchText,
      sortByName,
      sortByIndex,
      sortByDate,
      activeButton,
      isSortByNameActive,
      isSortByIndexActive,
      isSortByDateActive,
      openBcfSettings,
      closeBcfSettings,
      showBcfSettings,
      toggleDisplayBcfTopics,
      isDisplayByListActive,
      openCreateBcfTopic: openSidePanel,
      uploadFiles,
      exportBcfTopics
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBcf.scss"></style>
