<template>
  <div class="billing-actions-cell" v-click-away="closeMenu">
    <BIMDataButton
      class="billing-actions-cell__btn"
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
        class="billing-actions-cell__menu"
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
import { useRouter } from "vue-router";
import { useToggle } from "../../../../../composables/toggle.js";
import { SUB_STATUS } from "../../../../../config/subscription.js";
import routeNames from "../../../../../router/route-names.js";

export default {
  props: {
    subscription: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();

    const {
      isOpen: showMenu,
      close: closeMenu,
      toggle: toggleMenu
    } = useToggle();

    const goToSubscriptionDatapack = () => {
      router.push({
        name: routeNames.subscriptionDatapack,
        query: {
          space: props.subscription.cloud?.id
        }
      });
    };

    const openUpdateUrl = () => {
      window.open(props.subscription.update_url);
    };

    const openCancelUrl = () => {
      window.open(props.subscription.cancel_url);
    };

    const menuItems = [];

    if (props.subscription.status === SUB_STATUS.ACTIVE) {
      menuItems.push({
        key: 1,
        text: "BillingActionsCell.datapackButtonText",
        action: goToSubscriptionDatapack,
        color: "var(--color-primary)"
      });
    }

    menuItems.push({
      key: 2,
      text: "BillingActionsCell.updateButtonText",
      action: openUpdateUrl,
      color: "var(--color-primary)"
    });
    menuItems.push({
      key: 3,
      text: "BillingActionsCell.cancelButtonText",
      action: openCancelUrl,
      color: "var(--color-high)",
      background: "var(--color-high-lighter)"
    });

    return {
      // References
      showMenu,
      SUB_STATUS,
      menuItems,
      // Methods
      closeMenu,
      goToSubscriptionDatapack,
      openCancelUrl,
      openUpdateUrl,
      toggleMenu
    };
  }
};
</script>

<style scoped lang="scss" src="./BillingActionsCell.scss"></style>
