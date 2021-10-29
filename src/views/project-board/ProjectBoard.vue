<template>
  <div data-test="project-board" class="view project-board">
    <ViewHeader class="project-board__header">
      <template #left>
        <AppBreadcrumb />
      </template>
      <template #center>
        <BIMDataTabs
          width="300px"
          height="32px"
          tabSize="100px"
          :tabs="tabs"
          :selected="currentTab.id"
          @tab-click="changeView($event.id)"
        />
      </template>
      <template #right>
        <div class="flex items-center">
          <SpaceSizeInfo
            v-if="space.isAdmin"
            :space="space"
            :spaceInfo="spaceInfo"
          />
          <app-slot name="project-board-action" />
        </div>
      </template>
    </ViewHeader>

    <div class="project-board__body">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="currentView" />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useProjects } from "@/state/projects.js";
import { useSession } from "@/state/session.js";
import { useSpaces } from "@/state/spaces.js";

// Components
import AppSlot from "@/components/generic/app-slot/AppSlot.vue";
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import ProjectBcf from "./project-bcf/ProjectBcf.vue";
import ProjectFiles from "./project-files/ProjectFiles.vue";
import ProjectOverview from "./project-overview/ProjectOverview.vue";
import SpaceSizeInfo from "@/components/specific/payment/space-size-info/SpaceSizeInfo.vue";

const DEFAULT_PROJECT_VIEW = "overview";
const PROJECT_VIEWS = {
  overview: "ProjectOverview",
  files: "ProjectFiles",
  bcf: "ProjectBcf"
};

const tabsDef = [
  {
    id: "overview"
  },
  {
    id: "files"
  },
  {
    id: "bcf"
  }
];

export default {
  components: {
    AppSlot,
    ViewHeader,
    AppBreadcrumb,
    ProjectBcf,
    ProjectFiles,
    ProjectOverview,
    SpaceSizeInfo
  },
  setup() {
    const route = useRoute();
    const { locale, t } = useI18n();
    const { currentSpace, spaceInfo } = useSpaces();
    const { currentProject } = useProjects();
    const { currentProjectView } = useSession();

    const tabs = ref([]);
    watch(
      () => locale.value,
      () => {
        tabs.value = tabsDef.map(tab => ({
          ...tab,
          label: t(`ProjectBoard.tabs.${tab.id}`)
        }));
      },
      { immediate: true }
    );

    const currentTab = ref(tabsDef[0]);
    const currentView = ref(PROJECT_VIEWS[DEFAULT_PROJECT_VIEW]);
    const changeView = key => {
      const viewKey = PROJECT_VIEWS[key] ? key : DEFAULT_PROJECT_VIEW;

      currentProjectView.set(currentProject.value.id, viewKey);

      currentTab.value = { id: viewKey };
      currentView.value = PROJECT_VIEWS[viewKey];
    };

    onBeforeMount(() => {
      // Look for current project view in route hash.
      // Otherwise get current view from session storage.
      const viewKey =
        route.hash.slice(1) || currentProjectView.get(currentProject.value.id);
      // Restore current project view for this project.
      changeView(viewKey);
    });

    return {
      // References
      currentTab,
      currentView,
      tabs,
      space: currentSpace,
      spaceInfo,
      // Methods
      changeView
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBoard.scss"></style>
