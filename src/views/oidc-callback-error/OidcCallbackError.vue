<template>
  <div class="oidc-callback-error-view">
    <h1>{{ $t("OidcCallbackError.message") }}</h1>
    <BIMDataButton fill radius color="primary" @click="goToRoot">
      {{ $t("OidcCallbackError.tryAgainButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";

export default {
  components: {
    BIMDataButton
  },
  setup() {
    const router = useRouter();

    const goToRoot = () => router.push({ name: routeNames.root });

    return {
      goToRoot
    };
  }
};
</script>

<style scoped lang="scss" src="./OidcCallbackError.scss"></style>
