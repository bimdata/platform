<template>
  <div class="dashboard-subscription-platform">
    <h2>{{ $t("Dashboard.platformProButtonTitle") }}</h2>
    <div>
      <div class="m-t-18 flex items-center">
        <p>{{ $t("Dashboard.paymentInformationText") }}</p>
        <BIMDataButton
          width="100px"
          color="primary"
          ghost
          radius
          class="m-l-12"
          @click="goToPlatformSubscription"
          >Voir mon abonnement</BIMDataButton
        >
      </div>
      <div class="flex items-center">
        <p class="m-r-6">{{ $t("Dashboard.nextPaymentText") }}</p>
        <strong>10/10/2021</strong>
      </div>
    </div>
    <BIMDataButton class="dashboard-subscription-platform__btn">
      <span @click="goToPaddlePayment">{{ $t("Dashboard.platformProButtonText") }}</span>
      <BIMDataIcon class="arrow-icon" name="arrow" size="xs" margin="0 0 0 12px" :rotate="180" />
    </BIMDataButton>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router";

export default {
  setup() {
    const router = useRouter();
    const goToPlatformSubscription = () => {
      router.push({ name: routeNames.platformSubscription });
    };

    const goToPaddlePayment = () => {
      router.push({ name: routeNames.paddlePayment });
    };

    return {
      goToPlatformSubscription,
      goToPaddlePayment,
    };
  },
};
</script>

<style scoped lang="scss" src="./DashboardSubscriptionPlatform.scss"></style>
