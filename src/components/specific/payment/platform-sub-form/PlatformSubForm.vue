<template>
  <div class="platform-sub-form paddle-checkout-container">
    <!-- Paddle inline checkout will be loaded here -->
  </div>
</template>

<script>
import { onMounted, watch } from "vue";
import { usePaddle } from "@/composables/paddle.js";
import { useSubscriptions } from "@/state/subscriptions.js";

export default {
  props: {
    space: {
      type: Object,
      default: null
    }
  },
  emits: ["subscription-created"],
  setup(props) {
    const { loadCheckout } = usePaddle();
    const { generatePlatformSubscriptionLink } = useSubscriptions();

    onMounted(async () => {
      watch(
        () => props.space,
        async space => {
          if (space) {
            const link = await generatePlatformSubscriptionLink(space);
            loadCheckout("paddle-checkout-container", link);
          }
        },
        { immediate: true }
      );
    });
  }
};
</script>
