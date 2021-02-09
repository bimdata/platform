<template>
  <div class="platform-layout">
    <PlatformHeader />
    <div class="view-container">
      <BIMDataSpinner class="loader" v-if="loading" />

      <router-view v-else></router-view>
    </div>
  </div>
</template>

<script>
import { contextIDs, useLoadingContext } from "@/state/loading";
// Components
import BIMDataSpinner from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSpinner.js";
import PlatformHeader from "@/components/platform-header/PlatformHeader";

export default {
  components: {
    BIMDataSpinner,
    PlatformHeader
  },
  setup() {
    return {
      loading: useLoadingContext(contextIDs.viewContainer)
    };
  }
};
</script>

<style scoped lang="scss" src="./styles/layout.scss"></style>
