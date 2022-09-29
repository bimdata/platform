<template>
  <div class="free-plan-info">
    <div class="free-plan-info__title">
      {{ $t("FreePlanInfo.title") }}
    </div>
    <div class="free-plan-info__price">
      {{ $t("FreePlanInfo.price") }}
    </div>
    <div class="free-plan-info__separator"></div>
    <div class="free-plan-info__bullets">
      <div class="free-plan-info__bullets__bullet size">
        <BulletMarkImage />
        <span>{{ size }}</span>
      </div>
      <div class="free-plan-info__bullets__bullet">
        <BulletMarkImage />
        <span>{{ $t("FreePlanInfo.bullet2") }}</span>
      </div>
      <div class="free-plan-info__bullets__bullet">
        <BulletMarkImage />
        <span>{{ $t("FreePlanInfo.bullet3") }}</span>
      </div>
    </div>
    <BIMDataButton
      width="240px"
      color="primary"
      fill
      radius
      @click="goToSubscriptionFree"
    >
      {{ $t("FreePlanInfo.buttonText") }}
    </BIMDataButton>
    <div class="free-plan-info__note">
      {{ $t("FreePlanInfo.note") }}
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { FREE_PLAN_STORAGE } from "../../../../../config/subscription.js";
import routeNames from "../../../../../router/route-names.js";
import { formatBytes } from "../../../../../utils/files.js";

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

<style scoped lang="scss" src="./FreePlanInfo.scss"></style>
