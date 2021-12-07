<template>
  <div class="subscribe-card" :class="`subscribe-card--${layout}`">
    <div class="subscribe-card__start">
      <SubscribeCardImage />
    </div>
    <div class="subscribe-card__center">
      <div class="subscribe-card__center__title">
        {{ $t("SubscribeCard.title") }}
      </div>
      <div class="subscribe-card__center__text">
        {{ $t("SubscribeCard.text", { size }) }}
      </div>
    </div>
    <div class="subscribe-card__end">
      <BIMDataButton
        width="228px"
        height="48px"
        color="secondary"
        fill
        radius
        @click="goToSubscribe"
      >
        <BIMDataIcon name="plus" size="xxs" margin="0 9px 0 0" />
        <span>{{ $t("SubscribeCard.button") }}</span>
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { PRO_PLAN_STORAGE } from "@/config/subscription.js";
import routeNames from "@/router/route-names.js";
import { formatBytes } from "@/utils/files.js";

export default {
  props: {
    layout: {
      type: String,
      default: "horizontal",
      validator: value => ["horizontal", "vertical"].includes(value)
    }
  },
  setup() {
    const router = useRouter();

    const size = formatBytes(PRO_PLAN_STORAGE);

    const goToSubscribe = () => {
      router.push({ name: routeNames.subscribe });
    };

    return {
      // References
      size,
      // Methods
      goToSubscribe
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscribeCard.scss"></style>
