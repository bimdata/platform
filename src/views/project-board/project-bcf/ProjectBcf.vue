<template>
  <div class="project-bcf">
    <AppSlotContent name="project-board-action">
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
        color="default"
        multiple
        :accept="['.bcf']"
        @upload="importBcfTopics"
      >
        <BIMDataIcon name="import" size="xs" margin="0 6px 0 0" />
        {{ $t("ProjectBcf.importButtonText") }}
      </FileUploadButton>
      <BIMDataButton
        class="m-r-12"
        color="default"
        fill
        radius
        @click="exportBcfTopics"
      >
        <BIMDataIcon name="export" size="xs" margin="0 6px 0 0" />
        {{ $t("ProjectBcf.exportButtonText") }}
      </BIMDataButton>
      <BIMDataButton
        width="130px"
        color="primary"
        fill
        radius
        @click="openBcfTopicCreate"
      >
        <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
        <span>{{ $t("ProjectBcf.createBcfButtonText") }}</span>
      </BIMDataButton>
    </AppSlotContent>

    <AppSidePanel
      :title="showBcfTopicCreate ? $t('ProjectBcf.createBcfTitle') : ''"
    >
      <template v-if="showBcfTopicCreate">
        <BcfTopicCreate
          :project="project"
          :bcfTopics="bcfTopics"
          :extensions="extensions"
          :detailedExtensions="detailedExtensions"
        />
      </template>
      <template v-else-if="showBcfTopicOverview && currentBcfTopic">
        <BcfTopicOverview
          :project="project"
          :models="models"
          :users="users"
          :bcfTopic="currentBcfTopic"
          :detailedExtensions="detailedExtensions"
          @view-bcf-topic="openBcfTopicViewer(currentBcfTopic)"
        />
      </template>
    </AppSidePanel>

    <div class="project-bcf__settings" v-show="showBcfSettings">
      <BcfSettings
        :project="project"
        :detailedExtensions="detailedExtensions"
        @close="closeBcfSettings"
      />
    </div>

    <div class="project-bcf__actions flex justify-between m-t-24">
      <BIMDataSearch
        width="38%"
        :placeholder="$t('ProjectBcf.searchInputPlaceholder')"
        color="secondary"
        radius
        v-model="searchText"
      />
      <div class="flex">
        <BIMDataTooltip
          :message="
            isSortByIndexActive
              ? $t('ProjectBcf.ascendingIndexTooltip')
              : $t('ProjectBcf.descendingIndexTooltip')
          "
        >
          <BIMDataButton
            class="m-r-12"
            :class="{ active: activeButton === 'indexSort' }"
            :disabled="!bcfTopics.length"
            color="default"
            fill
            square
            icon
            @click="sortByIndex"
          >
            <IndexAscending
              v-if="isSortByIndexActive"
              style="heiht: 18px; width: 18px"
            />
            <IndexDescending v-else style="heiht: 18px; width: 18px" />
          </BIMDataButton>
        </BIMDataTooltip>

        <BIMDataTooltip
          :message="
            isSortByNameActive
              ? $t('ProjectBcf.alphabeticalAscendingOrderTooltip')
              : $t('ProjectBcf.alphabeticalDescendingOrderTooltip')
          "
        >
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
        </BIMDataTooltip>
        <BIMDataTooltip
          ref="dateTooltip"
          class="m-r-12"
          :message="
            isSortByDateActive
              ? $t('ProjectBcf.ascendingDateTooltip')
              : $t('ProjectBcf.descendingDateTooltip')
          "
        >
          <BIMDataButton
            :class="{ active: activeButton === 'dateSort' }"
            :disabled="!bcfTopics.length"
            color="default"
            fill
            square
            icon
            @click="sortByDate"
          >
            <DateAscending
              v-if="isSortByDateActive"
              style="heiht: 18px; width: 18px"
            />
            <DateDescending v-else style="heiht: 18px; width: 18px" />
          </BIMDataButton>
        </BIMDataTooltip>

        <BcfFilters :bcfTopics="bcfTopics" @submit="onFiltersSubmit" />
      </div>
    </div>
    <div class="project-bcf__content flex m-t-36">
      <BIMDataCard class="project-bcf__content__metrics" titleHeader="Stats">
        <template #content>
          <BcfStatistics
            v-if="detailedExtensions"
            :bcfTopics="displayedBcfTopics"
            :priorities="detailedExtensions.priorities"
            :loading="loading"
          />
        </template>
      </BIMDataCard>

      <div
        v-if="loading"
        class="project-bcf__content__empty flex items-center justify-center"
      >
        <BIMDataSpinner />
      </div>

      <BcfTopicCreationCard v-else-if="displayedBcfTopics.length === 0" />

      <!--
      <transition-group v-else-if="isDisplayByListActive" name="list">
        <BcfTopicsTable
          class="project-bcf__content__list"
          :bcfTopics="displayedBcfTopics"
        />
      </transition-group>
      -->

      <transition-group v-else name="grid">
        <BcfTopicCard
          v-for="topic in displayedBcfTopics"
          :key="topic.guid"
          :project="project"
          :bcfTopic="topic"
          :detailedExtensions="detailedExtensions"
          @open-bcf-topic="openBcfTopicOverview(topic)"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppSidePanel } from "@/components/specific/app/app-side-panel/app-side-panel.js";
import useFilter from "./composables/filter.js";
import useSearch from "./composables/search.js";
import useSort from "./composables/sort.js";
import { useToggle } from "@/composables/toggle";
import { MODEL_STATUS, MODEL_TYPE } from "@/config/models.js";
import routeNames from "@/router/route-names.js";
import { useBcf } from "@/state/bcf.js";
import { useProjects } from "@/state/projects.js";
import { useModels } from "@/state/models.js";
// Components
import {
  BcfFilters,
  BcfSettings,
  BcfStatistics,
  BcfTopicCard,
  BcfTopicCreate,
  BcfTopicCreationCard,
  BcfTopicOverview
} from "@bimdata/bcf-components";
import AppSlotContent from "@/components/specific/app/app-slot/AppSlotContent.vue";
import AppSidePanel from "@/components/specific/app/app-side-panel/AppSidePanel.vue";
import FileUploadButton from "@/components/specific/files/file-upload-button/FileUploadButton";

export default {
  components: {
    AppSlotContent,
    AppSidePanel,
    BcfFilters,
    BcfSettings,
    BcfStatistics,
    BcfTopicCard,
    BcfTopicCreate,
    BcfTopicCreationCard,
    BcfTopicOverview,
    FileUploadButton
  },
  setup() {
    const router = useRouter();
    const { currentProject, projectUsers } = useProjects();
    const { projectModels } = useModels();
    const {
      bcfTopics,
      extensions,
      detailedExtensions,
      loadBcfTopics,
      loadExtensions,
      loadDetailedExtensions,
      importBcf,
      exportBcf
    } = useBcf();

    const loading = ref(false);

    watch(
      currentProject,
      async project => {
        try {
          loading.value = true;
          await loadBcfTopics(project);
          await loadExtensions(project);
          await loadDetailedExtensions(project);
        } finally {
          loading.value = false;
        }
      },
      { immediate: true }
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

    const importBcfTopics = async files => {
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

    const currentBcfTopic = ref(null);
    const showBcfTopicCreate = ref(false);
    const showBcfTopicOverview = ref(false);
    const { openSidePanel } = useAppSidePanel();

    const openBcfTopicOverview = topic => {
      showBcfTopicCreate.value = false;
      showBcfTopicOverview.value = true;
      currentBcfTopic.value = topic;
      openSidePanel();
    };

    const openBcfTopicCreate = () => {
      showBcfTopicOverview.value = false;
      currentBcfTopic.value = null;
      showBcfTopicCreate.value = true;
      openSidePanel();
    };

    const openBcfTopicViewer = topic => {
      let modelIDs = [];
      if (topic.ifcs?.length) {
        modelIDs = topic.ifcs;
      } else {
        const ifcs = projectModels.value
          .filter(model => model.type === MODEL_TYPE.IFC)
          .filter(model => model.status === MODEL_STATUS.COMPLETED)
          .sort((a, b) =>
            a.createdAt.getTime() > b.createdAt.getTime() ? 1 : -1
          );
        if (ifcs.length > 0) {
          modelIDs.push(ifcs[0].id);
        }
      }
      router.push({
        name: routeNames.modelViewer,
        params: {
          spaceID: currentProject.cloud.id,
          projectID: currentProject.id,
          modelIDs: modelIDs.join(",")
        },
        query: {
          topicGuid: topic.guid
        }
      });
    };

    const {
      isOpen: showBcfSettings,
      close: closeBcfSettings,
      open: openBcfSettings
    } = useToggle();

    const isDisplayByListActive = ref(false);
    const toggleDisplayBcfTopics = () => {
      isDisplayByListActive.value = !isDisplayByListActive.value;
    };

    return {
      // References
      activeButton,
      bcfTopics,
      currentBcfTopic,
      detailedExtensions,
      displayedBcfTopics,
      extensions,
      isDisplayByListActive,
      isSortByDateActive,
      isSortByIndexActive,
      isSortByNameActive,
      loading,
      models: projectModels,
      project: currentProject,
      searchText,
      users: projectUsers,
      showBcfSettings,
      showBcfTopicCreate,
      showBcfTopicOverview,
      // Methods
      closeBcfSettings,
      exportBcfTopics,
      importBcfTopics,
      onFiltersSubmit,
      openBcfSettings,
      openBcfTopicCreate,
      openBcfTopicOverview,
      openBcfTopicViewer,
      sortByDate,
      sortByIndex,
      sortByName,
      toggleDisplayBcfTopics
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBcf.scss"></style>
