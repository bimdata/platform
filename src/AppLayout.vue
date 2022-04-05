<template>
  <div class="app-layout">
    <BIMDataGuidedTour
      :tours="tours"
      :elementToObserve="appLayoutViewContainer"
    />

    <AppNotification />
    <AppHeader />
    <div
      ref="appLayoutViewContainer"
      class="app-layout__view-container"
      :class="{ loading }"
    >
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
import { ref } from "vue";
import { contexts, useLoadingContext } from "@/composables/loading.js";
// Components
import AppHeader from "@/components/specific/app/app-header/AppHeader.vue";
import AppNotification from "@/components/specific/app/app-notification/AppNotification.vue";
import tours from "./config/guidedTour/guidedTour.js";

export default {
  components: {
    AppHeader,
    AppNotification
  },
  setup() {
    const loading = useLoadingContext(contexts.viewContainer);
    const appLayoutViewContainer = ref(null);
    return {
      loading,
      tours,
      appLayoutViewContainer
    };
  }
};
</script>

<style scoped lang="scss" src="./styles/layout.scss"></style>
