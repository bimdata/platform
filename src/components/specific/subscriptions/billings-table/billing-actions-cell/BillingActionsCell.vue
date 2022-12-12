<template>
  <div class="billing-actions-cell" v-click-away="closeMenu">
    <BIMDataButton
      class="billing-actions-cell__btn"
      ripple
      rounded
      icon
      @click="toggleMenu"
    >
      <BIMDataIcon name="ellipsis" size="l" fill color="granite-light" />
    </BIMDataButton>

    <transition name="fade">
      <div class="billing-actions-cell__menu" v-show="showMenu">
        <BIMDataButton
          v-if="subscription.status === SUB_STATUS.ACTIVE"
          ghost
          squared
          @click="goToSubscriptionDatapack"
        >
          {{ $t("BillingActionsCell.datapackButtonText") }}
        </BIMDataButton>
        <BIMDataButton ghost squared @click="openUpdateUrl">
          {{ $t("BillingActionsCell.updateButtonText") }}
        </BIMDataButton>
        <BIMDataButton color="high" ghost squared @click="openCancelUrl">
          {{ $t("BillingActionsCell.cancelButtonText") }}
        </BIMDataButton>
      </div>
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

    return {
      // References
      showMenu,
      SUB_STATUS,
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
