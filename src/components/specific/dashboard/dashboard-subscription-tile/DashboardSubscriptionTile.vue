<template>
  <div class="dashboard-subscription-tile">
    <h2>{{ $t("DashboardSubscriptionTile.title") }}</h2>
    <div>
      <div class="m-t-18 flex items-center">
        <p>
          {{ $t("DashboardSubscriptionTile.paymentInfoText") }}
        </p>
        <BIMDataButton
          class="m-l-12"
          width="100px"
          color="primary"
          ghost
          radius
          @click="goToUserSubscriptions"
        >
          {{ $t("DashboardSubscriptionTile.paymentInfoButtonText") }}
        </BIMDataButton>
      </div>
      <div class="flex items-center">
        <p class="m-r-6">
          {{ $t("DashboardSubscriptionTile.nextPaymentDate") }}
        </p>
        <strong>
          <!-- TODO: make this dynamic -->
          10/10/2021
        </strong>
      </div>
    </div>
    <BIMDataButton
      class="dashboard-subscription-tile__btn"
      height="16px"
      @click="goToSubscriptionPlatform"
    >
      <span>
        {{ $t("DashboardSubscriptionTile.subscribeButtonText") }}
      </span>
      <BIMDataIcon
        class="arrow-icon"
        name="arrow"
        size="xs"
        margin="0 0 0 12px"
        :rotate="180"
      />
    </BIMDataButton>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router/index.js";

export default {
  setup() {
    const router = useRouter();

    const goToUserSubscriptions = () => {
      router.push({ name: routeNames.userSubscriptions });
    };

    const goToSubscriptionPlatform = () => {
      router.push({ name: routeNames.subscriptionPlatform });
    };

    return {
      // Methods
      goToSubscriptionPlatform,
      goToUserSubscriptions
    };
  }
};
</script>

<style scoped lang="scss" src="./DashboardSubscriptionTile.scss"></style>
