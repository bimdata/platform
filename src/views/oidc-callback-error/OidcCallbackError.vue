<template>
  <div data-test-id="view-oidc-callback-error" class="view oidc-callback-error">
    <h1>{{ $t("OidcCallbackError.message") }}</h1>
    <BIMDataButton fill radius color="primary" @click="goToRoot">
      {{ $t("OidcCallbackError.retryButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import routeNames from "../../router/route-names.js";

export default {
  setup() {
    const router = useRouter();

    const goToRoot = () => {
      router.push({ name: routeNames.root });
    };

    return {
      goToRoot
    };
  }
};
</script>

<style scoped lang="scss" src="./OidcCallbackError.scss"></style>
