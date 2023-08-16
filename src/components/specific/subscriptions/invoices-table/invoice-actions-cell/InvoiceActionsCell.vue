<template>
  <div class="invoice-actions-cell" v-click-away="closeMenu">
    <BIMDataButton
      class="invoice-actions-cell__btn"
      ripple
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIconEllipsis size="l" fill color="granite-light" />
    </BIMDataButton>

    <transition name="fade">
      <BIMDataMenu
        :menuItems="menuItems"
        class="invoice-actions-cell__menu"
        v-show="showMenu"
      >
        <template #item="{ item }">
          <span>{{ $t(item.text) }}</span>
        </template>
      </BIMDataMenu>
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

    const menuItems = [];
    if (props.payment.receipt_url) {
      menuItems.push({
        key: 1,
        text: "InvoiceActionsCell.downloadButton",
        action: openReceiptUrl,
        color: "var(--color-primary)"
      });
    }

    if (props.payment.subscription.status !== SUB_STATUS.DELETED) {
      menuItems.push({
        key: 2,
        text: "BillingActionsCell.updateButtonText",
        action: openUpdateUrl,
        color: "var(--color-primary)"
      });
    }

    return {
      // References
      showMenu,
      SUB_STATUS,
      menuItems,
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
