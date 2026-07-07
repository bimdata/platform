<template>
  <div data-test-id="view-dashboard" class="view dashboard">
    <h1 class="dashboard__welcome" data-guide="welcome-title">
      {{ $t("Dashboard.welcome", { name: user.firstname }) }}
    </h1>

    <div class="dashboard__tiles">
      <AppLink
        data-test-id="btn-spaces"
        data-guide="btn-spaces"
        :to="{ name: routeNames.userSpaces }"
      >
        <DashboardButtonTile
          color="spaces"
          :buttonText="$t('Dashboard.spacesTileButton')"
        >
          <template #icon>
            <BIMDataIconSpace size="l" />
          </template>
          <template #count>
            {{ spaces.length }}
          </template>
          <template #label>
            {{ $t("Dashboard.spacesTileLabel") }}
          </template>
        </DashboardButtonTile>
      </AppLink>

      <AppLink
        data-test-id="btn-projects"
        data-guide="btn-projects"
        :to="{ name: routeNames.userProjects }"
      >
        <DashboardButtonTile
          color="projects"
          :buttonText="$t('Dashboard.projectsTileButton')"
        >
          <template #icon>
            <BIMDataIconProject size="l" />
          </template>
          <template #count>
            {{ projects.length }}
          </template>
          <template #label>
            {{ $t("Dashboard.projectsTileLabel") }}
          </template>
        </DashboardButtonTile>
      </AppLink>

      <DashboardActionTile
        v-if="isSubscriptionEnabled"
        data-test-id="btn-subscriptions"
        data-guide="btn-subscriptions"
        :to="{ name: routeNames.userSubscriptions }"
        :title="$t('Dashboard.subscriptionsTileTitle')"
        :text="$t('Dashboard.subscriptionsTileText')"
        :buttonText="$t('Dashboard.subscriptionsTileBottomText')"
      >
        <template #icon>
          <BIMDataIconPlan size="s" />
        </template>
      </DashboardActionTile>

      <DashboardActionTile
        data-test-id="btn-create-space"
        :title="$t('Dashboard.createSpaceTitle')"
        :text="$t('Dashboard.createSpaceText')"
        :buttonText="$t('Dashboard.createSpaceButton')"
        @click="openCreationForm"
      >
        <template #icon>
          <BIMDataIconPlus size="xs" />
        </template>
      </DashboardActionTile>
    </div>

    <div class="dashboard__body">
      <section class="dashboard__body__section">
        <DashboardSpaceList
          :spaces="spaces"
          isCarousel
          :creating="showCreationForm"
          @close-creation="closeCreationForm"
        />
      </section>
      <section class="dashboard__body__section">
        <DashboardProjectList :projects="projects" isCarousel />
      </section>
    </div>
  </div>
</template>

<script>
import { useToggle } from "../../composables/toggle.js";
import { IS_SUBSCRIPTION_ENABLED } from "../../config/subscription.js";
import routeNames from "../../router/route-names.js";
import { useProjects } from "../../state/projects.js";
import { useSpaces } from "../../state/spaces.js";
import { useUser } from "../../state/user.js";

// Components
import AppLink from "../../components/specific/app/app-link/AppLink.vue";
import DashboardActionTile from "../../components/specific/dashboard/dashboard-action-tile/DashboardActionTile.vue";
import DashboardButtonTile from "../../components/specific/dashboard/dashboard-button-tile/DashboardButtonTile.vue";
import DashboardProjectList from "../../components/specific/dashboard/dashboard-project-list/DashboardProjectList.vue";
import DashboardSpaceList from "../../components/specific/dashboard/dashboard-space-list/DashboardSpaceList.vue";

export default {
  components: {
    AppLink,
    DashboardActionTile,
    DashboardButtonTile,
    DashboardProjectList,
    DashboardSpaceList
  },
  setup() {
    const { userSpaces } = useSpaces();
    const { userProjects } = useProjects();
    const { user } = useUser();

    const {
      isOpen: showCreationForm,
      open: openCreationForm,
      close: closeCreationForm
    } = useToggle();

    return {
      // References
      isSubscriptionEnabled: IS_SUBSCRIPTION_ENABLED,
      projects: userProjects,
      routeNames,
      spaces: userSpaces,
      user,
      showCreationForm,
      // Methods
      openCreationForm,
      closeCreationForm
    };
  }
};
</script>

<style scoped lang="scss" src="./Dashboard.scss"></style>

