<template>
  <BIMDataCard class="pro-plan-card">
    <template #content>
      <div class="pro-plan-card__title">
        {{ $t("ProPlanCard.title") }}
      </div>
      <div class="pro-plan-card__price">
        {{ proPlanPrice }} {{ $t("ProPlanCard.priceUnit") }}
      </div>
      <div class="pro-plan-card__separator"></div>
      <div class="pro-plan-card__bullets">
        <div class="pro-plan-card__bullets__bullet size">
          <BulletMarkImage />
          <span>{{ size }}</span>
        </div>
        <div class="pro-plan-card__bullets__bullet">
          <BulletMarkImage />
          <span>{{ $t("ProPlanCard.bullet2") }}</span>
        </div>
        <div class="pro-plan-card__bullets__bullet">
          <BulletMarkImage />
          <span>{{ $t("ProPlanCard.bullet3") }}</span>
        </div>
      </div>
      <BIMDataButton
        width="240px"
        color="secondary"
        fill
        radius
        @click="goToSubscriptionPro"
      >
        {{ $t("ProPlanCard.buttonText") }}
      </BIMDataButton>
      <div class="pro-plan-card__note">
        {{ $t("ProPlanCard.note", { price: datapackPrice }) }}
      </div>
    </template>
  </BIMDataCard>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usePaddle } from "../../../../composables/paddle.js";
import { PRO_PLAN_STORAGE } from "../../../../config/subscription.js";
import routeNames from "../../../../router/route-names.js";
import { formatBytes } from "../../../../utils/files.js";

export default {
  setup() {
    const router = useRouter();
    const { getProPlanPrice, getDatapackPrice } = usePaddle();

    const proPlanPrice = ref(0);
    const datapackPrice = ref(0);
    const size = formatBytes(PRO_PLAN_STORAGE);

    getProPlanPrice().then(({ price, currency }) => {
      proPlanPrice.value = `${price}${currency}`;
    });
    getDatapackPrice().then(({ price, currency }) => {
      datapackPrice.value = `${price}${currency}`;
    });

    const goToSubscriptionPro = () => {
      router.push({ name: routeNames.subscriptionPro });
    };

    return {
      // References
      datapackPrice,
      proPlanPrice,
      size,
      // Methods
      goToSubscriptionPro
    };
  }
};
</script>

<style scoped lang="scss" src="./ProPlanCard.scss"></style>
