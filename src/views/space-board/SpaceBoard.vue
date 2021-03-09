<template>
  <div class="space-board-view">
    <ViewHeader class="space-board-view__header">
      <template #left>
        <AppBreadcrumb />
      </template>
      <template #center>
        <BIMDataSearch
          class="space-board-view__header__search"
          width="300px"
          :placeholder="$t('Projects.searchProjects')"
          v-model="searchText"
          clear
        />
      </template>
      <template #right>
        <BIMDataButton
          class="space-board-view__header__filter-btn"
          fill
          squared
          icon
        >
          <BIMDataIcon name="filter" size="s" />
        </BIMDataButton>
        <BIMDataButton
          class="space-board-view__header__sort-btn"
          fill
          squared
          icon
          @click="sortProjects"
        >
          <BIMDataIcon name="alphabeticalSort" size="s" />
        </BIMDataButton>
        <BIMDataButton
          v-if="isAdmin"
          class="space-board-view__header__users-btn"
          fill
          squared
          icon
          @click="openUsersManager"
        >
          <BIMDataIcon name="addUser" size="s" />
        </BIMDataButton>
      </template>
    </ViewHeader>

    <transition name="fade">
      <SidePanel
        v-show="showUsersManager"
        :title="$t('SpaceUsersManager.title')"
        @close="closeUsersManager"
      >
        <SpaceUsersManager />
      </SidePanel>
    </transition>

    <ResponsiveGrid itemWidth="320px">
      <ProjectCreationCard :key="-1" v-if="isAdmin" />
      <ProjectCard
        v-for="project in projects"
        :key="project.id"
        :project="project"
      />
    </ResponsiveGrid>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";
import ResponsiveGrid from "@/components/generic/responsive-grid/ResponsiveGrid";
import SidePanel from "@/components/generic/side-panel/SidePanel";
import ViewHeader from "@/components/generic/view-header/ViewHeader";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import ProjectCard from "@/components/specific/projects/project-card/ProjectCard";
import ProjectCreationCard from "@/components/specific/projects/project-creation-card/ProjectCreationCard";
import SpaceUsersManager from "@/components/specific/users/space-users-manager/SpaceUsersManager";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSearch,
    ResponsiveGrid,
    SidePanel,
    ViewHeader,
    AppBreadcrumb,
    ProjectCard,
    ProjectCreationCard,
    SpaceUsersManager
  },
  setup() {
    const { currentSpace } = useSpaces();
    const { spaceProjects } = useProjects();

    const isAdmin = ref(false);
    watchEffect(() => (isAdmin.value = currentSpace.value.isAdmin));

    const displayedProjects = ref([]);
    watchEffect(() => (displayedProjects.value = spaceProjects.value));

    const searchText = ref("");
    const filterProjects = value => {
      const text = value.trim().toLowerCase();
      if (text) {
        displayedProjects.value = spaceProjects.value.filter(a =>
          a.name.toLowerCase().includes(text)
        );
      } else {
        displayedProjects.value = spaceProjects.value;
      }
    };
    watchEffect(() => filterProjects(searchText.value));

    let sortOrder = "none";
    const sortProjects = () => {
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
      const n = sortOrder === "desc" ? -1 : 1;
      displayedProjects.value = displayedProjects.value
        .slice()
        .sort((a, b) => (a.name < b.name ? -1 : 1) * n);
    };

    const showUsersManager = ref(false);
    const openUsersManager = () => {
      showUsersManager.value = true;
    };
    const closeUsersManager = () => {
      showUsersManager.value = false;
    };

    return {
      // References
      isAdmin,
      projects: displayedProjects,
      searchText,
      showUsersManager,
      space: currentSpace,
      // Methods
      closeUsersManager,
      filterProjects,
      openUsersManager,
      sortProjects
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceBoard.scss"></style>
