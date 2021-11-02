<template>
  <BIMDataCard class="pro-plan-card">
    <template #content>
      <div class="pro-plan-card__title">
        {{ $t("ProPlanCard.title") }}
      </div>
      <div class="pro-plan-card__price">
        {{ $t("ProPlanCard.price") }}
      </div>
      <div class="pro-plan-card__separator"></div>
      <div class="pro-plan-card__bullets">
        <div class="pro-plan-card__bullets__bullet">
          <img src="/static/platform-sub-info-bullet-mark.svg" />
          <span>{{ $t("ProPlanCard.bullet1") }}</span>
        </div>
        <div class="pro-plan-card__bullets__bullet">
          <img src="/static/platform-sub-info-bullet-mark.svg" />
          <span>{{ $t("ProPlanCard.bullet2") }}</span>
        </div>
        <div class="pro-plan-card__bullets__bullet">
          <img src="/static/platform-sub-info-bullet-mark.svg" />
          <span>{{ $t("ProPlanCard.bullet3") }}</span>
        </div>
      </div>
      <BIMDataButton width="240px" color="secondary" fill radius>
        {{ $t("ProPlanCard.buttonText") }}
      </BIMDataButton>
      <div class="pro-plan-card__note">
        {{ $t("ProPlanCard.note") }}
      </div>
    </template>
  </BIMDataCard>
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router/index.js";

export default {
  setup() {
    const router = useRouter();

    const goToSubscriptionPlatform = () => {
      router.push({ name: routeNames.subscriptionPlatform });
    };

    return {
      // Methods
      goToSubscriptionPlatform
    };
  }
};
</script>

<style scoped lang="scss" src="./ProPlanCard.scss"></style>
