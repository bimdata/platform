<template>
  <div class="invoice-actions-cell" v-click-away="closeMenu">
    <BIMDataButton
      class="invoice-actions-cell__btn"
      ripple
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIcon name="ellipsis" size="l" fill color="granite-light" />
    </BIMDataButton>

    <transition name="fade">
      <div class="invoice-actions-cell__menu" v-show="showMenu">
        <BIMDataButton
          v-if="payment.receipt_url"
          ghost
          squared
          @click="openReceiptUrl"
        >
          {{ $t("InvoiceActionsCell.downloadButton") }}
        </BIMDataButton>
        <BIMDataButton
          v-if="payment.subscription.status !== SUB_STATUS.DELETED"
          ghost
          squared
          @click="openUpdateUrl"
        >
          {{ $t("BillingActionsCell.updateButtonText") }}
        </BIMDataButton>
      </div>
    </transition>
  </div>
</template>

<script>
import { useToggle } from "../../../../../composables/toggle.js";
import { SUB_STATUS } from "../../../../../config/subscription.js";

export default {
  props: {
    payment: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    const openReceiptUrl = () => {
      window.open(props.payment.receipt_url);
    };

    const openUpdateUrl = () => {
      window.open(props.payment.subscription.update_url);
    };

    return {
      // References
      showMenu,
      SUB_STATUS,
      // Methods
      closeMenu,
      openReceiptUrl,
      openUpdateUrl,
      toggleMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./InvoiceActionsCell.scss"></style>
