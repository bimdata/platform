<template>
  <div data-test="project-board" class="view project-board">
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
            <BIMDataIcon v-if="isMD" :name="tab.icon" size="xs" />
            <span v-else>
              {{ $t(`ProjectBoard.tabs.${tab.id}`) }}
            </span>
            <span v-if="tab.id === 'bcf'" class="beta-badge">BETA</span>
          </template>
        </BIMDataTabs>
      </template>
      <template #right>
        <div class="project-board__header__actions">
          <SpaceSizeInfo
            v-if="
              isSubscriptionEnabled && space.isAdmin && currentTab.id !== 'bcf'
            "
            :space="space"
            :spaceSubInfo="spaceSubInfo"
          />
          <AppSlot name="project-board-action" />
        </div>
      </template>
    </ViewHeader>

    <div class="project-board__body">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component
            :is="currentView"
            @switch-sub-modal="isSubscriptionModal = $event"
          />
        </keep-alive>
      </transition>
    </div>
  </div>
  <AppModal v-if="isSubscriptionEnabled && isSubscriptionModal">
    <SubscriptionModal @switch-sub-modal="isSubscriptionModal = $event" />
  </AppModal>
</template>

<script>
import { onBeforeMount, ref, provide, computed } from "vue";
import { useRoute } from "vue-router";
import {
  useCustomBreakpoints,
  useStandardBreakpoints
} from "@/composables/responsive.js";
import { useSession } from "@/composables/session.js";
import { IS_SUBSCRIPTION_ENABLED } from "@/config/subscription.js";
import { DEFAULT_PROJECT_VIEW } from "@/config/projects.js";

import { useProjects } from "@/state/projects.js";
import { isFullTotal } from "@/utils/spaces.js";
import { useSpaces } from "@/state/spaces.js";
// Components
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import AppModal from "@/components/specific/app/app-modal/AppModal.vue";
import AppSlot from "@/components/specific/app/app-slot/AppSlot.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import ViewHeader from "@/components/specific/app/view-header/ViewHeader.vue";
import ProjectBcf from "./project-bcf/ProjectBcf.vue";
import ProjectFiles from "./project-files/ProjectFiles.vue";
import ProjectOverview from "./project-overview/ProjectOverview.vue";
import SpaceSizeInfo from "@/components/specific/subscriptions/space-size-info/SpaceSizeInfo.vue";
import SubscriptionModal from "@/components/specific/subscriptions/subscription-modal/SubscriptionModal.vue";
import SubscriptionStatusBanner from "@/components/specific/subscriptions/subscription-status-banner/SubscriptionStatusBanner.vue";

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
    AppModal,
    AppSlot,
    GoBackButton,
    ProjectBcf,
    ProjectFiles,
    ProjectOverview,
    SpaceSizeInfo,
    SubscriptionModal,
    SubscriptionStatusBanner,
    ViewHeader
  },
  setup() {
    const route = useRoute();
    const { currentSpace, spaceSubInfo } = useSpaces();
    const { currentProject } = useProjects();
    const { projectView } = useSession();

    const { isMidXL } = useCustomBreakpoints({
      isMidXL: ({ width }) => width <= 1132 - 0.02
    });

    const tabs = ref(tabsDef);

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

    provide(
      "isAbleToSub",
      computed(
        () =>
          currentSpace.value.isFree &&
          currentSpace.value.isUserOrga &&
          isFullTotal(spaceSubInfo.value)
      )
    );

    const isSubscriptionModal = ref(false);

    return {
      // References
      currentTab,
      currentView,
      isSubscriptionEnabled: IS_SUBSCRIPTION_ENABLED,
      tabs,
      space: currentSpace,
      spaceSubInfo,
      isSubscriptionModal,
      // Methods
      changeView,
      // Responsive breakpoints
      ...useStandardBreakpoints(),
      isMidXL
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBoard.scss"></style>
