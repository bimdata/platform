<template>
  <div class="platform-sub-form paddle-checkout-container">
    <!-- Paddle inline checkout will be loaded here -->
  </div>
</template>

<script>
import { onMounted } from "vue";

export default {
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    onMounted(() => {
      Paddle.Checkout.open({
        // Checkout params
        method: "inline",
        referring_domain: "platform",
        override: "",

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
