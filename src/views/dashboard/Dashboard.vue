<template>
  <div class="dashboard-view">
    <div id="welcome" class="block top">
      <img class="welcome__logo" alt="Platform Dashboard logo" src="@/assets/dashboard-logo.svg" />
      <span class="welcome__title">{{ $t('Dashboard.welcomeTitle') }}</span>
      <span class="welcome__message">{{ $t('Dashboard.welcomeMessage', { name: firstName }) }}</span>
    </div>
    <div id="active-spaces" class="block top clickable"
      @click="goToSpaces">
      <span class="active-spaces__title">{{ $t('Dashboard.activeSpaces') }}</span>
      <span class="active-spaces__number">{{ nbSpaces }}</span>
      <span class="active-spaces__text">
        {{ $t('Dashboard.viewSpaces') }}
        <BIMDataIcon class="arrow-icon" name="arrow" size="s" />
      </span>
    </div>
    <div id="active-projects" class="block top clickable">
      <span class="active-projects__title">{{ $t('Dashboard.activeProjects') }}</span>
      <span class="active-projects__number">{{ nbProjects }}</span>
      <span class="active-projects__text">
        {{ $t('Dashboard.viewProjects') }}
        <BIMDataIcon class="arrow-icon" name="arrow" size="s" />
      </span>
    </div>
    <div id="security" class="block top">
      <div class="security__head">
        <span>{{ $t('Dashboard.security') }}</span>
        <BIMDataIcon class="security-icon" name="information" size="s" />
      </div>
      <div class="security__body">
        <span>Last login 5 July at 4:07 AM</span>
        <span>IP: 212.19.20.173</span>
        <span>Mozilla/5.0 (Macintosh; Intel Mac OS X)</span>
      </div>
    </div>
    <div id="main" class="block">
      Main
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalState } from '@/state/globalState';
// Components
import BIMDataIcon from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js';

export default {
  components: {
    BIMDataIcon
  },
  setup() {
    const router = useRouter();
    const { user } = useGlobalState();

    const firstName = ref(user.value.profile.given_name);
    const nbSpaces = ref(72);
    const nbProjects = ref(235);

    const goToSpaces = () => router.push('/spaces');

    return {
      // References
      firstName,
      nbSpaces,
      nbProjects,
      // Methods
      goToSpaces
    };
  }
}
</script>

<style scoped lang="scss" src="./Dashboard.scss"></style>
