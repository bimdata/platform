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
    <DashboardButtonTile
        data-test="btn-projects"
        color="secondary"
        @click="buyPlatformPro"
      >
        <template #title>Buy PRO</template>
        <template #number>44.99 €</template>
        <template #text>Get more space and more features</template>
      </DashboardButtonTile>
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
import { useAuth } from "@/state/auth";
// Components
import ResponsiveGrid from "@/components/generic/responsive-grid/ResponsiveGrid";
import SidePanel from "@/components/generic/side-panel/SidePanel";
import ViewHeader from "@/components/generic/view-header/ViewHeader";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import ProjectCard from "@/components/specific/projects/project-card/ProjectCard";
import ProjectCreationCard from "@/components/specific/projects/project-creation-card/ProjectCreationCard";
import SpaceUsersManager from "@/components/specific/users/space-users-manager/SpaceUsersManager";
import DashboardButtonTile from "@/components/specific/dashboard/dashboard-button-tile/DashboardButtonTile";

export default {
  components: {
    ResponsiveGrid,
    SidePanel,
    ViewHeader,
    AppBreadcrumb,
    ProjectCard,
    ProjectCreationCard,
    SpaceUsersManager,
    DashboardButtonTile,
  },
  setup() {
    const { currentSpace, spaceUsers, spaceInvitations } = useSpaces();
    const { spaceProjects } = useProjects();
    const { openSidePanel } = useSidePanel();
    const { accessToken } = useAuth();

    const { filteredList: displayedProjects, searchText } = useListFilter(
      spaceProjects,
      project => project.name
    );

    const { sortToggle: sortProjects } = useListSort(
      displayedProjects,
      project => project.name
    );

    const buyPlatformPro = async () => {
      Paddle.Product.Prices(12403, function(prices) {
        // TODO: set price with with function instead of hard coded value
        console.log(prices);
      });
      console.log(JSON.stringify({
            cloud_id: currentSpace.value.id,
            subscription_id: "131457",
            quantity: 5,
          }))
/*      await fetch(`http://localhost:8000/payment/organization/${currentSpace.value.organization.id}/update-plaform-data-pack-subscription`, {
          method: "PATCH", headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${accessToken.value}`,
          },
          body: JSON.stringify({
            cloud_id: currentSpace.value.id,
            subscription_id: "131457",
            quantity: 5,
          })
        }
      );
      return;*/
      await fetch(`http://localhost:8000/payment/organization/${currentSpace.value.organization.id}/create-api-data-pack-subscription`, {
          method: "post", headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${accessToken.value}`,
          },
          body: JSON.stringify({
            cloud_id: currentSpace.value.id
          })
        }
      );
      return;
      const response = await (await fetch(`http://localhost:8000/payment/organization/${currentSpace.value.organization.id}/generate-api-subscription`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${accessToken.value}`,
        },
        body: JSON.stringify({
          cloud_id: currentSpace.value.id
        })
      })).json();

      Paddle.Checkout.open({
        override: response.url,
        disableLogout: true,
        referring_domain: "platform self service",
      });
    }

    return {
      // References
      invitations: spaceInvitations,
      projects: displayedProjects,
      searchText,
      space: currentSpace,
      users: spaceUsers,
      // Methods
      openUsersManager: openSidePanel,
      sortProjects,
      buyPlatformPro,
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceBoard.scss"></style>
