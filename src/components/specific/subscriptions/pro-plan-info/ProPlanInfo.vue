<template>
  <div class="pro-plan-info">
    <img
      class="pro-plan-info__heading"
      src="/static/platform-heading.svg"
      alt="BIMData Platform"
    />
    <h1 class="pro-plan-info__title">
      {{ $t("ProPlanInfo.title") }}
    </h1>
    <h3 class="pro-plan-info__sub-title">
      {{ $t("ProPlanInfo.subTitle") }}
    </h3>
    <div class="pro-plan-info__price">
      <span class="pro-plan-info__price__value">
        {{ proPlanPrice }}
      </span>
      <span class="pro-plan-info__price__unit">
        {{ $t("ProPlanInfo.priceUnit") }}
      </span>
    </div>
    <div class="pro-plan-info__bullets">
      <div class="pro-plan-info__bullets__head">
        {{ $t("ProPlanInfo.bulletsHead") }}
      </div>
      <div class="pro-plan-info__bullets__bullet">
        <img src="/static/bullet-mark.svg" />
        {{ $t("ProPlanInfo.bullet1", { size }) }}
      </div>
      <div
        class="pro-plan-info__bullets__bullet"
        v-for="i of [2, 3, 4, 5, 6, 7, 8, 9, 10]"
        :key="i"
      >
        <img src="/static/bullet-mark.svg" />
        {{ $t(`ProPlanInfo.bullet${i}`) }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { usePaddle } from "@/composables/paddle.js";
import { PRO_PLAN_STORAGE } from "@/config/subscription.js";
import { formatBytes } from "@/utils/files.js";

export default {
  setup() {
    const { getProPlanPrice } = usePaddle();

    const proPlanPrice = ref(0);
    const size = formatBytes(PRO_PLAN_STORAGE);

    // Get localized pro plan price from Paddle
    getProPlanPrice().then(({ price, currency }) => {
      proPlanPrice.value = `${price}${currency}`;
    });

    return {
      // References
      proPlanPrice,
      size
    };
  }
};
</script>

<style scoped lang="scss" src="./ProPlanInfo.scss"></style>
