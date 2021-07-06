<template>
  <div data-test="oidc-callback" class="view oidc-callback">
    <BIMDataBigSpinner width="88" height="146" />
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import PlatformService from "@/server/PlatformService";
import { useAuth } from "@/state/auth";

export default {
  setup() {
    const router = useRouter();
    const { signInCallback } = useAuth();

    onMounted(async () => {
      const result = await signInCallback();
      await PlatformService.loginCallback();
      router.push({ path: result.state ? result.state : "/" });
    });
  }
};
</script>

<style scoped lang="scss" src="./OidcCallback.scss"></style>
