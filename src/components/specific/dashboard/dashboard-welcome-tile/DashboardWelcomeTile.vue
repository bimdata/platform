<template>
  <div class="dashboard-welcome-tile">
    <DashboardLogo />
    <span class="dashboard-welcome-tile__title">
      {{ $t("DashboardWelcomeTile.title") }}
    </span>
    <span class="dashboard-welcome-tile__message">
      {{ $t("DashboardWelcomeTile.message", { name: user.firstname }) }}
    </span>
  </div>
</template>

<script>
import { useUser } from "@/state/user";
import DashboardLogo from "../../../../../public/static/dashboard-logo.vue";

export default {
  components: {
    DashboardLogo
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
