<template>
  <div class="app-layout">
    <template v-if="tourToDisplay">
      <!-- <BIMDataGuidedTour
        :locale="$i18n.locale"
        :tours="tours"
        :tourToDisplay="tourToDisplay"
        :elementToObserve="appLayoutViewContainer"
        @set-completed-tour="setTourCompleted($event)"
      /> -->
    </template>
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
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { isEmpty } from "lodash";
import { useUser } from "@/state/user.js";
import { tours } from "./config/guidedTour/tours.js";
import { TOURS_NAME } from "@/config/guidedTour/tours.js";
import { contexts, useLoadingContext } from "@/composables/loading.js";
import routeNames from "@/router/route-names.js";

// Components
import AppHeader from "@/components/specific/app/app-header/AppHeader.vue";
import AppNotification from "@/components/specific/app/app-notification/AppNotification.vue";

export default {
  components: {
    AppHeader,
    AppNotification
  },
  setup() {
    const router = useRouter();
    const loading = useLoadingContext(contexts.viewContainer);
    const appLayoutViewContainer = ref(null);
    const { loadGuidedTours, setTourCompleted, completedTours } = useUser();
    const tourToDisplay = ref(null);

    const toursHandler = () => {
      const currentRoute = router.currentRoute.value.name;
      const platformIntro = completedTours.value.find(
        tour => tour.name === TOURS_NAME.PLATFORM_INTRO
      );

      if (!platformIntro && currentRoute === routeNames.dashboard) {
        tourToDisplay.value = TOURS_NAME.PLATFORM_INTRO;
      }
    };

    watch(router.currentRoute, () => toursHandler());

    onMounted(async () => {
      const tours = await loadGuidedTours();
      if (isEmpty(tours)) {
        toursHandler();
      }
    });

    return {
      tours,
      loading,
      tourToDisplay,
      appLayoutViewContainer,
      setTourCompleted
    };
  }
};
</script>

<style scoped lang="scss" src="./styles/layout.scss"></style>
