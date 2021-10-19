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
        <div class="flex items-center">
          <StorageInformations :space="space" />
          <!-- <BIMDataButton
          data-test="btn-filter"
          class="space-board__header__btn-filter"
          fill
          squared
          icon
        >
          <BIMDataIcon name="filter" size="s" />
        </BIMDataButton> -->
          <BIMDataButton
            data-test="btn-sort"
            class="space-board__header__btn-sort m-r-12"
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
        </div>
      </template>
    </ViewHeader>

    <SidePanel :title="$t('SpaceUsersManager.title')">
      <SpaceUsersManager
        :space="space"
        :users="users"
        :invitations="invitations"
      />
    </SidePanel>

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
import { useListFilter } from "@/composables/list-filter";
import { useListSort } from "@/composables/list-sort";
import { useSidePanel } from "@/composables/side-panel";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";

// Components
import ResponsiveGrid from "@/components/generic/responsive-grid/ResponsiveGrid";
import SidePanel from "@/components/generic/side-panel/SidePanel";
import ViewHeader from "@/components/generic/view-header/ViewHeader";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import ProjectCard from "@/components/specific/projects/project-card/ProjectCard";
import ProjectCreationCard from "@/components/specific/projects/project-creation-card/ProjectCreationCard";
import SpaceUsersManager from "@/components/specific/users/space-users-manager/SpaceUsersManager";
import StorageInformations from "@/components/specific/subscription/storage-informations/StorageInformations";

export default {
  components: {
    ResponsiveGrid,
    SidePanel,
    ViewHeader,
    AppBreadcrumb,
    ProjectCard,
    ProjectCreationCard,
    SpaceUsersManager,
    StorageInformations
  },
  setup() {
    const { currentSpace, spaceUsers, spaceInvitations } = useSpaces();
    const { spaceProjects } = useProjects();
    const { openSidePanel } = useSidePanel();

    const { filteredList: displayedProjects, searchText } = useListFilter(
      spaceProjects,
      project => project.name
    );

    const { sortToggle: sortProjects } = useListSort(
      displayedProjects,
      project => project.name
    );

    return {
      // References
      invitations: spaceInvitations,
      projects: displayedProjects,
      searchText,
      space: currentSpace,
      users: spaceUsers,
      // Methods
      openUsersManager: openSidePanel,
      sortProjects
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceBoard.scss"></style>
