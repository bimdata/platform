<template>
  <div data-test="space-board" class="view space-board">
    <ViewHeader class="space-board__header">
      <template #left>
        <AppBreadcrumb />
      </template>
      <template #center>
        <BIMDataSearch
          data-test="input-search"
          class="space-board__header__search"
          width="300px"
          :placeholder="$t('SpaceBoard.searchInputPlaceholder')"
          v-model="searchText"
          clear
        />
      </template>
      <template #right>
        <BIMDataButton
          data-test="btn-filter"
          class="space-board__header__btn-filter"
          fill
          squared
          icon
        >
          <BIMDataIcon name="filter" size="s" />
        </BIMDataButton>
        <BIMDataButton
          data-test="btn-sort"
          class="space-board__header__btn-sort"
          fill
          squared
          icon
          @click="sortProjects"
        >
          <BIMDataIcon name="alphabeticalSort" size="s" />
        </BIMDataButton>
        <BIMDataButton
          data-test="btn-users"
          v-if="space.isAdmin"
          class="space-board__header__btn-users"
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
        <SpaceUsersManager
          :space="space"
          :users="users"
          :invitations="invitations"
        />
      </SidePanel>
    </transition>

    <ResponsiveGrid itemWidth="320px">
      <ProjectCreationCard
        data-test="creation-card"
        v-if="space.isAdmin"
        :key="-1"
        :space="space"
      />
      <ProjectCard
        data-test="project-card"
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
    const {
      currentSpace,
      currentSpaceUsers,
      currentSpaceInvitations
    } = useSpaces();
    const { spaceProjects } = useProjects();

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
      invitations: currentSpaceInvitations,
      projects: displayedProjects,
      searchText,
      showUsersManager,
      space: currentSpace,
      users: currentSpaceUsers,
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
