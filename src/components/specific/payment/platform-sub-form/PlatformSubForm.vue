<template>
  <div class="platform-sub-form paddle-checkout-container">
    <!--
      Paddle inline checkout will be loaded here
    -->
    <transition name="fade">
      <div class="platform-sub-form__loader" v-show="loading">
        <BIMDataSpinner />
      </div>
    </transition>
    <transition name="fade">
      <div class="platform-sub-form__success" v-show="isSuccess">
        <!-- <div class="platform-sub-form__success__image"></div> -->
        <img
          src="/static/platform-sub-form-success.svg"
          alt="Subscription success"
        />
        <h2 class="platform-sub-form__success__title">
          {{ $t("PlatformSubForm.successTitle") }}
        </h2>
        <div class="platform-sub-form__success__message">
          {{ $t("PlatformSubForm.successMessage") }}
        </div>
        <BIMDataButton
          width="160px"
          color="primary"
          fill
          radius
          @click="goToDashboard"
        >
          {{ $t("PlatformSubForm.successButtonText") }}
        </BIMDataButton>
      </div>
    </transition>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { usePaddle } from "@/composables/paddle.js";
import { routeNames } from "@/router/index.js";
import { useSubscriptions } from "@/state/subscriptions.js";

export default {
  props: {
    space: {
      type: Object,
      default: null
    }
  },
  emits: ["subscription-created"],
  setup(props, { emit }) {
    const router = useRouter();
    const { loadCheckout } = usePaddle();
    const { generatePlatformSubscriptionLink } = useSubscriptions();

    const loading = ref(false);
    const isSuccess = ref(false);

    onMounted(async () => {
      watch(
        () => props.space,
        async space => {
          if (space) {
            loading.value = true;
            const link = await generatePlatformSubscriptionLink(space);
            loadCheckout("paddle-checkout-container", link, {
              onLoad: () => {
                loading.value = false;
              },
              onSuccess: () => {
                isSuccess.value = true;
                emit("subscription-created");
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
      // Methods
      goToDashboard
    };
  }
};
</script>

<style scoped lang="scss" src="./PlatformSubForm.scss"></style>
