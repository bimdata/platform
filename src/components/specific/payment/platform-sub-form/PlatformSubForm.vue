<template>
  <div class="platform-sub-form paddle-checkout-container">
    <!-- Paddle inline checkout will be loaded here -->
  </div>
</template>

<script>
import { onMounted, watch } from "vue";
import { usePayment } from "@/state/payment.js";

export default {
  props: {
    space: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const { generatePlatformSubscriptionLink } = usePayment();

    onMounted(async () => {
      watch(
        () => props.space,
        async space => {
          if (space) {
            const link = await generatePlatformSubscriptionLink(space);

            Paddle.Checkout.open({
              // Checkout params
              method: "inline",
              referring_domain: "platform",
              override: link,

              // Checkout frame
              frameTarget: "paddle-checkout-container",
              frameInitialHeight: 416,
              frameStyle:
                "width:100%; min-width:312px; background-color: transparent; border: none;"
            });
          }
        },
        { immediate: true }
      );
    });
  }
};
</script>
