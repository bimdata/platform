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
      <DashboardSubscriptionPlatform />
    </div>
    <div class="dashboard__body">
      <DashboardSpaceList :spaces="spaces" />
      <DashboardProjectList :projects="projects" />
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
// Components
import DashboardButtonTile from "@/components/specific/dashboard/dashboard-button-tile/DashboardButtonTile";
import DashboardSubscriptionPlatform from "@/components/specific/dashboard/dashboard-subscription-platform/DashboardSubscriptionPlatform";
import DashboardWelcomeTile from "@/components/specific/dashboard/dashboard-welcome-tile/DashboardWelcomeTile";
import DashboardProjectList from "@/components/specific/dashboard/dashboard-project-list/DashboardProjectList";
import DashboardSpaceList from "@/components/specific/dashboard/dashboard-space-list/DashboardSpaceList";

export default {
  components: {
    DashboardButtonTile,
    DashboardSubscriptionPlatform,
    DashboardWelcomeTile,
    DashboardProjectList,
    DashboardSpaceList
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
