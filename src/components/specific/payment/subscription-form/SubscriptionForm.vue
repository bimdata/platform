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
    space: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { user } = useUser();

    onMounted(() => {
      Paddle.Checkout.open({
        // Checkout params
        product: 12403,
        method: "inline",
        disableLogout: true,
        referring_domain: "platform",

        // User data
        email: user.value.email,
        // passthrough: {
        //   organization_id: props.space.organization.id,
        //   cloud_id: props.space.id
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
