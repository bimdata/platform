<template>
  <div class="pro-plan-info" :class="`pro-plan-info--${layout}`">
    <div class="pro-plan-info__head">
      <ProPlanInfoHeadingImage />
      <h1 class="pro-plan-info__title">
        {{ $t("ProPlanInfo.title") }}
      </h1>
      <h3 class="pro-plan-info__sub-title">
        {{ $t("ProPlanInfo.subTitle") }}
      </h3>
      <div class="pro-plan-info__price">
        <span class="value">
          {{ proPlanPrice }}
        </span>
        <span class="unit">
          {{ $t("ProPlanInfo.priceUnit") }}
        </span>
      </div>
    </div>
    <div class="pro-plan-info__bullets">
      <div class="pro-plan-info__bullets__head">
        {{ $t("ProPlanInfo.bulletsHead") }}
      </div>
      <div class="pro-plan-info__bullets__bullet">
        <BulletMarkImage />
        {{ $t("ProPlanInfo.bullet1", { size }) }}
      </div>
      <div
        class="pro-plan-info__bullets__bullet"
        v-for="i of [2, 3, 4, 5, 6, 7, 8, 9, 10]"
        :key="i"
      >
        <BulletMarkImage />
        {{ $t(`ProPlanInfo.bullet${i}`) }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { usePaddle } from "../../../../composables/paddle.js";
import { PRO_PLAN_STORAGE } from "../../../../config/subscription.js";
import { formatBytes } from "../../../../utils/files.js";

export default {
  props: {
    layout: {
      type: String,
      default: "vertical",
      validator: value => ["horizontal", "vertical"].includes(value)
    }
  },
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
