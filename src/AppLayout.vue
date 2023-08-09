<template>
  <div class="app-layout">
    <template v-if="isGuidedTourEnabled && tourToDisplay">
      <BIMDataGuidedTour
        :locale="$i18n.locale"
        :tours="tours"
        :tourToDisplay="tourToDisplay"
        :elementToObserve="viewContainer"
        @set-completed-tour="setTourCompleted"
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
import isEmpty from "lodash/isEmpty";
import { onMounted, provide, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { contexts, useLoadingContext } from "./composables/loading.js";
import {
  IS_GUIDED_TOUR_ENABLED,
  TOURS_NAME,
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
    const { loadGuidedTours, setTourCompleted, completedTours } = useUser();

    const viewContainer = ref(null);
    provide("viewContainer", viewContainer);

    const tourToDisplay = ref(null);

    const setTourToDisplay = () => {
      const currentRoute = router.currentRoute.value.name;
      const platformIntroCompleted = completedTours.value.some(
        tour => tour.name === TOURS_NAME.PLATFORM_INTRO
      );

      if (!platformIntroCompleted && currentRoute === routeNames.dashboard) {
        tourToDisplay.value = TOURS_NAME.PLATFORM_INTRO;
      }
    };

    watch(router.currentRoute, () => setTourToDisplay());

    onMounted(async () => {
      const tours = await loadGuidedTours();
      if (isEmpty(tours)) {
        setTourToDisplay();
      }
    });

    return {
      // References
      isGuidedTourEnabled: IS_GUIDED_TOUR_ENABLED,
      loading,
      tours,
      tourToDisplay,
      viewContainer,
      // Methods
      setTourCompleted
    };
  }
};
</script>

<style scoped lang="scss" src="./styles/layout.scss"></style>
