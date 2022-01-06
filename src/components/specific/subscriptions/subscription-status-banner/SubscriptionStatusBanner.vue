<template>
  <div class="subscription-status-banner" :class="{ visible: show }">
    <BIMDataIcon name="lock" size="s" />
    <span v-if="textKey">{{ $t(`SubscriptionStatusBanner.${textKey}`) }}</span>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { SUBSCRIPTION_START_DATE } from "@/config/subscription.js";
import { useSubscriptions } from "@/state/subscriptions.js";

export default {
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { getSpaceSubscriptions } = useSubscriptions();

    const show = ref(false);
    const textKey = ref("");

    watch(
      () => props.space,
      space => {
        // Reset banner state
        show.value = false;
        textKey.value = "";

        // Check if the space has subscriptions but none
        // of them is active anymore
        const subscriptions = getSpaceSubscriptions(space);
        const isCanceled =
          subscriptions.length > 0 &&
          subscriptions.every(sub => sub.status !== "active");
        if (isCanceled) {
          show.value = true;
          textKey.value = "reactivate";
          return;
        }

        // Check if this is a free space was created before
        // subscription features deployment
        const alreadyExisted =
          space.isFree &&
          new Date(space.createdAt).getTime() <
            SUBSCRIPTION_START_DATE.getTime();
        if (alreadyExisted) {
          show.value = true;
          textKey.value = "activate";
        }
      },
      { immediate: true }
    );

    return {
      show,
      textKey
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionStatusBanner.scss"></style>
