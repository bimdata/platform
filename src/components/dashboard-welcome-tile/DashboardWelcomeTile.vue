<template>
  <div class="dashboard-welcome-tile">
    <img
      class="dashboard-welcome-tile__logo"
      alt="Platform Dashboard logo"
      src="/static/dashboard-logo.svg"
    />
    <span class="dashboard-welcome-tile__title">
      {{ $t("Dashboard.welcomeTitle") }}
    </span>
    <span class="dashboard-welcome-tile__message">
      {{ $t("Dashboard.welcomeMessage", { name: firstName }) }}
    </span>
  </div>
</template>

<script>
import { ref } from "vue";
import { useUser } from "@/state/user";

export default {
  setup() {
    const { user } = useUser();

    const firstName = ref(user.value.firstname);

    return {
      // References
      firstName
    };
  }
};
</script>

<style scoped lang="scss" src="./DashboardWelcomeTile.scss"></style>
