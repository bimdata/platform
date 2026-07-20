<template>
  <div data-test-id="view-project-board" class="view project-board">
    <SubscriptionStatusBanner class="project-board__banner" :space="space" />
    <ViewHeader class="project-board__header">
      <template #left>
        <div class="project-board__breadcrumb">
          <GoBackButton v-if="isMidXL" data-guide="btn-change-space" />
          <AppBreadcrumb v-else data-guide="btn-change-space" />
        </div>
      </template>
      <template #center>
        <div class="project-board__pill project-board__pill--tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :data-test-id="`project-tab-${tab.id}`"
            class="project-board__tab"
            :class="{ 'project-board__tab--active': tab.id === currentTab.id }"
            @click="changeView(tab.id)"
          >
            <BIMDataIcon v-if="isMD" :name="tab.icon" size="xs" />
            <span v-else>{{ $t(`ProjectBoard.tabs.${tab.id}`) }}</span>
            <span v-if="tab.beta" class="beta-badge">BETA</span>
          </button>
        </div>
      </template>
      <template #right>
        <div class="project-board__header__actions">
          <ProjectStorageInfo
            v-if="showStorageInfo"
            class="project-board__header__storage"
            :spaceSubInfo="spaceSubInfo"
          />
          <AppLink v-if="showDatapackButton" :to="datapackRoute">
            <BIMDataButton color="secondary" fill radius>
              <BIMDataIconPlus size="xxxs" margin="0 6px 0 0" />
              <span>{{ datapackLabel }}</span>
            </BIMDataButton>
          </AppLink>
          <AppSlot name="project-board-action" />
        </div>
      </template>
    </ViewHeader>

    <div class="project-board__body">
      <Transition name="fade" mode="out-in">
        <KeepAlive>
          <component :is="currentView" @go-folders-view="changeView('files')" />
        </KeepAlive>
      </Transition>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref, provide, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useInterval } from "../../composables/interval.js";
import { useStandardBreakpoints } from "../../composables/responsive.js";
import { useSession } from "../../composables/session.js";
import { useAppSidePanel } from "../../components/specific/app/app-side-panel/app-side-panel.js";
import { IS_SUBSCRIPTION_ENABLED } from "../../config/subscription.js";
import { DEFAULT_PROJECT_VIEW } from "../../config/projects.js";
import routeNames from "../../router/route-names.js";
import { useProjects } from "../../state/projects.js";
import { useSpaces } from "../../state/spaces.js";
import { useUser } from "../../state/user.js";
import { isFullTotal } from "../../utils/spaces.js";

// Components
import AppBreadcrumb from "../../components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import AppLink from "../../components/specific/app/app-link/AppLink.vue";
import AppModalContent from "../../components/specific/app/app-modal/AppModalContent.vue";
import AppSlot from "../../components/specific/app/app-slot/AppSlot.js";
import GoBackButton from "../../components/specific/app/go-back-button/GoBackButton.vue";
import ViewHeader from "../../components/specific/app/view-header/ViewHeader.vue";
import ProjectStorageInfo from "../../components/specific/subscriptions/project-storage-info/ProjectStorageInfo.vue";
import SubscriptionStatusBanner from "../../components/specific/subscriptions/subscription-status-banner/SubscriptionStatusBanner.vue";

import ProjectBcf from "./project-bcf/ProjectBcf.vue";
import ProjectFiles from "./project-files/ProjectFiles.vue";
import ProjectOverview from "./project-overview/ProjectOverview.vue";

const PROJECT_VIEWS = {
  overview: "ProjectOverview",
  files: "ProjectFiles",
  bcf: "ProjectBcf",
};

const tabsDef = [
  {
    id: "overview",
    icon: "ifcFile",
  },
  {
    id: "files",
    icon: "folder",
  },
  {
    id: "bcf",
    icon: "bcf",
  },
];

export default {
  components: {
    AppBreadcrumb,
    AppLink,
    AppModalContent,
    AppSlot,
    GoBackButton,
    ProjectBcf,
    ProjectFiles,
    ProjectOverview,
    ProjectStorageInfo,
    SubscriptionStatusBanner,
    ViewHeader,
  },
  setup() {
    const route = useRoute();
    const { t } = useI18n();
    const { isUserOrga, isSpaceAdmin } = useUser();
    const { currentSpace, spaceSubInfo, isFreeSpace } = useSpaces();
    const { currentProject, loadProjectUsers, loadProjectInvitations } = useProjects();
    const { projectView } = useSession();

    const { closeSidePanel } = useAppSidePanel();

    const shouldSubscribe = computed(
      () =>
        isFreeSpace(currentSpace.value) &&
        isUserOrga(currentSpace.value) &&
        isFullTotal(spaceSubInfo.value),
    );
    provide("shouldSubscribe", shouldSubscribe);

    const currentTab = ref(tabsDef[0]);
    const currentView = ref(PROJECT_VIEWS[DEFAULT_PROJECT_VIEW]);
    const changeView = (key) => {
      const viewKey = PROJECT_VIEWS[key] ? key : DEFAULT_PROJECT_VIEW;

      projectView.set(currentProject.value.id, viewKey);

      currentTab.value = { id: viewKey };
      currentView.value = PROJECT_VIEWS[viewKey];
      closeSidePanel();
    };

    onBeforeMount(() => {
      // Look for current project view in route hash.
      // Otherwise get current view from session storage.
      const viewKey = route.hash.slice(1) || projectView.get(currentProject.value.id);
      // Restore current project view for this project.
      changeView(viewKey);
    });

    useInterval(() => {
      if (currentView.value === PROJECT_VIEWS.overview) {
        loadProjectUsers(currentProject.value);
        loadProjectInvitations(currentProject.value);
      }
    }, 10000);

    const showStorageInfo = computed(
      () =>
        IS_SUBSCRIPTION_ENABLED &&
        isSpaceAdmin(currentSpace.value) &&
        currentTab.value.id !== "bcf",
    );

    // Same conditions as SpaceSizeInfo Datapack/Subscribe button, kept aligned
    // with the existing subscription business rules.
    const showDatapackButton = computed(
      () =>
        showStorageInfo.value &&
        spaceSubInfo.value?.isPlatformSubscription &&
        spaceSubInfo.value?.isOrganizationMember &&
        !spaceSubInfo.value?.isCustomSubscription,
    );

    const datapackRoute = computed(() => ({
      name: spaceSubInfo.value?.isPlatformPro
        ? routeNames.subscriptionDatapack
        : routeNames.subscriptionPro,
      query: { space: currentSpace.value?.id },
    }));

    const datapackLabel = computed(() =>
      spaceSubInfo.value?.isPlatformPro ? "DataPack" : t("SpaceSizeInfo.subscribePlatformButton"),
    );

    return {
      // References
      currentTab,
      currentView,
      IS_SUBSCRIPTION_ENABLED,
      space: currentSpace,
      spaceSubInfo,
      tabs: tabsDef,
      showStorageInfo,
      showDatapackButton,
      datapackRoute,
      datapackLabel,
      // Methods
      changeView,
      isSpaceAdmin,
      closeSidePanel,
      // Responsive breakpoints
      ...useStandardBreakpoints(),
    };
  },
  computed: {
    datapackLabel() {
      return this.spaceSubInfo?.isPlatformPro
        ? "DataPack"
        : this.$t("SpaceSizeInfo.subscribePlatformButton");
    },
  },
};
</script>

<style scoped lang="scss" src="./ProjectBoard.scss"></style>
