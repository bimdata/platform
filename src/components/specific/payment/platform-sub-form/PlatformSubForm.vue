<template>
  <div class="platform-sub-form paddle-checkout-container">
    <!-- Paddle inline checkout will be loaded here -->
  </div>
</template>

<script>
import { onMounted } from "vue";
import { usePayment } from "@/state/payment.js";

export default {
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { generatePlatformSubscriptionLink } = usePayment();

    onMounted(async () => {
      const subLink = await generatePlatformSubscriptionLink(props.space);

      Paddle.Checkout.open({
        // Checkout params
        method: "inline",
        referring_domain: "platform",
        override: subLink,

        // Checkout frame
        frameTarget: "paddle-checkout-container",
        frameInitialHeight: 416,
        frameStyle:
          "width:100%; min-width:312px; background-color: transparent; border: none;"
      });
    });
  }
};
</script>
