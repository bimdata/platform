<template>
  <div class="app-layout">
    <NotificationCard />
    <AppHeader />
    <div class="app-layout__view-container" :class="{ loading }">
      <router-view></router-view>
    </div>
    <transition name="fade">
      <div class="app-layout__overlay" v-show="loading">
        <BIMDataSpinner class="app-layout__loader" />
      </div>
    </transition>
  </div>
</template>

<script>
import { contexts, useLoadingContext } from "@/composables/loading.js";
// Components
import AppHeader from "@/components/specific/app/app-header/AppHeader.vue";
import NotificationCard from "@/components/generic/notification-card/NotificationCard.vue";

export default {
  components: {
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
