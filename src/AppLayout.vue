<template>
  <div class="app-layout">
    <template v-if="isGuidedTourEnabled && tourToDisplay">
      <BIMDataGuidedTour
        :locale="$i18n.locale"
        :tours="tours"
        :tourToDisplay="tourToDisplay"
        :elementToObserve="viewContainer"
        @set-completed-tour="setGuidedTourComplete"
      />
    </template>

    <AppModal />
    <AppNotification />
    <AppSidePanel />

    <AppHeader />
    <div
      ref="viewContainer"
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
import { onMounted, provide, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { contexts, useLoadingContext } from "./composables/loading.js";
import {
  IS_GUIDED_TOUR_ENABLED,
  TOUR_NAMES,
  tours
} from "./config/guided-tour.js";
import routeNames from "./router/route-names.js";
import { useUser } from "./state/user.js";

// Components
import AppHeader from "./components/specific/app/app-header/AppHeader.vue";
import AppModal from "./components/specific/app/app-modal/AppModal.vue";
import AppNotification from "./components/specific/app/app-notification/AppNotification.vue";
import AppSidePanel from "./components/specific/app/app-side-panel/AppSidePanel.vue";

export default {
  components: {
    AppHeader,
    AppModal,
    AppNotification,
    AppSidePanel
  },
  setup() {
    const router = useRouter();
    const loading = useLoadingContext(contexts.viewContainer);
    const { loadGuidedTours, setGuidedTourComplete, isGuidedTourComplete } =
      useUser();

    const viewContainer = ref(null);
    provide("viewContainer", viewContainer);

    const tourToDisplay = ref(null);

    onMounted(async () => {
      await loadGuidedTours();

      watch(
        router.currentRoute,
        route => {
          if (
            !isGuidedTourComplete(TOUR_NAMES.PLATFORM_INTRO) &&
            route.name === routeNames.dashboard
          ) {
            tourToDisplay.value = TOUR_NAMES.PLATFORM_INTRO;
          }
        },
        { immediate: true }
      );
    });

    return {
      // References
      isGuidedTourEnabled: IS_GUIDED_TOUR_ENABLED,
      loading,
      tours,
      tourToDisplay,
      viewContainer,
      // Methods
      setGuidedTourComplete
    };
  }
};
</script>

<style scoped lang="scss" src="./styles/layout.scss"></style>
