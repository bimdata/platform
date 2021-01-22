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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
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
    const nbSpaces = ref(72);
    const nbProjects = ref(235);

    const goToSpaces = () => router.push('/spaces');

    return {
      // References
      nbSpaces,
      nbProjects,
      // Methods
      goToSpaces
    };
  }
}
</script>

<style scoped lang="scss" src="./Dashboard.scss"></style>
