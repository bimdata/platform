<template>
  <div class="oidc-callback-view">
    <BIMDataBigSpinner width="88" height="146" />
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/state/auth";
// Components
import BIMDataBigSpinner from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataBigSpinner.js";

export default {
  components: {
    BIMDataBigSpinner
  },
  setup() {
    const router = useRouter();
    const { signInCallback } = useAuth();

    onMounted(() => {
      signInCallback().then(result =>
        router.push({ path: result.state ? result.state : "/" })
      );
    });
  }
};
</script>

<style scoped lang="scss" src="./OidcCallback.scss"></style>
