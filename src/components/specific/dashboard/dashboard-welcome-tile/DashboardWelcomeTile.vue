<template>
  <div class="dashboard-welcome-tile">
    <span class="dashboard-welcome-tile__logo">
      <DashboardWelcomeTileImage />
    </span>
    <span class="dashboard-welcome-tile__title">
      {{ $t("DashboardWelcomeTile.title") }}
    </span>
    <span class="dashboard-welcome-tile__message">
      {{ $t("DashboardWelcomeTile.message", { name: user.firstname }) }}
    </span>
  </div>
</template>

<script>
import { useUser } from "../../../../state/user.js";
// Components
import DashboardWelcomeTileImage from "./DashboardWelcomeTileImage.vue";

export default {
  components: {
    DashboardWelcomeTileImage
  },
  setup() {
    const { user } = useUser();

    return {
      // References
      user
    };
  }
};
</script>

<style scoped lang="scss" src="./DashboardWelcomeTile.scss"></style>
