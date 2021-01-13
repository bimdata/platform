<template>
  <BIMDataButton ghost radius
    class="go-back-btn"
    @click="goBack">
    <BIMDataIcon name="arrow" size="xxxs" />
    <span>{{ $t('Header.back') }}</span>
  </BIMDataButton>
</template>

<script>
import { useRouter } from 'vue-router';
// Components
import BIMDataButton from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js';
import BIMDataIcon from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js';

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  setup() {
    const router = useRouter();
    const goBack = () => router.currentRoute.name !== 'root' && router.back();
    return {
      goBack
    };
  }
}
</script>

<style scoped lang="scss" src="./GoBackButton"></style>
