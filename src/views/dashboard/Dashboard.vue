<template>
  <div data-test="dashboard" class="view dashboard">
    <div class="dashboard__head">
      <DashboardWelcomeTile />
      <DashboardButtonTile
        data-test="btn-spaces"
        color="primary"
        @click="goToUserSpaces"
      >
        <template #title>{{ $t("Dashboard.spacesButtonTitle") }}</template>
        <template #number>{{ spaces.length }}</template>
        <template #text>{{ $t("Dashboard.spacesButtonText") }}</template>
      </DashboardButtonTile>
      <DashboardButtonTile
        data-test="btn-projects"
        color="secondary"
        @click="goToUserProjects"
      >
        <template #title>{{ $t("Dashboard.projectsButtonTitle") }}</template>
        <template #number>{{ projects.length }}</template>
        <template #text>{{ $t("Dashboard.projectsButtonText") }}</template>
      </DashboardButtonTile>
      <DashboardSubscriptionTile />
    </div>
    <div class="dashboard__body">
      <DashboardSpaceList :spaces="spaces" />
      <DashboardProjectList :projects="projects" />
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router/index.js";
import { useProjects } from "@/state/projects.js";
import { useSpaces } from "@/state/spaces.js";
// Components
import DashboardButtonTile from "@/components/specific/dashboard/dashboard-button-tile/DashboardButtonTile.vue";
import DashboardProjectList from "@/components/specific/dashboard/dashboard-project-list/DashboardProjectList.vue";
import DashboardSpaceList from "@/components/specific/dashboard/dashboard-space-list/DashboardSpaceList.vue";
import DashboardSubscriptionTile from "@/components/specific/dashboard/dashboard-subscription-tile/DashboardSubscriptionTile.vue";
import DashboardWelcomeTile from "@/components/specific/dashboard/dashboard-welcome-tile/DashboardWelcomeTile.vue";

export default {
  components: {
    DashboardButtonTile,
    DashboardProjectList,
    DashboardSpaceList,
    DashboardSubscriptionTile,
    DashboardWelcomeTile
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
