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
        <app-slot name="project-board-action" />
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
import { useProjects } from "@/state/projects";
import { useSession } from "@/state/session";
// Components
import AppSlot from "@/components/generic/app-slot/AppSlot";
import ViewHeader from "@/components/generic/view-header/ViewHeader";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import ProjectBcf from "./project-bcf/ProjectBcf";
import ProjectFiles from "./project-files/ProjectFiles";
import ProjectOverview from "./project-overview/ProjectOverview";

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
  },
  setup() {
    const route = useRoute();
    const { locale, t } = useI18n();
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
      // Methods
      changeView,
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBoard.scss"></style>
