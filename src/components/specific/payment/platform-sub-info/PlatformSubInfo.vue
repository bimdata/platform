<template>
  <div class="platform-sub-info">
    <img
      class="heading"
      src="/static/platform-sub-info-heading.svg"
      alt="BIMData Platform"
    />
    <h1 class="title">
      {{ $t("PlatformSubInfo.title") }}
    </h1>
    <h3 class="sub-title">
      {{ $t("PlatformSubInfo.subTitle") }}
    </h3>
    <div class="price">
      <span> {{ unitPrice }}{{ currency }} </span>
      <span>{{ $t("PlatformSubInfo.priceUnit") }}</span>
    </div>
    <div class="bullet-list">
      <div class="bullets-head">
        {{ $t("PlatformSubInfo.bulletsHead") }}
      </div>
      <div class="bullet" v-for="bullet of bullets" :key="bullet">
        <img src="/static/platform-sub-info-bullet-mark.svg" />
        {{ $t(`PlatformSubInfo.${bullet}`) }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { usePaddle } from "@/composables/paddle.js";

const bullets = [
  "bullet1",
  "bullet2",
  "bullet3",
  "bullet4",
  "bullet5",
  "bullet6",
  "bullet7",
  "bullet8",
  "bullet9",
  "bullet10"
];

export default {
  setup() {
    const { getPlatformPrice } = usePaddle();

    const unitPrice = ref(0);
    const currency = ref("");

    // Get localized platform subscription price from Paddle
    getPlatformPrice().then(({ price, currency: curr }) => {
      unitPrice.value = price;
      currency.value = curr;
    });

    return {
      // References
      bullets,
      currency,
      unitPrice
    };
  }
};
</script>

<style scoped lang="scss" src="./PlatformSubInfo.scss"></style>
