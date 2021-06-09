<template>
  <div class="app-layout">
    <NotificationCard />
    <AppHeader />
    <div class="view-container">
      <BIMDataSpinner class="view-container__loader" v-if="loading" />
      <router-view v-else></router-view>
    </div>
  </div>
</template>

<script>
import { contexts, useLoadingContext } from "@/composables/loading";
// Components
import BIMDataSpinner from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSpinner.js";
import AppHeader from "@/components/specific/app/app-header/AppHeader";
import NotificationCard from "@/components/generic/notification-card/NotificationCard";

export default {
  components: {
    BIMDataSpinner,
    AppHeader,
    NotificationCard
  },
  setup() {
    const loading = useLoadingContext(contexts.viewContainer);

    return {
      loading
    };
  }
};
</script>

<style scoped lang="scss" src="./styles/layout.scss"></style>
