<template>
  <div class="file-actions-cell">
    <BIMDataButton
      class="file-actions-cell__btn"
      ripple
      rounded
      icon
      @click="() => {}"
    >
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>

    <transition name="fade">
      <div class="file-actions-cell__menu">
        <!-- TODO -->
      </div>
    </transition>
  </div>
</template>

<script>
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  }
};
</script>

<style scoped lang="scss" src="./FileActionsCell.scss"></style>
