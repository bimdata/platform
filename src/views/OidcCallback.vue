<template>
  <div>OIDC Callback view</div>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOidcState } from '@/state/oidcState';

export default {
  setup() {
    const router = useRouter();
    const { oidcSignInCallback } = useOidcState();

    onMounted(() => {
      oidcSignInCallback()
        .then((redirectPath) => {
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
