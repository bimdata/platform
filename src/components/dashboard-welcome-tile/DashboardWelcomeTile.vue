<template>
  <div class="dashboard-welcome-tile">
    <img class="dashboard-welcome-tile__logo" 
      alt="Platform Dashboard logo" 
      src="@/assets/dashboard-logo.svg"
    />
    <span class="dashboard-welcome-tile__title">
      {{ $t('Dashboard.welcomeTitle') }}
    </span>
    <span class="dashboard-welcome-tile__message">
      {{ $t('Dashboard.welcomeMessage', { name: firstName }) }}
    </span>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useGlobalState } from '@/state/global';

export default {
  setup() {
    const { user } = useGlobalState();

    const firstName = ref(user.value.profile.given_name);

    return {
      // References
      firstName,
    };
  }
}
</script>

<style scoped lang="scss" src="./DashboardWelcomeTile.scss"></style>
