<template>
  <div data-test="dashboard" class="view dashboard">
    <div class="dashboard__head">
      <DashboardWelcomeTile />
      <DashboardButtonTile
        data-test="btn-spaces"
        color="primary"
        @click="goToUserSpaces"
      >
        <template #title>
          {{ $t("Dashboard.spacesTileTitle") }}
        </template>
        <template #content>
          <span style="font-size: 3rem; font-weight: bold">
            {{ spaces.length }}
          </span>
        </template>
        <template #bottom-text>
          {{ $t("Dashboard.spacesTileBottomText") }}
        </template>
      </DashboardButtonTile>
      <DashboardButtonTile
        data-test="btn-projects"
        color="secondary"
        @click="goToUserProjects"
      >
        <template #title>
          {{ $t("Dashboard.projectsTileTitle") }}
        </template>
        <template #content>
          <span style="font-size: 3rem; font-weight: bold">
            {{ projects.length }}
          </span>
        </template>
        <template #bottom-text>
          {{ $t("Dashboard.projectsTileBottomText") }}
        </template>
      </DashboardButtonTile>
      <DashboardButtonTile
        data-test="btn-subscriptions"
        v-if="isSubscriptionEnabled"
        @click="goToUserSubscriptions"
      >
        <template #title>
          {{ $t("Dashboard.subscriptionsTileTitle") }}
        </template>
        <template #content>
          {{ $t("Dashboard.subscriptionsTileText") }}
        </template>
        <template #bottom-text>
          {{ $t("Dashboard.subscriptionsTileBottomText") }}
        </template>
      </DashboardButtonTile>
    </div>
    <div class="dashboard__body">
      <div class="dashboard__body__left">
        <DashboardSpaceList :spaces="spaces" />
        <DashboardProjectList :projects="projects" />
      </div>
      <div class="dashboard__body__right">
        <SubscribeCard v-if="isSubscriptionEnabled" layout="vertical" />
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { IS_SUBSCRIPTION_ENABLED } from "@/config/subscription.js";
import routeNames from "@/router/route-names.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
// Components
import DashboardButtonTile from "@/components/specific/dashboard/dashboard-button-tile/DashboardButtonTile.vue";
import DashboardProjectList from "@/components/specific/dashboard/dashboard-project-list/DashboardProjectList.vue";
import DashboardSpaceList from "@/components/specific/dashboard/dashboard-space-list/DashboardSpaceList.vue";
import DashboardWelcomeTile from "@/components/specific/dashboard/dashboard-welcome-tile/DashboardWelcomeTile.vue";
import SubscribeCard from "@/components/specific/subscriptions/subscribe-card/SubscribeCard.vue";

export default {
  components: {
    DashboardButtonTile,
    DashboardProjectList,
    DashboardSpaceList,
    DashboardWelcomeTile,
    SubscribeCard
  },
  setup() {
    const router = useRouter();
    const { userSpaces } = useSpaces();
    const { userProjects } = useProjects();

    const goToUserSpaces = () => {
      router.push({ name: routeNames.userSpaces });
    };

    const goToUserProjects = () => {
      router.push({ name: routeNames.userProjects });
    };

    const goToUserSubscriptions = () => {
      router.push({ name: routeNames.userSubscriptions });
    };

    return {
      // References
      isSubscriptionEnabled: IS_SUBSCRIPTION_ENABLED,
      projects: userProjects,
      spaces: userSpaces,
      // Methods
      goToUserProjects,
      goToUserSpaces,
      goToUserSubscriptions
    };
  }
};
</script>

<style scoped lang="scss" src="./Dashboard.scss"></style>
