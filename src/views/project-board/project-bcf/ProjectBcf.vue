<template>
  <div class="project-bcf">
    <AppSlotContent name="project-board-action">
      <BIMDataButton color="primary" outline radius icon @click="openSettings">
        <BIMDataIcon name="settings" size="xxs" />
      </BIMDataButton>
      <BIMDataButton
        fill
        radius
        :icon="isXL"
        color="default"
        @click="
          fileUploadInput(
            'file',
            event => importBcfTopics(event.target.files),
            { accept: ['.bcf'], multiple: true }
          )
        "
      >
        <BIMDataIcon name="import" size="xs" />
        <span v-if="!isXL" style="margin-left: 6px">
          {{ $t("ProjectBcf.importButtonText") }}
        </span>
      </BIMDataButton>
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
        @click="openTopicCreate"
      >
        <BIMDataIcon name="plus" size="xxxs" />
        <span v-if="!isXL" style="margin-left: 6px">
          {{ $t("ProjectBcf.createBcfButtonText") }}
        </span>
      </BIMDataButton>
    </AppSlotContent>

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
          :disabled="topics.length === 0"
          :message="
            sortOrderIndex === 'asc'
              ? $t('ProjectBcf.ascendingIndexTooltip')
              : $t('ProjectBcf.descendingIndexTooltip')
          "
        >
          <BIMDataButton
            :disabled="topics.length === 0"
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
          :disabled="topics.length === 0"
          :message="
            sortOrderTitle === 'asc'
              ? $t('ProjectBcf.alphabeticalAscendingOrderTooltip')
              : $t('ProjectBcf.alphabeticalDescendingOrderTooltip')
          "
        >
          <BIMDataButton
            :disabled="topics.length === 0"
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
          :disabled="topics.length === 0"
          :message="
            sortOrderDate === 'asc'
              ? $t('ProjectBcf.ascendingDateTooltip')
              : $t('ProjectBcf.descendingDateTooltip')
          "
        >
          <BIMDataButton
            :disabled="topics.length === 0"
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
          :disabled="topics.length === 0"
          :message="
            isListView
              ? $t('ProjectBcf.viewGridTooltip')
              : $t('ProjectBcf.viewListTooltip')
          "
        >
          <BIMDataButton
            :disabled="topics.length === 0"
            fill
            square
            icon
            @click="isListView = !isListView"
          >
            <BIMDataIcon :name="isListView ? 'grid' : 'list'" size="s" />
          </BIMDataButton>
        </BIMDataTooltip>
        <BcfFilters :topics="topics" @submit="applyFilters($event.filters)" />
      </div>
    </div>

    <AppSidePanel :header="false">
      <transition name="fade" mode="out-in">
        <template v-if="showSettings">
          <BcfSettings
            :uiConfig="{
              closeButton: true
            }"
            :project="project"
            :detailedExtensions="detailedExtensions"
            @extension-created="reloadExtensions"
            @extension-updated="reloadExtensions"
            @extension-deleted="reloadExtensions"
            @close="closeSidePanel"
          />
        </template>
        <template v-else-if="showTopicOverview">
          <BcfTopicOverview
            :uiConfig="{
              closeButton: true,
              editButton: true,
              deleteButton: true
            }"
            :project="project"
            :detailedExtensions="detailedExtensions"
            :topic="selectedTopic"
            @edit-topic="openTopicUpdate(selectedTopic)"
            @view-topic="openTopicViewer(selectedTopic)"
            @view-topic-viewpoint="topicViewpoint"
            @topic-deleted="reloadBcfTopics(), closeSidePanel()"
            @comment-created="reloadComments(selectedTopic)"
            @comment-updated="reloadComments(selectedTopic)"
            @comment-deleted="reloadComments(selectedTopic)"
            @close="closeSidePanel"
          />
        </template>
        <template v-else-if="showTopicCreate || showTopicUpdate">
          <BcfTopicForm
            :uiConfig="{
              backButton: !showTopicCreate,
              closeButton: true
            }"
            :project="project"
            :extensions="extensions"
            :topics="topics"
            :topic="selectedTopic"
            @topic-updated="reloadBcfTopics"
            @topic-created="reloadBcfTopics(), closeSidePanel()"
            @back="openTopicOverview(selectedTopic)"
            @close="closeSidePanel"
          />
        </template>
      </transition>
    </AppSidePanel>

    <div class="project-bcf__content">
      <transition name="fade">
        <div v-show="!showMetrics" class="project-bcf__content__stats">
          <div class="project-bcf__content__stats__title">
            {{ $t("ProjectBcf.metricsTitle", { count: topics.length }) }}
          </div>
          <template v-if="topics.length && displayedTopics.length === 0">
            <BcfStatisticsEmptyImage class="no-stats" />
          </template>
          <template v-else-if="topics.length > 0">
            <BcfStatistics
              :detailedExtensions="detailedExtensions"
              extensionType="Status"
              :topics="displayedTopics"
            />
            <BcfStatistics
              :detailedExtensions="detailedExtensions"
              extensionType="Priority"
              :topics="displayedTopics"
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
            :topics="displayedTopics"
            @open-topic="openTopicOverview($event)"
          />
        </div>

        <div v-else class="project-bcf__content__grid">
          <transition-group name="grid">
            <BcfTopicCreationCard
              v-if="topics.length === 0"
              :key="-1"
              @create-topic="openTopicCreate"
            />
            <BcfTopicCard
              v-for="topic in displayedTopics"
              :key="topic.guid"
              :detailedExtensions="detailedExtensions"
              :topic="topic"
              @open-topic="openTopicOverview(topic)"
            />

            <div
              v-if="topics.length > 0 && displayedTopics.length === 0"
              class="project-bcf__content__grid__placeholder"
            >
              <BIMDataCard>
                <template #content>
                  <NoSearchResultsImage />
                  <h3>{{ $t("ProjectBcf.noSearchResultsTitle") }}</h3>
                  <p>{{ $t("ProjectBcf.noSearchResultsText") }}</p>
                </template>
              </BIMDataCard>
            </div>
          </transition-group>
        </div>
      </transition>
    </div>
    <AppModal bgColor="transparent" iconColor="white" :isModalLarge="true">
      <SnapshotModal :topicSnapshot="topicSnapshot" />
    </AppModal>
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
import { onActivated, onDeactivated, ref, watch } from "vue";
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
import { fileUploadInput } from "../../../utils/upload.js";
import { useAppModal } from "../../../components/specific/app/app-modal/app-modal.js";

// Components
import BcfStatisticsEmptyImage from "../../../components/images/BcfStatisticsEmptyImage.vue";
import NoSearchResultsImage from "../../../components/images/NoSearchResultsImage.vue";
import AppSlotContent from "../../../components/specific/app/app-slot/AppSlotContent.vue";
import AppSidePanel from "../../../components/specific/app/app-side-panel/AppSidePanel.vue";
import AppModal from "../../../components/specific/app/app-modal/AppModal.vue";
import SnapshotModal from "../snapshot-modal/SnapshotModal.vue";

export default {
  components: {
    AppSlotContent,
    AppSidePanel,
    BcfStatisticsEmptyImage,
    NoSearchResultsImage,
    AppModal,
    SnapshotModal
  },
  setup() {
    const router = useRouter();
    const { currentProject } = useProjects();
    const { projectModels } = useModels();
    const {
      topics,
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
    const selectedTopic = ref(null);

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
          selectedTopic.value = null;
          await reloadExtensions();
          await reloadBcfTopics();
        } finally {
          loading.value = false;
        }
      },
      { immediate: true }
    );

    watch(
      topics,
      () => {
        if (selectedTopic.value) {
          selectedTopic.value = topics.value.find(
            t => t.guid === selectedTopic.value.guid
          );
        }
      },
      { immediate: true }
    );

    onActivated(() => {
      selectedTopic.value = null;
    });
    onDeactivated(() => {
      selectedTopic.value = null;
      closeSidePanel();
    });

    const { filteredTopics, apply: applyFilters } = useBcfFilter(topics);
    const { searchText, filteredTopics: displayedTopics } =
      useBcfSearch(filteredTopics);
    const {
      sortedBy,
      sortByTitle,
      sortByIndex,
      sortByDate,
      sortOrderIndex,
      sortOrderTitle,
      sortOrderDate
    } = useBcfSort(displayedTopics);

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
    const showSettings = ref(false);
    const showTopicOverview = ref(false);
    const showTopicCreate = ref(false);
    const showTopicUpdate = ref(false);

    const {
      isOpen: showMetrics,
      close: closeMetrics,
      toggle: toggleMetrics
    } = useToggle();

    const openSettings = () => {
      showSettings.value = true;
      showTopicOverview.value = false;
      showTopicCreate.value = false;
      showTopicUpdate.value = false;
      openSidePanel();
    };

    const openTopicOverview = topic => {
      selectedTopic.value = topic;
      showSettings.value = false;
      showTopicOverview.value = true;
      showTopicCreate.value = false;
      showTopicUpdate.value = false;
      loadBcfTopicComments(currentProject.value, topic);
      openSidePanel();
    };

    const openTopicCreate = () => {
      selectedTopic.value = null;
      showSettings.value = false;
      showTopicOverview.value = false;
      showTopicCreate.value = true;
      showTopicUpdate.value = false;
      openSidePanel();
    };

    const openTopicUpdate = topic => {
      selectedTopic.value = topic;
      showSettings.value = false;
      showTopicOverview.value = false;
      showTopicCreate.value = false;
      showTopicUpdate.value = true;
      openSidePanel();
    };

    const { openModal } = useAppModal();
    const topicSnapshot = ref();
    const topicViewpoint = topic => {
      openModal();
      topicSnapshot.value = topic.snapshot.snapshot_data;
    };

    const openTopicViewer = topic => {
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
      topicSnapshot,
      detailedExtensions,
      displayedTopics,
      extensions,
      isListView,
      loading,
      models: projectModels,
      project: currentProject,
      searchText,
      selectedTopic,
      showMetrics,
      showSettings,
      showTopicCreate,
      showTopicUpdate,
      showTopicOverview,
      sortedBy,
      sortOrderDate,
      sortOrderIndex,
      sortOrderTitle,
      topics,
      topicViewpoint,
      // Methods
      applyFilters,
      closeMetrics,
      closeSidePanel,
      exportBcfTopics,
      importBcfTopics,
      openSettings,
      openTopicCreate,
      openTopicUpdate,
      openTopicOverview,
      openTopicViewer,
      reloadBcfTopics,
      reloadComments,
      reloadExtensions,
      sortByDate,
      sortByIndex,
      sortByTitle,
      toggleMetrics,
      fileUploadInput,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBcf.scss"></style>
