<template>
  <div data-test="space-board" class="view space-board">
    <SubscriptionStatusBanner class="space-board__banner" :space="space" />
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
          <SpaceSizeInfo
            v-if="isSubscriptionEnabled && space.isAdmin"
            :space="space"
            :spaceInfo="spaceInfo"
          />
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
      <app-loading name="space-users">
        <SpaceUsersManager
          :space="space"
          :users="users"
          :invitations="invitations"
        />
      </app-loading>
    </SidePanel>

    <app-loading name="space-projects">
      <BIMDataResponsiveGrid itemWidth="320px" rowGap="36px" columnGap="36px">
        <transition-group name="grid">
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
        </transition-group>
      </BIMDataResponsiveGrid>
    </app-loading>
  </div>
</template>

<script>
import { useListFilter } from "@/composables/list-filter.js";
import { useListSort } from "@/composables/list-sort.js";
import { useSidePanel } from "@/composables/side-panel.js";
import { IS_SUBSCRIPTION_ENABLED } from "@/config/subscription.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
// Components
import AppLoading from "@/components/generic/app-loading/AppLoading.vue";
import SidePanel from "@/components/generic/side-panel/SidePanel.vue";
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import ProjectCard from "@/components/specific/projects/project-card/ProjectCard.vue";
import ProjectCreationCard from "@/components/specific/projects/project-creation-card/ProjectCreationCard.vue";
import SpaceSizeInfo from "@/components/specific/subscriptions/space-size-info/SpaceSizeInfo.vue";
import SubscriptionStatusBanner from "@/components/specific/subscriptions/subscription-status-banner/SubscriptionStatusBanner.vue";
import SpaceUsersManager from "@/components/specific/users/space-users-manager/SpaceUsersManager.vue";

export default {
  components: {
    AppBreadcrumb,
    AppLoading,
    ProjectCard,
    ProjectCreationCard,
    SidePanel,
    SpaceSizeInfo,
    SpaceUsersManager,
    SubscriptionStatusBanner,
    ViewHeader
  },
  setup() {
    const { openSidePanel } = useSidePanel();
    const { currentSpace, spaceInfo, spaceUsers, spaceInvitations } =
      useSpaces();
    const { spaceProjects } = useProjects();

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
      isSubscriptionEnabled: IS_SUBSCRIPTION_ENABLED,
      projects: displayedProjects,
      searchText,
      space: currentSpace,
      spaceInfo,
      users: spaceUsers,
      // Methods
      openUsersManager: openSidePanel,
      sortProjects
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceBoard.scss"></style>
