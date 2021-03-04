<template>
  <div class="app-layout">
    <AppHeader />
    <div class="view-container">
      <BIMDataSpinner class="view-container__loader" v-if="loading" />
      <router-view v-else></router-view>
    </div>
  </div>
</template>

<script>
import { contextIDs, useLoadingContext } from "@/state/loading";
// Components
import BIMDataSpinner from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSpinner.js";
import AppHeader from "@/components/specific/app/app-header/AppHeader";

export default {
  components: {
    BIMDataSpinner,
    AppHeader
  },
  setup() {
    const loading = useLoadingContext(contextIDs.viewContainer);

    return {
      loading
    };
  }
};
</script>

<style scoped lang="scss" src="./styles/layout.scss"></style>
