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
          :selected="0"
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
import { provide, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
// Components
import BIMDataTabs from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTabs.js";
import AppSlot from "@/components/generic/app-slot/AppSlot";
import ViewHeader from "@/components/generic/view-header/ViewHeader";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import ProjectBcf from "./project-bcf/ProjectBcf";
import ProjectFiles from "./project-files/ProjectFiles";
import ProjectGroups from "./project-groups/ProjectGroups";
import ProjectOverview from "./project-overview/ProjectOverview";

const views = {
  overview: "ProjectOverview",
  files: "ProjectFiles",
  bcf: "ProjectBcf",
  groups: "ProjectGroups"
};

const tabsDef = [{ id: "overview" }, { id: "files" }, { id: "bcf" }];

export default {
  components: {
    BIMDataTabs,
    AppSlot,
    ViewHeader,
    AppBreadcrumb,
    ProjectBcf,
    ProjectFiles,
    ProjectGroups,
    ProjectOverview
  },
  setup() {
    const { locale, t } = useI18n();

    const tabs = ref([]);
    watch(
      () => locale.value,
      () => {
        tabs.value = tabsDef.map(tab => ({
          id: tab.id,
          label: t(`ProjectBoard.tabs.${tab.id}`)
        }));
      },
      { immediate: true }
    );

    const currentView = ref(views.overview);
    const changeView = view => {
      currentView.value = views[view];
    };

    provide("changeView", changeView);

    return {
      // References
      currentView,
      tabs,
      // Methods
      changeView
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectBoard.scss"></style>
