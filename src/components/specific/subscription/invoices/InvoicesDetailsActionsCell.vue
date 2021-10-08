<template>
  <div class="invoice-actions-cell" v-click-away="closeMenu">
    <BIMDataButton
      v-if="invoice.receipt_url"
      class="invoice-actions-cell__btn"
      ripple
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIcon name="ellipsis" size="l" />
    </BIMDataButton>

    <transition name="fade">
      <div class="invoice-actions-cell__menu" v-show="showMenu">
        <a
          :href="invoice.receipt_url"
          target="_blank"
          class="
            bimdata-btn bimdata-btn__ghost bimdata-btn__ghost--default
            invoice-actions-cell__menu__btn
          "
        >
          Télécharger la facture</a
        >
      </div>
    </transition>
  </div>
</template>

<script>
import { useToggle } from "@/composables/toggle";

export default {
  props: {
    invoice: {
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

<style scoped lang="scss" src="./InvoiceDetailsActionsCell.scss"></style>
