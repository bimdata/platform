<template>
  <div ref="appLayout" class="app-layout">
    <BIMDataGuidedTour :inputSteps="steps" :elementToObserve="appLayout" />
    <AppNotification />
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
import { ref } from "vue";
import { contexts, useLoadingContext } from "@/composables/loading.js";
// Components
import AppHeader from "@/components/specific/app/app-header/AppHeader.vue";
import AppNotification from "@/components/specific/app/app-notification/AppNotification.vue";
import steps from "./config/guidedTour.js";

export default {
  components: {
    AppHeader,
    AppNotification
  },
  setup() {
    const loading = useLoadingContext(contexts.viewContainer);
    const appLayout = ref(null);
    return {
      loading,
      steps,
      appLayout
    };
  }
};
</script>

<style scoped lang="scss" src="./styles/layout.scss"></style>
