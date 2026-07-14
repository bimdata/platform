<template>
  <div data-test-id="view-space-board" class="view space-board">
    <AppLoading name="spaces-subscriptions" :loader="false">
      <SubscriptionStatusBanner class="space-board__banner" :space="space" />
    </AppLoading>

    <ViewHeader class="space-board__header">
      <template #left>
        <GoBackButton v-if="isMD" />
        <AppBreadcrumb v-else />
      </template>
      <template #center>
        <BIMDataSearch
          class="space-board__header__search"
          :width="isLG ? '150px' : isXL ? '225px' : '300px'"
          :placeholder="isSM ? '' : $t('t.search')"
          v-model="searchText"
          clear
        />
      </template>
      <template #right>
        <div class="space-board__header__actions">
          <SpaceSizeInfo
            v-if="IS_SUBSCRIPTION_ENABLED && isSpaceAdmin(space)"
            :space="space"
            :spaceSubInfo="spaceSubInfo"
          />
          <StatusFilterButton
            :projects="spaceProjects"
            @update:filteredProjects="filteredProjects = $event"
          />
          <BIMDataButton
            v-if="!isLG"
            class="space-board__header__btn"
            fill
            squared
            icon
            @click="sortProjects"
          >
            <BIMDataIconAlphabeticalSort size="s" />
          </BIMDataButton>
          <BIMDataButton
            v-if="isSpaceAdmin(space)"
            data-test-id="btn-users"
            class="space-board__header__btn"
            fill
            squared
            icon
            @click="openUsersManager"
          >
            <BIMDataIconAddUser size="s" />
          </BIMDataButton>
        </div>
      </template>
    </ViewHeader>

    <AppSidePanelContent :title="$t('SpaceUsersManager.title')">
      <AppLoading name="space-users">
        <SpaceUsersManager :space="space" :users="users" :invitations="invitations" />
      </AppLoading>
    </AppSidePanelContent>

    <AppLoading name="space-projects">
      <div class="space-board__body">
        <div class="models-map-container">
          <ProjectsMap ref="map" />
        </div>
        <BIMDataResponsiveGrid
          itemWidth="320px"
          rowGap="36px"
          columnGap="36px"
          :style="{ justifyContent: isMD ? 'center' : '' }"
        >
          <transition-group name="grid">
            <ProjectCreationCard v-if="isSpaceAdmin(space)" :key="-1" :space="space" />
            <ProjectCard v-for="project in projects" :key="project.id" :project="project" @loaded="onProjectLoaded" />
          </transition-group>
        </BIMDataResponsiveGrid>
      </div>
    </AppLoading>
  </div>
</template>

<script>
import { inject, onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useAppSidePanel } from "../../components/specific/app/app-side-panel/app-side-panel.js";
import { useInterval } from "../../composables/interval.js";
import { useListFilter } from "../../composables/list-filter.js";
import { useListSort } from "../../composables/list-sort.js";
import { useStandardBreakpoints } from "../../composables/responsive.js";
import { useSession } from "../../composables/session.js";
import { IS_SUBSCRIPTION_ENABLED } from "../../config/subscription.js";
import routeNames from "../../router/route-names.js";
import { useProjects } from "../../state/projects.js";
import { useSpaces } from "../../state/spaces.js";
import { useUser } from "../../state/user.js";

// Components
import AppBreadcrumb from "../../components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import AppLoading from "../../components/specific/app/app-loading/AppLoading.vue";
import AppSidePanelContent from "../../components/specific/app/app-side-panel/AppSidePanelContent.vue";
import GoBackButton from "../../components/specific/app/go-back-button/GoBackButton.vue";
import ViewHeader from "../../components/specific/app/view-header/ViewHeader.vue";
import ProjectCard from "../../components/specific/projects/project-card/ProjectCard.vue";
import ProjectCreationCard from "../../components/specific/projects/project-creation-card/ProjectCreationCard.vue";
import ProjectsMap from "../../components/specific/projects/projects-map/ProjectsMap.vue";
import StatusFilterButton from "../../components/specific/projects/status-filter-button/StatusFilterButton.vue";
import SpaceSizeInfo from "../../components/specific/subscriptions/space-size-info/SpaceSizeInfo.vue";
import SubscriptionStatusBanner from "../../components/specific/subscriptions/subscription-status-banner/SubscriptionStatusBanner.vue";
import SpaceUsersManager from "../../components/specific/users/space-users-manager/SpaceUsersManager.vue";

export default {
  components: {
    AppBreadcrumb,
    AppLoading,
    AppSidePanelContent,
    GoBackButton,
    ProjectCard,
    ProjectCreationCard,
    ProjectsMap,
    SpaceSizeInfo,
    SpaceUsersManager,
    StatusFilterButton,
    SubscriptionStatusBanner,
    ViewHeader,
  },
  setup() {
    const viewContainer = inject("viewContainer");
    const { spaceBoardViewScroll } = useSession();
    const { isOpenRight, openSidePanel } = useAppSidePanel();
    const { isSpaceAdmin } = useUser();
    const {
      currentSpace,
      spaceSubInfo,
      spaceUsers,
      spaceInvitations,
      loadSpaceUsers,
      loadSpaceInvitations,
    } = useSpaces();
    const { spaceProjects } = useProjects();
    const filteredProjects = ref(spaceProjects.value);

    const { filteredList: displayedProjects, searchText } = useListFilter(
      filteredProjects,
      (project) => project.name + project.description ?? ""
    );

    const { sortToggle: sortProjects } = useListSort(displayedProjects, (project) => project.name);

    const map = ref(null);
    const onProjectLoaded = ({ project, models }) => {
      project.models = models;
      map.value.addProject(project);
    };

    useInterval(() => {
      if (isOpenRight.value) {
        loadSpaceUsers(currentSpace.value);
        loadSpaceInvitations(currentSpace.value);
      }
    }, 10000);

    onMounted(() => {
      const scroll = spaceBoardViewScroll.get(currentSpace.value.id);
      if (scroll) {
        viewContainer.value.scrollTo({ top: scroll, behavior: "instant" });
      }
    });

    onBeforeRouteLeave((to) => {
      if (to.name === routeNames.projectBoard) {
        spaceBoardViewScroll.set(currentSpace.value.id, viewContainer.value.scrollTop);
      } else {
        spaceBoardViewScroll.clear(currentSpace.value.id);
      }
    });

    return {
      // References
      invitations: spaceInvitations,
      IS_SUBSCRIPTION_ENABLED,
      map,
      projects: displayedProjects,
      searchText,
      space: currentSpace,
      spaceSubInfo,
      users: spaceUsers,
      spaceProjects,
      filteredProjects,
      // Methods
      isSpaceAdmin,
      onProjectLoaded,
      openUsersManager: openSidePanel,
      sortProjects,
      // Responsive breakpoints
      ...useStandardBreakpoints(),
    };
  },
};
</script>

<style scoped>
.space-board {
  height: 100%;

  .space-board__banner {
    position: absolute;
    top: 0;
    left: 0;
  }

  /* Add top padding to header when banner is displayed */
  .space-board__banner.visible + .space-board__header {
    padding-top: var(--spacing-unit);
  }

  .space-board__header {
    .space-board__header__search {
      background-color: var(--color-white);
    }

    .space-board__header__actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-unit);
    }

    .space-board__header__btn {
      color: var(--color-granite-light);
    }
  }

  
  .space-board__body {
    padding: calc(var(--spacing-unit) * 2) 0;

    .models-map-container {
      height: 300px;
      padding: calc(var(--spacing-unit) * 2);
      margin-bottom: calc(var(--spacing-unit) * 2);
      background-color: var(--color-white);
    }
  }
}
</style>
