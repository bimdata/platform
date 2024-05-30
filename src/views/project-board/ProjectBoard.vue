<template>
  <div data-test-id="view-project-board" class="view project-board">
    <SubscriptionStatusBanner class="project-board__banner" :space="space" />
    <ViewHeader class="project-board__header">
      <template #left>
        <GoBackButton v-if="isMidXL" data-guide="btn-change-space" />
        <AppBreadcrumb v-else data-guide="btn-change-space" />
      </template>
      <template #center>
        <BIMDataTabs
          data-guide="project-tabs"
          width="300px"
          height="32px"
          :tabSize="isMD ? '64px' : '100px'"
          :tabs="tabs"
          :selected="currentTab.id"
          @tab-click="changeView($event.id)"
        >
          <template #tab="{ tab }">
            <span
              :data-test-id="`project-tab-${tab.id}`"
              class="flex item-center"
            >
              <BIMDataIcon v-if="isMD" :name="tab.icon" size="xs" />
              <span v-else>
                {{ $t(`ProjectBoard.tabs.${tab.id}`) }}
              </span>
              <span v-if="tab.beta" class="beta-badge">BETA</span>
            </span>
          </template>
        </BIMDataTabs>
      </template>
      <template #right>
        <div class="project-board__header__actions">
          <SpaceSizeInfo
            v-if="
              IS_SUBSCRIPTION_ENABLED && space.isAdmin && currentTab.id !== 'bcf'
            "
            :space="space"
            :spaceSubInfo="spaceSubInfo"
          />
          <AppSlot name="project-board-action" />
        </div>
      </template>
    </ViewHeader>

    <div class="project-board__body">
      <Transition name="fade" mode="out-in">
        <KeepAlive>
          <component :is="currentView" />
        </KeepAlive>
      </Transition>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref, provide, computed } from "vue";
import { useRoute } from "vue-router";
import { useInterval } from "../../composables/interval.js";
import { useStandardBreakpoints } from "../../composables/responsive.js";
import { useSession } from "../../composables/session.js";
import { IS_SUBSCRIPTION_ENABLED } from "../../config/subscription.js";
import { DEFAULT_PROJECT_VIEW } from "../../config/projects.js";
import { useProjects } from "../../state/projects.js";
import { useSpaces } from "../../state/spaces.js";
import { isFullTotal } from "../../utils/spaces.js";

// Components
import AppBreadcrumb from "../../components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import AppModalContent from "../../components/specific/app/app-modal/AppModalContent.vue";
import AppSlot from "../../components/specific/app/app-slot/AppSlot.js";
import GoBackButton from "../../components/specific/app/go-back-button/GoBackButton.vue";
import ViewHeader from "../../components/specific/app/view-header/ViewHeader.vue";
import SpaceSizeInfo from "../../components/specific/subscriptions/space-size-info/SpaceSizeInfo.vue";
import SubscriptionStatusBanner from "../../components/specific/subscriptions/subscription-status-banner/SubscriptionStatusBanner.vue";

import ProjectBcf from "./project-bcf/ProjectBcf.vue";
import ProjectFiles from "./project-files/ProjectFiles.vue";
import ProjectOverview from "./project-overview/ProjectOverview.vue";

const PROJECT_VIEWS = {
  overview: "ProjectOverview",
  files: "ProjectFiles",
  bcf: "ProjectBcf"
};

const tabsDef = [
  {
    id: "overview",
    icon: "ifcFile"
  },
  {
    id: "files",
    icon: "folder"
  },
  {
    id: "bcf",
    icon: "bcf"
  }
];

export default {
  components: {
    AppBreadcrumb,
    AppModalContent,
    AppSlot,
    GoBackButton,
    ProjectBcf,
    ProjectFiles,
    ProjectOverview,
    SpaceSizeInfo,
    SubscriptionStatusBanner,
    ViewHeader
  },
  setup() {
    const route = useRoute();
    const { currentSpace, spaceSubInfo } = useSpaces();
    const { currentProject, loadProjectUsers, loadProjectInvitations } = useProjects();
    const { projectView } = useSession();

    const shouldSubscribe = computed(
      () =>
        currentSpace.value.isFree &&
        currentSpace.value.isUserOrga &&
        isFullTotal(spaceSubInfo.value)
    );
    provide("shouldSubscribe", shouldSubscribe);

    const currentTab = ref(tabsDef[0]);
    const currentView = ref(PROJECT_VIEWS[DEFAULT_PROJECT_VIEW]);
    const changeView = key => {
      const viewKey = PROJECT_VIEWS[key] ? key : DEFAULT_PROJECT_VIEW;

      projectView.set(currentProject.value.id, viewKey);

      currentTab.value = { id: viewKey };
      currentView.value = PROJECT_VIEWS[viewKey];
    };

    onBeforeMount(() => {
      // Look for current project view in route hash.
      // Otherwise get current view from session storage.
      const viewKey =
        route.hash.slice(1) || projectView.get(currentProject.value.id);
      // Restore current project view for this project.
      changeView(viewKey);
    });

    useInterval(
      () => {
        if (currentView.value = PROJECT_VIEWS.overview) {
          loadProjectUsers(currentProject.value);
          loadProjectInvitations(currentProject.value);
        }
      },
      5000
    );

    return {
      // References
      currentTab,
      currentView,
      IS_SUBSCRIPTION_ENABLED,
      space: currentSpace,
      spaceSubInfo,
      tabs: tabsDef,
      // Methods
      changeView,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBoard.scss"></style>
