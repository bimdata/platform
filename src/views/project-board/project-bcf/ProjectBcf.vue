<template>
  <div class="project-bcf">
    <template v-if="deleteMode">
      <teleport to="body">
        <template v-if="isLoadingDelete">
          <BIMDataLoading
            style="z-index: 100"
            :message="$t('ProjectBcf.deleteInProgress')"
            :subMessage="$t('ProjectBcf.deleteInProgressSub')"
          />
        </template>
        <template v-else>
          <BIMDataSafeZoneModal style="z-index: 100">
            <template #text>
              {{ $t("ProjectBcf.deleteBcfText") }}
            </template>
            <template #actions>
              <BIMDataButton
                color="high"
                fill
                radius
                class="m-r-12"
                @click="deleteBcfTopics"
              >
                {{ $t("t.confirm") }}
              </BIMDataButton>
              <BIMDataButton
                color="primary"
                outline
                radius
                @click="closeDeleteMode"
              >
                {{ $t("t.cancel") }}
              </BIMDataButton>
            </template>
          </BIMDataSafeZoneModal>
        </template>
      </teleport>
    </template>
    <AppSlotContent name="project-board-action">
      <template v-if="project.isAdmin">
        <BIMDataButton
          color="primary"
          outline
          radius
          icon
          @click="openSettings"
        >
          <BIMDataIconSettings size="xxs" />
        </BIMDataButton>
      </template>
      <template v-else>
        <BIMDataTooltip :message="$t('ProjectBcf.onlyAdminParameters')">
          <BIMDataButton disabled color="primary" outline radius icon>
            <BIMDataIconSettings size="xxs" />
          </BIMDataButton>
        </BIMDataTooltip>
      </template>
      <BIMDataButton
        fill
        radius
        :icon="isXL"
        color="default"
        width="120px"
        @click="
          fileUploadInput(
            'file',
            event => importBcfTopics(event.target.files),
            {
              accept: ['.bcf'],
              multiple: true
            }
          )
        "
      >
        <BIMDataIconImport size="xs" />
        <span v-if="!isXL" style="margin-left: 6px">
          {{ $t("t.import") }}
        </span>
      </BIMDataButton>
      <BIMDataButton
        color="primary"
        fill
        radius
        :icon="isXL"
        width="120px"
        @click="openTopicCreate"
      >
        <BIMDataIconPlus size="xxxs" />
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

    <AppSidePanelContent :header="false">
      <Transition name="fade" mode="out-in">
        <template v-if="currentPanel === sidePanelViews.settings">
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
        <template v-else-if="currentPanel === sidePanelViews.overview">
          <BcfTopicOverview
            :uiConfig="{
              closeButton: true,
              editButton: !project.isGuest,
              deleteButton: !project.isGuest,
              commentCreation: !project.isGuest
            }"
            :project="project"
            :detailedExtensions="detailedExtensions"
            :topic="currentTopic"
            @edit-topic="openTopicUpdate(currentTopic)"
            @view-topic="openTopicViewer(currentTopic)"
            @view-topic-viewpoint="openTopicSnapshot"
            @view-comment-snapshot="openTopicCommentSnapshot"
            @topic-deleted="
              reloadBcfTopics(), closeSidePanel(), removeTopicGuidFromUrl()
            "
            @close="closeSidePanel(), removeTopicGuidFromUrl()"
          />
        </template>
        <template v-else-if="currentPanel === sidePanelViews.create">
          <BcfTopicForm
            :uiConfig="{
              closeButton: true
            }"
            :project="project"
            :extensions="extensions"
            :topics="topics"
            @topic-created="reloadBcfTopics(), closeSidePanel()"
            @close="closeSidePanel"
          />
        </template>
        <template v-else-if="currentPanel === sidePanelViews.update">
          <BcfTopicForm
            :uiConfig="{
              backButton: true,
              closeButton: true
            }"
            :project="project"
            :extensions="extensions"
            :topics="topics"
            :topic="currentTopic"
            @topic-updated="reloadBcfTopics"
            @back="openTopicOverview(currentTopic)"
            @close="closeSidePanel"
          />
        </template>
      </Transition>
    </AppSidePanelContent>

    <div class="project-bcf__content">
      <Transition name="fade">
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
      </Transition>

      <div class="project-bcf__content__selected-topics">
        <div v-if="!loading" class="selected-topics flex items-center">
          <BIMDataCheckbox
            :modelValue="fullSelectionRef"
            @update:modelValue="toggleFullSelection"
          />
          <span>
            {{ $t("ProjectBcf.selectedTopicCount") }} :
            <strong>{{ selectedTopics.size }} BCF</strong>
          </span>
          <BIMDataButton
            v-if="selectedTopics.size > 0"
            class="m-l-18"
            fill
            radius
            :icon="isXL"
            @click="exportBcfTopics"
          >
            <BIMDataIconExport size="xs" />
            <span v-if="!isXL" style="margin-left: 6px">
              {{ $t("t.export") }}
            </span>
          </BIMDataButton>

          <BIMDataButton
            v-if="selectedTopics.size > 0"
            class="m-l-18"
            fill
            radius
            :icon="isXL" 
            @click="exportBcfXlsxTopics"
          >
            <BIMDataIconExportXlsx size="xs" />
            <span v-if="!isXL" style="margin-left: 6px">
              {{ $t("t.exportXlsx") }}
            </span>
          </BIMDataButton>

          <BIMDataButton
            v-if="selectedTopics.size > 0"
            class="m-l-18"
            fill
            radius
            :icon="isXL"
            color="high"
            @click="toggleDeleteMode"
          >
            <BIMDataIconDelete size="xs" />
            <span v-if="!isXL" style="margin-left: 6px">
              {{ $t("t.delete") }}
            </span>
          </BIMDataButton>
        </div>

        <Transition name="fade" mode="out-in">
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
              :selectable="true"
              v-model:selection="selectedTopics"
              @open-topic="openTopicOverview($event)"
            />
          </div>

          <div v-else class="project-bcf__content__grid m-t-12">
            <TransitionGroup name="grid">
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
                :selectable="true"
                :selected="selectedTopics.has(topic.guid)"
                @update:selected="toggleTopicSelection(topic)"
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
            </TransitionGroup>
          </div>
        </Transition>
      </div>
    </div>

    <AppModalContent
      :boxStyle="{
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(47, 55, 74, 0.8)'
      }"
      closeBtnColor="white"
    >
      <div
        v-if="topicSnapshot"
        class="topic-snapshot-modal"
        v-click-away="closeTopicSnapshot"
      >
        <img :src="topicSnapshot" />
      </div>

      <div
        v-if="commentSnapshot"
        class="topic-comment-snapshot-modal"
        v-click-away="closeCommentSnapshot"
      >
        <img :src="commentSnapshot" />
      </div>
    </AppModalContent>
  </div>
</template>

<script>
import {
  getViewpointConfig,
  useBcfFilter,
  useBcfSearch,
  useBcfSort
} from "@bimdata/bcf-components";
import { computed, onActivated, onDeactivated, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { useAppModal } from "../../../components/specific/app/app-modal/app-modal.js";
import { useAppNotification } from "../../../components/specific/app/app-notification/app-notification.js";
import { useAppSidePanel } from "../../../components/specific/app/app-side-panel/app-side-panel.js";
import { useStandardBreakpoints } from "../../../composables/responsive.js";
import { useToggle } from "../../../composables/toggle.js";
import { MODEL_CONFIG, MODEL_STATUS } from "../../../config/models.js";
import { DEFAULT_WINDOW } from "../../../config/viewer.js";
import routeNames from "../../../router/route-names.js";
import { useBcf } from "../../../state/bcf.js";
import { useModels } from "../../../state/models.js";
import { useProjects } from "../../../state/projects.js";
import { fileUploadInput } from "../../../utils/upload.js";

// Components
import BcfStatisticsEmptyImage from "../../../components/images/BcfStatisticsEmptyImage.vue";
import NoSearchResultsImage from "../../../components/images/NoSearchResultsImage.vue";
import AppModalContent from "../../../components/specific/app/app-modal/AppModalContent.vue";
import AppSidePanelContent from "../../../components/specific/app/app-side-panel/AppSidePanelContent.vue";
import AppSlotContent from "../../../components/specific/app/app-slot/AppSlotContent.vue";

const sidePanelViews = {
  settings: "settings",
  overview: "overview",
  create: "create",
  update: "update"
};

export default {
  components: {
    AppModalContent,
    AppSidePanelContent,
    AppSlotContent,
    BcfStatisticsEmptyImage,
    NoSearchResultsImage
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const route = useRoute();
    const { pushNotification } = useAppNotification();
    const { currentProject } = useProjects();
    const { projectModels } = useModels();
    const {
      topics,
      extensions,
      detailedExtensions,
      loadBcfTopics,
      loadExtensions,
      loadDetailedExtensions,
      deleteTopics,
      importBcf,
      exportBcf, 
      exportBcfXlsx, 
    } = useBcf();

    const loading = ref(false);
    const isListView = ref(false);
    const currentPanel = ref("");
    const currentTopic = ref(null);

    const reloadExtensions = async () => {
      await Promise.all([
        loadExtensions(currentProject.value),
        loadDetailedExtensions(currentProject.value)
      ]);
    };

    const reloadBcfTopics = async () => {
      await loadBcfTopics(currentProject.value);
    };

    watch(
      currentProject,
      async () => {
        try {
          loading.value = true;
          currentPanel.value = "";
          currentTopic.value = null;
          await reloadExtensions();
          await reloadBcfTopics();
          const topic = topics.value.find(
            t => t.guid === route.query.topicGuid
          );
          if (topic) {
            openTopicOverview(topic);
          }
        } finally {
          loading.value = false;
        }
      },
      { immediate: true }
    );

    watch(
      topics,
      () => {
        if (currentTopic.value) {
          currentTopic.value = topics.value.find(
            t => t.guid === currentTopic.value.guid
          );
        }
      },
      { immediate: true }
    );

    onActivated(() => {
      currentPanel.value = "";
      currentTopic.value = null;
    });
    onDeactivated(() => {
      currentPanel.value = "";
      currentTopic.value = null;
      closeSidePanel();
      removeTopicGuidFromUrl();
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

    const selectedTopics = ref(new Map());
    const fullSelectionRef = computed(() =>
      selectedTopics.value.size < topics.value.length
        ? selectedTopics.value.size > 0
          ? null
          : false
        : selectedTopics.value.size > 0
    );

    const toggleTopicSelection = topic => {
      const selection = selectedTopics.value;
      if (!selection.delete(topic.guid)) {
        selection.set(topic.guid, topic);
      }
      selectedTopics.value = new Map([...selection.entries()]);
    };

    const toggleFullSelection = () => {
      if (selectedTopics.value.size < topics.value.length) {
        selectedTopics.value = new Map([...topics.value.map(t => [t.guid, t])]);
      } else {
        selectedTopics.value = new Map();
      }
    };

    const importBcfTopics = async files => {
      try {
        loading.value = true;
        await importBcf(currentProject.value, files[0]);
        pushNotification({
          type: "success",
          title: t("t.success"),
          message: t("ProjectBcf.importBcfNotificationSuccess")
        });
      } catch {
        pushNotification({
          type: "error",
          title: t("t.error"),
          message: t("ProjectBcf.importBcfNotificationError")
        });
      } finally {
        loading.value = false;
      }
    };

    const exportBcfTopics = async () => {
      try {
        await exportBcf(currentProject.value, [
          ...selectedTopics.value.values()
        ]);
        pushNotification({
          type: "success",
          title: t("t.success"),
          message: t("ProjectBcf.exportBcfNotificationSuccess")
        });
      } catch {
        pushNotification({
          type: "error",
          title: t("t.error"),
          message: t("ProjectBcf.exportBcfNotificationError")
        });
      }
    };

    const exportBcfXlsxTopics = async () => {
      try {
        await exportBcfXlsx(currentProject.value, [
          ...selectedTopics.value.values()
        ]);
        pushNotification({
          type: "success",
          title: t("t.success"),
          message: t("ProjectBcf.exportBcfXlsxNotificationSuccess")
        });
      } catch(e) {
        console.error(e); 
        pushNotification({
          type: "error",
          title: t("t.error"),
          message: t("ProjectBcf.exportBcfXlsxNotificationError")
        });
      }
    };

    const isLoadingDelete = ref(false);

    const deleteBcfTopics = async () => {
      try {
        isLoadingDelete.value = true;
        await deleteTopics(currentProject.value, selectedTopics.value.values());
        isLoadingDelete.value = false;

        closeDeleteMode();
        selectedTopics.value.clear();

        pushNotification({
          type: "success",
          title: t("t.success"),
          message: t("ProjectBcf.deleteBcfNotificationSuccess")
        });
      } catch {
        pushNotification({
          type: "error",
          title: t("t.error"),
          message: t("ProjectBcf.deleteBcfNotificationError")
        });
      }
    };

    const { openSidePanel, closeSidePanel } = useAppSidePanel();

    const {
      isOpen: showMetrics,
      close: closeMetrics,
      toggle: toggleMetrics
    } = useToggle();

    const openSettings = () => {
      currentPanel.value = sidePanelViews.settings;
      openSidePanel();
    };

    const openTopicOverview = topic => {
      currentPanel.value = sidePanelViews.overview;
      currentTopic.value = topic;
      addTopicGuidToUrl();
      openSidePanel();
    };

    const openTopicCreate = () => {
      currentPanel.value = sidePanelViews.create;
      currentTopic.value = null;
      openSidePanel();
    };

    const openTopicUpdate = topic => {
      currentPanel.value = sidePanelViews.update;
      currentTopic.value = topic;
      openSidePanel();
    };

    const { openModal, closeModal } = useAppModal();
    const topicSnapshot = ref(null);
    const openTopicSnapshot = topic => {
      openModal();
      topicSnapshot.value = topic.snapshot.snapshot_data;
    };
    const closeTopicSnapshot = () => {
      closeModal();
      topicSnapshot.value = null;
    };
    const commentSnapshot = ref(null);
    const openTopicCommentSnapshot = topic => {
      openModal();
      commentSnapshot.value = topic.snapshot.snapshot_data;
    };
    const closeCommentSnapshot = () => {
      closeModal();
      commentSnapshot.value = null;
    };

    const removeTopicGuidFromUrl = () => {
      delete route.query.topicGuid;
      window.history.replaceState({}, "", router.resolve(route).fullPath);
    };

    const addTopicGuidToUrl = () => {
      route.query.topicGuid = currentTopic.value.guid;
      window.history.replaceState({}, "", router.resolve(route).fullPath);
    };

    const openTopicViewer = topic => {
      let viewpoint = topic.viewpoints[0] ?? {};
      let window = getViewpointConfig(viewpoint)?.window ?? DEFAULT_WINDOW;
      let modelIDs = viewpoint.model_ids ?? [];

      if (modelIDs.length === 0) {
        // If no models are specified on the viewpoint
        // get the models of the topic
        modelIDs = topic.models;
      }
      if (modelIDs.length === 0) {
        // If no models are specified on the viewpoint
        // get the last created model of proper type
        // with respect to the target window
        const models = projectModels.value
          .filter(
            m =>
              m.status === MODEL_STATUS.COMPLETED &&
              MODEL_CONFIG[m.type].window === window
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

    const {
      isOpen: deleteMode,
      close: closeDeleteMode,
      toggle: toggleDeleteMode
    } = useToggle();

    return {
      // References
      currentPanel,
      currentTopic,
      detailedExtensions,
      displayedTopics,
      extensions,
      fullSelectionRef,
      isListView,
      loading,
      models: projectModels,
      project: currentProject,
      searchText,
      selectedTopics,
      showMetrics,
      sidePanelViews,
      sortedBy,
      sortOrderDate,
      sortOrderIndex,
      sortOrderTitle,
      topics,
      topicSnapshot,
      commentSnapshot,
      deleteMode,
      isLoadingDelete,
      // Methods
      closeDeleteMode,
      toggleDeleteMode,
      deleteBcfTopics,
      applyFilters,
      closeMetrics,
      closeSidePanel,
      closeTopicSnapshot,
      closeCommentSnapshot,
      exportBcfTopics,
      fileUploadInput,
      importBcfTopics,
      exportBcfXlsxTopics, 
      openSettings,
      openTopicCreate,
      openTopicUpdate,
      openTopicOverview,
      openTopicCommentSnapshot,
      openTopicSnapshot,
      openTopicViewer,
      reloadBcfTopics,
      reloadExtensions,
      removeTopicGuidFromUrl,
      sortByDate,
      sortByIndex,
      sortByTitle,
      toggleFullSelection,
      toggleMetrics,
      toggleTopicSelection,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBcf.scss"></style>
