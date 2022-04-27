<template>
  <div class="app-layout">
    <template v-if="tourToDisplay">
      <BIMDataGuidedTour
        :tours="tours"
        :tourToDisplay="tourToDisplay"
        :elementToObserve="appLayoutViewContainer"
        @set-completed-tour="setTourCompleted($event)"
      />
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
import { ref, onMounted } from "vue";
import { contexts, useLoadingContext } from "@/composables/loading.js";
// Components
import AppHeader from "@/components/specific/app/app-header/AppHeader.vue";
import AppNotification from "@/components/specific/app/app-notification/AppNotification.vue";
import { useUser } from "@/state/user.js";
import { tours } from "./config/guidedTour/tours.js";
import { TOURS_NAME } from "@/config/guidedTour/tours.js";

export default {
  components: {
    AppHeader,
    AppNotification
  },
  setup() {
    const loading = useLoadingContext(contexts.viewContainer);
    const appLayoutViewContainer = ref(null);
    const { loadGuidedTours, setTourCompleted } = useUser();
    const tourToDisplay = ref(null);

    onMounted(async () => {
      const guidedTours = await loadGuidedTours();
      const platformIntro = guidedTours.find(
        tour => tour.name === TOURS_NAME.PLATFORM_INTRO
      );

      if (!platformIntro) {
        tourToDisplay.value = TOURS_NAME.PLATFORM_INTRO;
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
