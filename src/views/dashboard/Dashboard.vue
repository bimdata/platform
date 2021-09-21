<template>
  <div data-test="dashboard" class="view dashboard">
    <div class="dashboard__head">
      <DashboardWelcomeTile />
      <DashboardButtonTile data-test="btn-spaces" color="primary" @click="goToUserSpaces">
        <template #title>{{ $t("Dashboard.spacesButtonTitle") }}</template>
        <template #number>{{ spaces.length }}</template>
        <template #text>{{ $t("Dashboard.spacesButtonText") }}</template>
      </DashboardButtonTile>
      <DashboardButtonTile data-test="btn-projects" color="secondary" @click="goToUserProjects">
        <template #title>{{ $t("Dashboard.projectsButtonTitle") }}</template>
        <template #number>{{ projects.length }}</template>
        <template #text>{{ $t("Dashboard.projectsButtonText") }}</template>
      </DashboardButtonTile>
      <DashboardButtonTile data-test="btn-platform" class="subscription-platform" @click.stop="buyPlatformPro">
        <template #title>{{ $t("Dashboard.platformProButtonTitle") }}</template>
        <template #number>
          <div class="m-t-18 flex items-center justify-between">
            <p>{{ $t("Dashboard.paymentInformationText") }}</p>
            <div class="flex">
              <BIMDataButton width="100px" color="primary" fill radius class="m-r-12" @click.stop="goToUserProjects">{{ $t("Dashboard.updateInformationButton") }}</BIMDataButton>
              <BIMDataButton width="100px"  color="high" ghost radius @click.stop="goToUserProjects">{{ $t("Dashboard.cancelInformationButton") }}</BIMDataButton>
            </div>
          </div>
          <div class="flex">
            <p class="m-r-6">{{ $t("Dashboard.nextPaymentText") }}</p>
            <p>10/10/2021</p>
          </div>
        </template>
        <template #text>
          <span @click="buyPlatformPro">{{ $t("Dashboard.platformProButtonText") }}</span>
        </template>
      </DashboardButtonTile>
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
import DashboardWelcomeTile from "@/components/specific/dashboard/dashboard-welcome-tile/DashboardWelcomeTile";
import DashboardProjectList from "@/components/specific/dashboard/dashboard-project-list/DashboardProjectList";
import DashboardSpaceList from "@/components/specific/dashboard/dashboard-space-list/DashboardSpaceList";

export default {
  components: {
    DashboardButtonTile,
    DashboardWelcomeTile,
    DashboardProjectList,
    DashboardSpaceList,
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

    const buyPlatformPro = () => {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> add example to set prices
      Paddle.Product.Prices(12403, function(prices) {
=======
      Paddle.Product.Prices(12403, function (prices) {
>>>>>>> add PlatformSubscription page & header link
        // TODO: set price with with function instead of hard coded value
        console.log(prices);
      });
<<<<<<< HEAD
=======
>>>>>>> WIP: first Paddle implementation
=======
>>>>>>> add example to set prices
      Paddle.Checkout.open({
        method: "inline",
        product: 12403,
        email: "hugo@bimdata.io",
        title: "MY TITLE",
        message: "MY MESSAGE",
        disableLogout: true,
        referring_domain: "platform self service",
<<<<<<< HEAD
<<<<<<< HEAD
        displayModeTheme: "dark",
=======
>>>>>>> WIP: first Paddle implementation
=======
        displayModeTheme: "dark",
>>>>>>> add example to set prices
      });
    };

    return {
      // References
      projects: userProjects,
      spaces: userSpaces,
      // Methods
      goToUserProjects,
      goToUserSpaces,
      buyPlatformPro,
    };
  },
};
</script>

<style scoped lang="scss" src="./Dashboard.scss"></style>
