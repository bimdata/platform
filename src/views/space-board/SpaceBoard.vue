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
        <BIMDataButton color="secondary" fill radius @click="buyPlatformPro">
          {{ $t("SpaceBoard.upgradeStorageButton") }}
        </BIMDataButton>
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
import { useListFilter } from "@/composables/list-filter.js";
import { useListSort } from "@/composables/list-sort.js";
import { useSidePanel } from "@/composables/side-panel.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
import { useAuth } from "@/state/auth.js";
// Components
import ResponsiveGrid from "@/components/generic/responsive-grid/ResponsiveGrid.vue";
import SidePanel from "@/components/generic/side-panel/SidePanel.vue";
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import ProjectCard from "@/components/specific/projects/project-card/ProjectCard.vue";
import ProjectCreationCard from "@/components/specific/projects/project-creation-card/ProjectCreationCard.vue";
import SpaceUsersManager from "@/components/specific/users/space-users-manager/SpaceUsersManager.vue";

export default {
  components: {
    ResponsiveGrid,
    SidePanel,
    ViewHeader,
    AppBreadcrumb,
    ProjectCard,
    ProjectCreationCard,
    SpaceUsersManager
  },
  setup() {
    const { accessToken } = useAuth();
    const { openSidePanel } = useSidePanel();
    const { currentSpace, spaceUsers, spaceInvitations } = useSpaces();
    const { spaceProjects } = useProjects();

    const { filteredList: displayedProjects, searchText } = useListFilter(
      spaceProjects,
      project => project.name
    );

    const { sortToggle: sortProjects } = useListSort(
      displayedProjects,
      project => project.name
    );

    const buyPlatformPro = async () => {
      Paddle.Product.Prices(12403, function (prices) {
        // TODO: set price with with function instead of hard coded value
        console.log(prices);
      });
      console.log(
        JSON.stringify({
          cloud_id: currentSpace.value.id,
          subscription_id: "131457",
          quantity: 5
        })
      );
      // await fetch(
      //   `http://localhost:8000/payment/organization/${currentSpace.value.organization.id}/update-plaform-data-pack-subscription`,
      //   {
      //     method: "PATCH",
      //     headers: {
      //       "content-type": "application/json",
      //       authorization: `Bearer ${accessToken.value}`,
      //     },
      //     body: JSON.stringify({
      //       cloud_id: currentSpace.value.id,
      //       subscription_id: "131457",
      //       quantity: 5,
      //     })
      //   }
      // );
      // return;
      await fetch(
        `http://localhost:8000/payment/organization/${currentSpace.value.organization.id}/create-api-data-pack-subscription`,
        {
          method: "post",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${accessToken.value}`
          },
          body: JSON.stringify({
            cloud_id: currentSpace.value.id
          })
        }
      );
      return;
      // const response = await (
      //   await fetch(
      //     `http://localhost:8000/payment/organization/${currentSpace.value.organization.id}/generate-api-subscription`,
      //     {
      //       method: "POST",
      //       headers: {
      //         "content-type": "application/json",
      //         authorization: `Bearer ${accessToken.value}`
      //       },
      //       body: JSON.stringify({
      //         cloud_id: currentSpace.value.id
      //       })
      //     }
      //   )
      // ).json();

      // Paddle.Checkout.open({
      //   override: response.url,
      //   disableLogout: true,
      //   referring_domain: "platform self service"
      // });
    };

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
      buyPlatformPro
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceBoard.scss"></style>
