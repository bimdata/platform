<template>
  <div class="dashboard-view">
    <div class="dashboard-view__head">
      <DashboardWelcomeTile />
      <DashboardButtonTile color="primary" @click="goToSpaces">
        <template #title>{{ $t('Dashboard.activeSpaces') }}</template>
        <template #number>{{ nbSpaces }}</template>
        <template #text>{{ $t('Dashboard.viewSpaces') }}</template>
      </DashboardButtonTile>
      <DashboardButtonTile color="secondary">
        <template #title>{{ $t('Dashboard.activeProjects') }}</template>
        <template #number>{{ nbProjects }}</template>
        <template #text>{{ $t('Dashboard.viewProjects') }}</template>
      </DashboardButtonTile>
      <DashboardInfoTile />
    </div>
    <div class="dashboard-view__main">
      <RecentSpacesList />
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useSpaces } from '@/state/spaces';
// Components
import DashboardButtonTile from '@/components/dashboard-button-tile/DashboardButtonTile';
import DashboardInfoTile from '@/components/dashboard-info-tile/DashboardInfoTile';
import DashboardWelcomeTile from '@/components/dashboard-welcome-tile/DashboardWelcomeTile';
import RecentSpacesList from '@/components/recent-spaces-list/RecentSpacesList';

export default {
  components: {
    DashboardButtonTile,
    DashboardInfoTile,
    DashboardWelcomeTile,
    RecentSpacesList,
  },
  setup() {
    const router = useRouter();
    const { spaces } = useSpaces();

    const nbSpaces = ref(0);
    watchEffect(() => {
      if (spaces.value) {
        nbSpaces.value = spaces.value.length;
      }
    });
    const goToSpaces = () => {
      router.push('/spaces');
    };
    
    const nbProjects = ref(235);

    return {
      // References
      nbProjects,
      nbSpaces,
      // Methods
      goToSpaces
    };
  }
}
</script>

<style scoped lang="scss" src="./Dashboard.scss"></style>
