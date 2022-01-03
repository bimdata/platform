<template>
  <div class="pro-plan-form">
    <div class="pro-plan-form__head">
      <h1 class="pro-plan-form__head__title">
        {{ $t("ProPlanForm.title") }}
      </h1>
      <span class="pro-plan-form__head__price">
        <span class="value">{{ proPlanPrice }}</span>
        <span class="unit">{{ $t("ProPlanForm.priceUnit") }}</span>
      </span>
    </div>
    <div class="paddle-checkout-container">
      <!--
        Paddle inline checkout will be loaded here
      -->
    </div>
    <transition name="fade">
      <div class="pro-plan-form__loader" v-show="loading">
        <BIMDataSpinner />
      </div>
    </transition>
    <transition name="fade">
      <div class="pro-plan-form__success" v-show="isSuccess">
        <ProPlanFormSuccessImage />
        <h2 class="pro-plan-form__success__title">
          {{ $t("ProPlanForm.successTitle") }}
        </h2>
        <div class="pro-plan-form__success__message">
          {{ $t("ProPlanForm.successMessage") }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { usePaddle } from "@/composables/paddle.js";
import routeNames from "@/router/route-names.js";
import { useSubscriptions } from "@/state/subscriptions.js";

export default {
  props: {
    space: {
      type: Object,
      default: null
    }
  },
  emits: ["space-created"],
  setup(props, { emit }) {
    const { locale } = useI18n();
    const router = useRouter();
    const { getProPlanPrice, loadCheckout } = usePaddle();
    const { getPlatformSubscriptionLink, waitForCreatedSpace } =
      useSubscriptions();

    const loading = ref(false);
    const isSuccess = ref(false);
    const proPlanPrice = ref("0");

    getProPlanPrice().then(({ price, currency }) => {
      proPlanPrice.value = `${price}${currency}`;
    });

    onMounted(async () => {
      watch(
        () => props.space,
        async space => {
          if (space) {
            loading.value = true;
            const link = await getPlatformSubscriptionLink(space);
            loadCheckout("paddle-checkout-container", link, locale.value, {
              onLoad: () => {
                loading.value = false;
              },
              onSuccess: () => {
                isSuccess.value = true;
                waitForCreatedSpace(space).then(createdSpace =>
                  emit("space-created", createdSpace)
                );
              }
            });
          }
        },
        { immediate: true }
      );
    });

    const goToDashboard = () => {
      router.push({ name: routeNames.dashboard });
    };

    return {
      // References
      isSuccess,
      loading,
      proPlanPrice,
      // Methods
      goToDashboard
    };
  }
};
</script>

<style scoped lang="scss" src="./ProPlanForm.scss"></style>
