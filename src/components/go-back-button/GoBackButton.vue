<template>
  <BIMDataButton ghost radius class="go-back-button" @click="$router.back()">
    <BIMDataIcon name="arrow" size="xxs" />
    <span>{{ $t("Breadcrumb.back") }}</span>
  </BIMDataButton>
</template>

<script>
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  }
};
</script>

<style scoped lang="scss" src="./GoBackButton.scss"></style>
