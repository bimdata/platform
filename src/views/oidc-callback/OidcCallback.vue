<template>
  <div class="oidc-callback-view">
    OIDC Callback view
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalState } from '@/state/globalState';

export default {
  setup() {
    const router = useRouter();
    const { signInCallback } = useGlobalState();

    onMounted(() => {
      signInCallback().then(result => {
        router.push({ path: result.state ? result.state : '/' });
      });
    });
  }
}
</script>
