<template>
  <div class="dashboard-welcome-tile">
    <img
      class="dashboard-welcome-tile__logo"
      alt="Platform Dashboard logo"
      src="/static/dashboard-logo.svg"
    />
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

export default {
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
