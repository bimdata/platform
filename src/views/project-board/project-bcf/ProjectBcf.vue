<template>
  <div class="project-bcf">
    <AppSlotContent name="project-board-action">
      <BIMDataButton
        class="m-r-12"
        color="primary"
        outline
        radius
        icon
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
      :header="!showBcfTopicOverview"
      :title="
        showBcfTopicCreate
          ? $t('ProjectBcf.createBcfTitle')
          : showBcfTopicForm
          ? currentBcfTopic.title
          : ''
      "
    >
      <template #title v-if="showBcfTopicForm && currentBcfTopic">
        <div class="flex items-center">
          <BIMDataButton
            ghost
            radius
            @click="openBcfTopicOverview(currentBcfTopic)"
          >
            <BIMDataIcon
              name="arrow"
              size="xxs"
              fill
              color="granite-light"
              margin="0 6px 0 0"
            />
            {{ $t("EditBcfTopic.goBackButton") }}
          </BIMDataButton>
          <span class="text-center" style="width: calc(100% - 70px)">
            <BIMDataTextbox :text="currentBcfTopic.title" />
          </span>
        </div>
      </template>

      <transition name="fade" mode="out-in">
        <template v-if="showBcfTopicCreate">
          <BcfTopicCreate
            :project="project"
            :bcfTopics="bcfTopics"
            :extensions="extensions"
            @bcf-topic-created="reloadBcfTopics"
          />
        </template>
        <template v-else-if="showBcfTopicOverview && currentBcfTopic">
          <BcfTopicOverview
            :project="project"
            :models="models"
            :users="users"
            :bcfTopic="currentBcfTopic"
            :detailedExtensions="detailedExtensions"
            @edit-bcf-topic="openBcfTopicForm(currentBcfTopic)"
            @view-bcf-topic="openBcfTopicViewer(currentBcfTopic)"
            @bcf-topic-deleted="reloadBcfTopics"
            @comment-created="loadBcfTopicComments(project, currentBcfTopic)"
            @comment-updated="loadBcfTopicComments(project, currentBcfTopic)"
            @comment-deleted="loadBcfTopicComments(project, currentBcfTopic)"
            @close="closeSidePanel"
          />
        </template>
        <template v-else-if="showBcfTopicForm && currentBcfTopic">
          <BcfTopicForm
            :project="project"
            :bcfTopic="currentBcfTopic"
            :extensions="extensions"
            @bcf-topic-updated="reloadBcfTopics"
          />
        </template>
      </transition>
    </AppSidePanel>

    <div class="project-bcf__settings" v-show="showBcfSettings">
      <BcfSettings
        :project="project"
        :detailedExtensions="detailedExtensions"
        @extension-created="reloadExtensions"
        @extension-updated="reloadExtensions"
        @extension-deleted="reloadExtensions"
        @close="closeBcfSettings"
      />
    </div>

    <div class="project-bcf__actions">
      <div class="project-bcf__actions--start">
        <BIMDataTooltip
          maxWidth="100px"
          :message="
            showMetrics
              ? $t('ProjectBcf.showStatisticsTooltip')
              : $t('ProjectBcf.hideStatisticsTooltip')
          "
        >
          <BIMDataButton
            :class="{ active: !showMetrics }"
            color="default"
            fill
            square
            icon
            @click="toggleMetrics"
          >
            <PieGraphIcon
              :activeColor="
                !showMetrics ? 'var(--color-white)' : 'var(--color-secondary)'
              "
            />
          </BIMDataButton>
        </BIMDataTooltip>
        <BIMDataSearch
          width="calc(50% - 32px - var(--spacing-unit))"
          color="secondary"
          radius
          :placeholder="$t('ProjectBcf.searchInputPlaceholder')"
          v-model="searchText"
        >
        </BIMDataSearch>
      </div>
      <div class="project-bcf__actions--end">
        <BIMDataTooltip
          :disabled="bcfTopics.length === 0"
          :message="
            isSortByIndexActive
              ? $t('ProjectBcf.ascendingIndexTooltip')
              : $t('ProjectBcf.descendingIndexTooltip')
          "
        >
          <BIMDataButton
            :disabled="bcfTopics.length === 0"
            :class="{ active: activeButton === 'indexSort' }"
            color="default"
            fill
            square
            icon
            @click="sortByIndex"
          >
            <BIMDataIcon
              :name="isSortByIndexActive ? 'indexAscending' : 'indexDescending'"
              size="s"
            />
          </BIMDataButton>
        </BIMDataTooltip>

        <BIMDataTooltip
          :disabled="bcfTopics.length === 0"
          :message="
            isSortByNameActive
              ? $t('ProjectBcf.alphabeticalAscendingOrderTooltip')
              : $t('ProjectBcf.alphabeticalDescendingOrderTooltip')
          "
        >
          <BIMDataButton
            :disabled="bcfTopics.length === 0"
            :class="{ active: activeButton === 'nameSort' }"
            color="default"
            fill
            square
            icon
            @click="sortByName"
          >
            <BIMDataIcon
              :name="
                isSortByNameActive
                  ? 'alphabeticalAscending'
                  : 'alphabeticalDescending'
              "
              size="s"
            />
          </BIMDataButton>
        </BIMDataTooltip>
        <BIMDataTooltip
          :disabled="bcfTopics.length === 0"
          :message="
            isSortByDateActive
              ? $t('ProjectBcf.ascendingDateTooltip')
              : $t('ProjectBcf.descendingDateTooltip')
          "
        >
          <BIMDataButton
            :disabled="bcfTopics.length === 0"
            :class="{ active: activeButton === 'dateSort' }"
            color="default"
            fill
            square
            icon
            @click="sortByDate"
          >
            <BIMDataIcon
              :name="isSortByDateActive ? 'dateAscending' : 'dateDescending'"
              size="s"
            />
          </BIMDataButton>
        </BIMDataTooltip>
        <BIMDataTooltip
          :disabled="bcfTopics.length === 0"
          :message="
            isDisplayByListActive
              ? $t('ProjectBcf.viewGridTooltip')
              : $t('ProjectBcf.viewListTooltip')
          "
        >
          <BIMDataButton
            :disabled="bcfTopics.length === 0"
            color="default"
            fill
            square
            icon
            @click="toggleDisplayBcfTopics"
          >
            <BIMDataIcon
              :name="isDisplayByListActive ? 'grid' : 'list'"
              size="s"
            />
          </BIMDataButton>
        </BIMDataTooltip>
        <BcfFilters :bcfTopics="bcfTopics" @submit="onFiltersSubmit" />
      </div>
    </div>

    <div class="project-bcf__content">
      <transition name="fade">
        <div v-show="!showMetrics" class="project-bcf__content__stats">
          <div class="project-bcf__content__stats__title">
            Total : {{ bcfTopics.length }} issues BCF
          </div>
          <template v-if="bcfTopics.length > 0">
            <BcfStatistics
              :bcfTopics="displayedBcfTopics"
              extensionType="Status"
              :availableExtensions="detailedExtensions.topicStatuses"
            />
            <BcfStatistics
              :bcfTopics="displayedBcfTopics"
              extensionType="Priority"
              :availableExtensions="detailedExtensions.priorities"
            />
          </template>
          <template v-else>
            <BcfStatisticsEmptyImage />
            <p>{{ $t("BcfTopicsMetrics.emptyText") }}</p>
          </template>
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="loading" class="project-bcf__content__loader">
          <BIMDataSpinner />
        </div>

        <div
          v-else-if="isDisplayByListActive"
          class="project-bcf__content__list"
        >
          <BcfTopicsTable
            :bcfTopics="displayedBcfTopics"
            :detailedExtensions="detailedExtensions"
            @open-bcf-topic="openBcfTopicOverview($event)"
          />
        </div>

        <div v-else class="project-bcf__content__grid">
          <transition-group name="grid">
            <BcfTopicCreationCard
              v-if="bcfTopics.length === 0"
              :key="-1"
              @create-bcf-topic="openBcfTopicCreate"
            />
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
      </transition>
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
import BcfStatisticsEmptyImage from "@/components/images/BcfStatisticsEmptyImage.vue";
import AppSlotContent from "@/components/specific/app/app-slot/AppSlotContent.vue";
import AppSidePanel from "@/components/specific/app/app-side-panel/AppSidePanel.vue";
import FileUploadButton from "@/components/specific/files/file-upload-button/FileUploadButton.vue";

export default {
  components: {
    AppSlotContent,
    AppSidePanel,
    BcfStatisticsEmptyImage,
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
      loadBcfTopicComments,
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

    const { openSidePanel, closeSidePanel } = useAppSidePanel();
    const currentBcfTopic = ref(null);
    const showBcfTopicCreate = ref(false);
    const showBcfTopicOverview = ref(false);
    const showBcfTopicForm = ref(false);

    const openBcfTopicCreate = () => {
      currentBcfTopic.value = null;
      showBcfTopicCreate.value = true;
      showBcfTopicOverview.value = false;
      showBcfTopicForm.value = false;
      openSidePanel();
    };

    const openBcfTopicOverview = topic => {
      currentBcfTopic.value = topic;
      showBcfTopicCreate.value = false;
      showBcfTopicOverview.value = true;
      showBcfTopicForm.value = false;
      loadBcfTopicComments(currentProject.value, topic);
      openSidePanel();
    };

    const openBcfTopicForm = topic => {
      currentBcfTopic.value = topic;
      showBcfTopicCreate.value = false;
      showBcfTopicOverview.value = false;
      showBcfTopicForm.value = true;
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
          spaceID: currentProject.value.cloud.id,
          projectID: currentProject.value.id,
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

    const {
      isOpen: showMetrics,
      close: closeMetrics,
      toggle: toggleMetrics
    } = useToggle();

    const reloadBcfTopics = () => {
      loadBcfTopics(currentProject.value);
    };

    const reloadExtensions = () => {
      loadExtensions(currentProject.value);
      loadDetailedExtensions(currentProject.value);
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
      loadBcfTopicComments,
      loading,
      models: projectModels,
      project: currentProject,
      searchText,
      showBcfSettings,
      showBcfTopicCreate,
      showBcfTopicForm,
      showBcfTopicOverview,
      showMetrics,
      users: projectUsers,
      // Methods
      closeBcfSettings,
      closeMetrics,
      closeSidePanel,
      exportBcfTopics,
      importBcfTopics,
      onFiltersSubmit,
      openBcfSettings,
      openBcfTopicCreate,
      openBcfTopicForm,
      openBcfTopicOverview,
      openBcfTopicViewer,
      reloadBcfTopics,
      reloadExtensions,
      sortByDate,
      sortByIndex,
      sortByName,
      toggleDisplayBcfTopics,
      toggleMetrics
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBcf.scss"></style>
