<template>
  <div class="subscription-form paddle-checkout-container">
    <!-- Paddle inline checkout will be loaded here -->
  </div>
</template>

<script>
import { onMounted } from "vue";
import { useUser } from "@/state/user.js";

export default {
  props: {
    organization: {
      type: Object,
      required: true
    },
    space: {
      type: Object,
      required: true
    }
  },
  setup() {
    const { user } = useUser();

    onMounted(() => {
      Paddle.Checkout.open({
        // Checkout params
        product: 12403,
        method: "inline",
        disableLogout: true,
        referring_domain: "platform self service",

        // User data
        email: user.value.email,
        // passthrough: {
        //   organization_id: "1663",
        //   cloud_id: "673"
        // },

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

<style scoped lang="scss" src="./SubscriptionForm.scss"></style>
