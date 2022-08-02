<template>
  <div class="project-bcf">
    <AppSlotContent name="project-board-action">
      <BIMDataButton color="primary" outline radius icon @click="openSettings">
        <BIMDataIcon name="settings" size="xxs" />
      </BIMDataButton>
      <FileUploadButton
        color="default"
        multiple
        :accept="['.bcf']"
        @upload="importBcfTopics"
      >
        <BIMDataIcon name="import" size="xs" />
        <span v-if="!isXL" style="margin-left: 6px">
          {{ $t("ProjectBcf.importButtonText") }}
        </span>
      </FileUploadButton>
      <BIMDataButton fill radius :icon="isXL" @click="exportBcfTopics">
        <BIMDataIcon name="export" size="xs" />
        <span v-if="!isXL" style="margin-left: 6px">
          {{ $t("ProjectBcf.exportButtonText") }}
        </span>
      </BIMDataButton>
      <BIMDataButton
        color="primary"
        fill
        radius
        :icon="isXL"
        @click="openBcfTopicCreate"
      >
        <BIMDataIcon name="plus" size="xxxs" />
        <span v-if="!isXL" style="margin-left: 6px">
          {{ $t("ProjectBcf.createBcfButtonText") }}
        </span>
      </BIMDataButton>
    </AppSlotContent>

    <div class="project-bcf__settings" v-show="showSettings">
      <BcfSettings
        :project="project"
        :detailedExtensions="detailedExtensions"
        @extension-created="reloadExtensions"
        @extension-updated="reloadExtensions"
        @extension-deleted="reloadExtensions"
        @close="closeSettings"
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
          width="calc(100% - 32px - var(--spacing-unit))"
          color="secondary"
          radius
          :placeholder="$t('ProjectBcf.searchInputPlaceholder')"
          v-model="searchText"
        />
      </div>
      <div class="project-bcf__actions--end">
        <BIMDataTooltip
          :disabled="bcfTopics.length === 0"
          :message="
            sortOrderIndex === 'asc'
              ? $t('ProjectBcf.ascendingIndexTooltip')
              : $t('ProjectBcf.descendingIndexTooltip')
          "
        >
          <BIMDataButton
            :disabled="bcfTopics.length === 0"
            :class="{ active: sortedBy === 'index' }"
            fill
            square
            icon
            @click="sortByIndex"
          >
            <BIMDataIcon
              :name="
                sortOrderIndex === 'asc' ? 'indexAscending' : 'indexDescending'
              "
              size="s"
            />
          </BIMDataButton>
        </BIMDataTooltip>

        <BIMDataTooltip
          :disabled="bcfTopics.length === 0"
          :message="
            sortOrderTitle === 'asc'
              ? $t('ProjectBcf.alphabeticalAscendingOrderTooltip')
              : $t('ProjectBcf.alphabeticalDescendingOrderTooltip')
          "
        >
          <BIMDataButton
            :disabled="bcfTopics.length === 0"
            :class="{ active: sortedBy === 'title' }"
            fill
            square
            icon
            @click="sortByTitle"
          >
            <BIMDataIcon
              :name="
                sortOrderTitle === 'asc'
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
            sortOrderDate === 'asc'
              ? $t('ProjectBcf.ascendingDateTooltip')
              : $t('ProjectBcf.descendingDateTooltip')
          "
        >
          <BIMDataButton
            :disabled="bcfTopics.length === 0"
            :class="{ active: sortedBy === 'date' }"
            fill
            square
            icon
            @click="sortByDate"
          >
            <BIMDataIcon
              :name="
                sortOrderDate === 'asc' ? 'dateAscending' : 'dateDescending'
              "
              size="s"
            />
          </BIMDataButton>
        </BIMDataTooltip>
        <BIMDataTooltip
          :disabled="bcfTopics.length === 0"
          :message="
            isListView
              ? $t('ProjectBcf.viewGridTooltip')
              : $t('ProjectBcf.viewListTooltip')
          "
        >
          <BIMDataButton
            :disabled="bcfTopics.length === 0"
            fill
            square
            icon
            @click="isListView = !isListView"
          >
            <BIMDataIcon :name="isListView ? 'grid' : 'list'" size="s" />
          </BIMDataButton>
        </BIMDataTooltip>
        <BcfFilters
          :bcfTopics="bcfTopics"
          @submit="applyFilters($event.filters)"
        />
      </div>
    </div>

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
            {{ $t("ProjectBcf.goBackButton") }}
          </BIMDataButton>
          <span class="text-center" style="width: 250px">
            <BIMDataTextbox :text="currentBcfTopic.title" />
          </span>
        </div>
      </template>

      <transition name="fade" mode="out-in">
        <template v-if="showBcfTopicCreate || showBcfTopicForm">
          <BcfTopicForm
            :project="project"
            :extensions="extensions"
            :bcfTopics="bcfTopics"
            :bcfTopic="currentBcfTopic"
            @bcf-topic-updated="reloadBcfTopics"
            @bcf-topic-created="reloadBcfTopics(), closeSidePanel()"
          />
        </template>
        <template v-else-if="showBcfTopicOverview && currentBcfTopic">
          <BcfTopicOverview
            :uiConfig="{ closeButton: true }"
            :project="project"
            :bcfTopic="currentBcfTopic"
            :detailedExtensions="detailedExtensions"
            @edit-bcf-topic="openBcfTopicForm(currentBcfTopic)"
            @view-bcf-topic="openBcfTopicViewer(currentBcfTopic)"
            @bcf-topic-deleted="reloadBcfTopics"
            @comment-created="reloadComments(currentBcfTopic)"
            @comment-updated="reloadComments(currentBcfTopic)"
            @comment-deleted="reloadComments(currentBcfTopic)"
            @close="closeSidePanel"
          />
        </template>
      </transition>
    </AppSidePanel>

    <div class="project-bcf__content">
      <transition name="fade">
        <div v-show="!showMetrics" class="project-bcf__content__stats">
          <div class="project-bcf__content__stats__title">
            {{ $t("ProjectBcf.metricsTitle", { count: bcfTopics.length }) }}
          </div>
          <template v-if="bcfTopics.length && displayedBcfTopics.length === 0">
            <BcfStatisticsEmptyImage class="no-stats" />
          </template>
          <template v-else-if="bcfTopics.length > 0">
            <BcfStatistics
              :bcfTopics="displayedBcfTopics"
              extensionType="Status"
              :availableExtensions="detailedExtensions.topic_statuses"
            />
            <BcfStatistics
              :bcfTopics="displayedBcfTopics"
              extensionType="Priority"
              :availableExtensions="detailedExtensions.priorities"
            />
          </template>
          <template v-else>
            <BcfStatisticsEmptyImage />
            <p>{{ $t("ProjectBcf.metricsEmptyText") }}</p>
          </template>
        </div>
      </transition>

      <transition name="fade" mode="out-in">
        <div v-if="loading" class="project-bcf__content__loader">
          <BIMDataSpinner />
        </div>

        <div v-else-if="isListView" class="project-bcf__content__list">
          <BcfTopicsTable
            :columns="isXL ? ['index', 'title', 'actions'] : undefined"
            :paginated="true"
            :perPage="14"
            :detailedExtensions="detailedExtensions"
            :bcfTopics="displayedBcfTopics"
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
            <div
              v-else-if="bcfTopics.length && displayedBcfTopics.length === 0"
              class="flex items-center"
            >
              <BIMDataCard class="no-search-results text-center p-30">
                <template #content>
                  <NoSearchResultsImage />
                  <h3>{{ $t("ProjectBcf.noSearchResultsTitle") }}</h3>
                  <p>{{ $t("ProjectBcf.noSearchResultsText") }}</p>
                </template>
              </BIMDataCard>
            </div>
            <BcfTopicCard
              v-for="topic in displayedBcfTopics"
              :key="topic.guid"
              :detailedExtensions="detailedExtensions"
              :bcfTopic="topic"
              @open-bcf-topic="openBcfTopicOverview(topic)"
            />
          </transition-group>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import {
  getViewpointConfig,
  getViewpointModels,
  useBcfFilter,
  useBcfSearch,
  useBcfSort
} from "@bimdata/bcf-components";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppSidePanel } from "../../../components/specific/app/app-side-panel/app-side-panel.js";
import { useStandardBreakpoints } from "../../../composables/responsive.js";
import { useToggle } from "../../../composables/toggle.js";
import { MODEL_STATUS } from "../../../config/models.js";
import { DEFAULT_WINDOW, WINDOW_MODELS } from "../../../config/viewer.js";
import routeNames from "../../../router/route-names.js";
import { useBcf } from "../../../state/bcf.js";
import { useProjects } from "../../../state/projects.js";
import { useModels } from "../../../state/models.js";
// Components
import BcfStatisticsEmptyImage from "../../../components/images/BcfStatisticsEmptyImage.vue";
import NoSearchResultsImage from "../../../components/images/NoSearchResultsImage.vue";
import AppSlotContent from "../../../components/specific/app/app-slot/AppSlotContent.vue";
import AppSidePanel from "../../../components/specific/app/app-side-panel/AppSidePanel.vue";
import FileUploadButton from "../../../components/specific/files/file-upload-button/FileUploadButton.vue";

export default {
  components: {
    AppSlotContent,
    AppSidePanel,
    BcfStatisticsEmptyImage,
    NoSearchResultsImage,
    FileUploadButton
  },
  setup() {
    const router = useRouter();
    const { currentProject } = useProjects();
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
    const isListView = ref(false);
    const currentBcfTopic = ref(null);

    const reloadExtensions = async () => {
      await Promise.all([
        loadExtensions(currentProject.value),
        loadDetailedExtensions(currentProject.value)
      ]);
    };

    const reloadBcfTopics = async () => {
      await loadBcfTopics(currentProject.value);
    };

    const reloadComments = async topic => {
      await loadBcfTopicComments(currentProject.value, topic);
    };

    watch(
      currentProject,
      async () => {
        try {
          loading.value = true;
          currentBcfTopic.value = null;
          await reloadExtensions();
          await reloadBcfTopics();
        } finally {
          loading.value = false;
        }
      },
      { immediate: true }
    );

    watch(
      bcfTopics,
      topics => {
        if (currentBcfTopic.value) {
          currentBcfTopic.value = topics.find(
            t => t.guid === currentBcfTopic.value.guid
          );
        }
      },
      { immediate: true }
    );

    const { filteredTopics, apply: applyFilters } = useBcfFilter(bcfTopics);
    const { searchText, filteredTopics: displayedBcfTopics } =
      useBcfSearch(filteredTopics);
    const {
      sortedBy,
      sortByTitle,
      sortByIndex,
      sortByDate,
      sortOrderIndex,
      sortOrderTitle,
      sortOrderDate
    } = useBcfSort(displayedBcfTopics);

    const {
      isOpen: showMetrics,
      close: closeMetrics,
      toggle: toggleMetrics
    } = useToggle();

    const {
      isOpen: showSettings,
      close: closeSettings,
      open: openSettings
    } = useToggle();

    const importBcfTopics = async files => {
      try {
        loading.value = true;
        await importBcf(currentProject.value, files[0]);
      } finally {
        loading.value = false;
      }
    };

    const exportBcfTopics = async () => {
      await exportBcf(currentProject.value);
    };

    const { openSidePanel, closeSidePanel } = useAppSidePanel();
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
      let viewpoint = topic.viewpoints[0] ?? {};
      let window = getViewpointConfig(viewpoint)?.window ?? DEFAULT_WINDOW;
      let modelIDs = getViewpointModels(viewpoint);

      if (modelIDs.length === 0) {
        // If no models are specified on the viewpoint
        // get the last created model of proper type
        // with respect to the target window
        const models = projectModels.value
          .filter(
            m =>
              m.status === MODEL_STATUS.COMPLETED &&
              WINDOW_MODELS[window].includes(m.type)
          )
          .sort((a, b) => (a.created_at > b.created_at ? 1 : -1));
        if (models.length > 0) {
          modelIDs.push(models[0].id);
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
          window,
          topicGuid: topic.guid
        }
      });
    };

    return {
      // References
      bcfTopics,
      currentBcfTopic,
      detailedExtensions,
      displayedBcfTopics,
      extensions,
      isListView,
      loading,
      models: projectModels,
      project: currentProject,
      searchText,
      showBcfTopicCreate,
      showBcfTopicForm,
      showBcfTopicOverview,
      showMetrics,
      showSettings,
      sortedBy,
      sortOrderDate,
      sortOrderIndex,
      sortOrderTitle,
      // Methods
      applyFilters,
      closeMetrics,
      closeSidePanel,
      closeSettings,
      exportBcfTopics,
      importBcfTopics,
      openBcfTopicCreate,
      openBcfTopicForm,
      openBcfTopicOverview,
      openBcfTopicViewer,
      openSettings,
      reloadBcfTopics,
      reloadComments,
      reloadExtensions,
      sortByDate,
      sortByIndex,
      sortByTitle,
      toggleMetrics,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBcf.scss"></style>
