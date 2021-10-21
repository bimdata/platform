<template>
  <div class="platform-subscription__content__plans">
    <h2>{{ $t("OurPlans.ourPlansTitle") }}</h2>
    <div class="flex">
      <BIMDataCard class="p-y-12">
        <template #content>
          <h4>{{ $t("OurPlans.freePlanTitle") }}</h4>
          <h3 class="text-center">
            {{ $t("OurPlans.freePlanPrice") }} <span>*</span>
          </h3>
          <BIMDataButton color="primary" fill radius width="185px">
            {{ $t("OurPlans.freePlanButton") }}
          </BIMDataButton>
          <p class="m-t-24">* {{ $t("OurPlans.freePlanBaseline") }}</p>
        </template>
      </BIMDataCard>
      <BIMDataCard class="p-y-12" bgColor="primary">
        <template #content>
          <h4>{{ $t("OurPlans.professionalPlanTitle") }}</h4>
          <h3 class="text-center">
            45€ <span>{{ $t("OurPlans.professionalPlanPrice") }}</span
            >**
          </h3>
          <BIMDataButton
            color="secondary"
            fill
            radius
            width="185px"
            @click="goToPayment"
          >
            {{ $t("OurPlans.professionalPlanButton") }}
          </BIMDataButton>
          <p class="m-t-24">** {{ $t("OurPlans.professionalPlanBaseline") }}</p>
        </template>
      </BIMDataCard>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router/index.js";

export default {
  setup() {
    const router = useRouter();

    const goToPayment = () => {
      router.push({ name: routeNames.payment });
    };

    return {
      // Methods
      goToPayment
    };
  }
};
</script>

<style scoped lang="scss" src="./OurPlans.scss"></style>
