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

    <AppSidebar />
    <div class="app-layout__main">
      <div v-if="hasHeaderAction" class="app-layout__header-action">
        <AppSlot name="app-header-action" />
      </div>
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
  </div>
</template>

<script>
import { computed, onMounted, provide, ref, watch } from "vue";
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
import AppSidebar from "./components/specific/app/app-sidebar/AppSidebar.vue";
import AppModal from "./components/specific/app/app-modal/AppModal.vue";
import AppNotification from "./components/specific/app/app-notification/AppNotification.vue";
import AppSidePanel from "./components/specific/app/app-side-panel/AppSidePanel.vue";
import AppSlot from "./components/specific/app/app-slot/AppSlot.js";
import { useAppSlot } from "./components/specific/app/app-slot/app-slot.js";

export default {
  components: {
    AppSidebar,
    AppModal,
    AppNotification,
    AppSidePanel,
    AppSlot
  },
  setup() {
    const router = useRouter();
    const loading = useLoadingContext(contexts.viewContainer);
    const { loadGuidedTours, setGuidedTourComplete, isGuidedTourComplete } =
      useUser();

    const viewContainer = ref(null);
    provide("viewContainer", viewContainer);

    const headerActionSlot = useAppSlot("app-header-action");
    const hasHeaderAction = computed(() => Boolean(headerActionSlot.value));

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
      hasHeaderAction,
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
