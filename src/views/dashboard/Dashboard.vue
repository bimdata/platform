<template>
  <div class="dashboard-view">
    <div class="dashboard-view__head">
      <DashboardWelcomeTile />
      <DashboardButtonTile color="primary" @click="goToSpaces">
        <template #title>{{ $t("Dashboard.activeSpaces") }}</template>
        <template #number>{{ nbSpaces }}</template>
        <template #text>{{ $t("Dashboard.viewSpaces") }}</template>
      </DashboardButtonTile>
      <DashboardButtonTile color="secondary" @click="goToProjects">
        <template #title>{{ $t("Dashboard.activeProjects") }}</template>
        <template #number>{{ nbProjects }}</template>
        <template #text>{{ $t("Dashboard.viewProjects") }}</template>
      </DashboardButtonTile>
      <DashboardInfoTile />
    </div>
    <div class="dashboard-view__body">
      <DashboardSpaceList />
      <DashboardProjectList />
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
import { useProjects } from "@/state/projects";
import { useSpaces } from "@/state/spaces";
// Components
import DashboardButtonTile from "@/components/specific/dashboard/dashboard-button-tile/DashboardButtonTile";
import DashboardInfoTile from "@/components/specific/dashboard/dashboard-info-tile/DashboardInfoTile";
import DashboardWelcomeTile from "@/components/specific/dashboard/dashboard-welcome-tile/DashboardWelcomeTile";
import DashboardProjectList from "@/components/specific/dashboard/dashboard-project-list/DashboardProjectList";
import DashboardSpaceList from "@/components/specific/dashboard/dashboard-space-list/DashboardSpaceList";

export default {
  components: {
    DashboardButtonTile,
    DashboardInfoTile,
    DashboardWelcomeTile,
    DashboardProjectList,
    DashboardSpaceList
  },
  setup() {
    const router = useRouter();
    const { userSpaces } = useSpaces();
    const { userProjects } = useProjects();

    const nbSpaces = ref(0);
    watchEffect(() => {
      if (userSpaces.value) {
        nbSpaces.value = userSpaces.value.length;
      }
    });
    const goToSpaces = () => {
      router.push({ name: routeNames.spaces });
    };

    const nbProjects = ref(0);
    watchEffect(() => {
      if (userProjects.value) {
        nbProjects.value = userProjects.value.length;
      }
    });
    const goToProjects = () => {
      router.push({ name: routeNames.projects });
    };

    return {
      // References
      nbProjects,
      nbSpaces,
      // Methods
      goToProjects,
      goToSpaces
    };
  }
};
</script>

<style scoped lang="scss" src="./Dashboard.scss"></style>
