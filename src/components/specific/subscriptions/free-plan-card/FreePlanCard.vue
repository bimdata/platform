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
        <div class="free-plan-card__bullets__bullet">
          <img src="/static/platform-sub-info-bullet-mark.svg" />
          <span>{{ $t("FreePlanCard.bullet1") }}</span>
        </div>
        <div class="free-plan-card__bullets__bullet">
          <img src="/static/platform-sub-info-bullet-mark.svg" />
          <span>{{ $t("FreePlanCard.bullet2") }}</span>
        </div>
        <div class="free-plan-card__bullets__bullet">
          <img src="/static/platform-sub-info-bullet-mark.svg" />
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
import { routeNames } from "@/router/index.js";

export default {
  setup() {
    const router = useRouter();

    const goToSubscriptionFree = () => {
      router.push({ name: routeNames.subscriptionFree });
    };

    return {
      // Methods
      goToSubscriptionFree
    };
  }
};
</script>

<style scoped lang="scss" src="./FreePlanCard.scss"></style>
