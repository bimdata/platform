<template>
  <BIMDataCard class="free-plan-card">
    <template #content>
      <div class="free-plan-card__title">
        {{ $t("FreePlanCard.title") }}
      </div>
      <div class="free-plan-card__price">
        {{ $t("FreePlanCard.price") }}
      </div>
      <div class="free-plan-card__separator"></div>
      <div class="free-plan-card__bullets">
        <div class="free-plan-card__bullets__bullet size">
          <img src="/static/bullet-mark.svg" />
          <span>{{ size }}</span>
        </div>
        <div class="free-plan-card__bullets__bullet">
          <img src="/static/bullet-mark.svg" />
          <span>{{ $t("FreePlanCard.bullet2") }}</span>
        </div>
        <div class="free-plan-card__bullets__bullet">
          <img src="/static/bullet-mark.svg" />
          <span>{{ $t("FreePlanCard.bullet3") }}</span>
        </div>
      </div>
      <BIMDataButton
        width="240px"
        color="primary"
        fill
        radius
        @click="goToSubscriptionFree"
      >
        {{ $t("FreePlanCard.buttonText") }}
      </BIMDataButton>
      <div class="free-plan-card__note">
        {{ $t("FreePlanCard.note") }}
      </div>
    </template>
  </BIMDataCard>
</template>

<script>
import { useRouter } from "vue-router";
import { FREE_PLAN_STORAGE } from "@/config/subscription.js";
import routeNames from "@/router/route-names.js";
import { formatBytes } from "@/utils/files.js";

export default {
  setup() {
    const router = useRouter();

    const size = formatBytes(FREE_PLAN_STORAGE);

    const goToSubscriptionFree = () => {
      router.push({ name: routeNames.subscriptionFree });
    };

    return {
      // References
      size,
      // Methods
      goToSubscriptionFree
    };
  }
};
</script>

<style scoped lang="scss" src="./FreePlanCard.scss"></style>
