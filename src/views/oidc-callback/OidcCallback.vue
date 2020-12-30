<template>
  <div class="oidc-callback-view">
    OIDC Callback view
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { setupApiClient } from '@/api';
import { useOidcState } from '@/state/oidcState';

export default {
  setup() {
    const { oidcSignInCallback, oidcAccessToken } = useOidcState();
    const router = useRouter();

    onMounted(() => {
      oidcSignInCallback()
        .then((redirectPath) => {
          setupApiClient(oidcAccessToken.value);
          router.push(redirectPath);
        })
        .catch((err) => {
          console.error(err);
          router.push('/oidc-callback-error');
        });
    });
  }
}
</script>
