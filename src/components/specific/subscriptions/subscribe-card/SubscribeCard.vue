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
      <AppLink :to="{ name: routeNames.subscribe }">
        <BIMDataButton
          width="228px"
          height="48px"
          color="secondary"
          fill
          radius
        >
          <BIMDataIcon name="plus" size="xxs" margin="0 9px 0 0" />
          <span>{{ $t("SubscribeCard.button") }}</span>
        </BIMDataButton>
      </AppLink>
    </div>
  </div>
</template>

<script>
import { PRO_PLAN_STORAGE } from "@/config/subscription.js";
import routeNames from "@/router/route-names.js";
import { formatBytes } from "@/utils/files.js";
// Components
import AppLink from "@/components/specific/app/app-link/AppLink.vue";

export default {
  components: {
    AppLink
  },
  props: {
    layout: {
      type: String,
      default: "horizontal",
      validator: value => ["horizontal", "vertical"].includes(value)
    }
  },
  setup() {
    const size = formatBytes(PRO_PLAN_STORAGE);

    return {
      // References
      routeNames,
      size
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscribeCard.scss"></style>
