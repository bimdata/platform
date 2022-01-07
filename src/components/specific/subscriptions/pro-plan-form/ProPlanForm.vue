<template>
  <div class="pro-plan-form">
    <div class="pro-plan-form__head">
      <div class="pro-plan-form__head__net">
        <span class="title">
          {{ $t("ProPlanForm.titleNet") }}
        </span>
        <span class="price">
          <span class="value">{{ netPrice }}</span>
          <span class="unit">{{ $t("ProPlanForm.priceUnit") }}</span>
        </span>
      </div>
      <div class="pro-plan-form__head__tax">
        <span class="title">
          {{ $t("ProPlanForm.titleTax") }}
        </span>
        <span class="price">
          <span class="value">{{ taxPrice }}</span>
          <span class="unit">{{ $t("ProPlanForm.priceUnit") }}</span>
        </span>
      </div>
      <div class="pro-plan-form__head__separator"></div>
      <div class="pro-plan-form__head__total">
        <h1 class="title">
          {{ $t("ProPlanForm.titleTotal") }}
          <span class="note">{{ $t("ProPlanForm.noteTotal") }}</span>
        </h1>
        <span class="price">
          <span class="value">{{ totalPrice }}</span>
          <span class="unit">{{ $t("ProPlanForm.priceUnit") }}</span>
        </span>
      </div>
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
    const netPrice = ref("0");
    const taxPrice = ref("0");
    const totalPrice = ref("0");

    getProPlanPrice().then(({ price, tax, currency }) => {
      netPrice.value = `${price}${currency}`;
      taxPrice.value = `${tax}${currency}`;
      totalPrice.value = `${price + tax}${currency}`;
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
                // isSuccess.value = true;
                loading.value = true;
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
      netPrice,
      taxPrice,
      totalPrice,
      // Methods
      goToDashboard
    };
  }
};
</script>

<style scoped lang="scss" src="./ProPlanForm.scss"></style>
