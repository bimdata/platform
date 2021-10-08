<template>
  <div class="billing-actions-cell" v-click-away="closeMenu">
    <BIMDataButton
      class="billing-actions-cell__btn"
      ripple
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>

    <transition name="fade">
      <div class="billing-actions-cell__menu" v-show="showMenu">
        <a
          :href="billing.update_url"
          class="
            bimdata-btn bimdata-btn__ghost bimdata-btn__ghost--default
            billing-actions-cell__menu__btn
          "
        >
          {{ $t("BillingDetailsActionsCell.updateUrl") }}</a
        >
        <a
          :href="billing.cancel_url"
          class="
            bimdata-btn bimdata-btn__ghost bimdata-btn__ghost--high
            billing-actions-cell__menu__btn
          "
        >
          {{ $t("BillingDetailsActionsCell.cancelUrl") }}</a
        >
      </div>
    </transition>
  </div>
</template>

<script>
import { useToggle } from "@/composables/toggle";

export default {
  props: {
    billing: {
      type: Object,
      required: true
    }
  },
  setup() {
    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    return {
      // References
      showMenu,
      // Methods
      closeMenu,
      toggleMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./BillingDetailsActionsCell.scss"></style>
