<template>
  <div class="subscription-status-banner" :class="{ visible }">
    <BIMDataIcon name="lock" size="s" />
    <AppLink
      v-if="textKey"
      :to="{
        name: routeNames.subscriptionPro,
        query: {
          space: space.id
        }
      }"
    >
      {{ $t(`SubscriptionStatusBanner.${textKey}`) }}
    </AppLink>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { SUBSCRIPTION_START_DATE } from "@/config/subscription.js";
import routeNames from "@/router/route-names.js";
import { useSubscriptions } from "@/state/subscriptions.js";
// Components
import AppLink from "@/components/specific/app/app-link/AppLink.vue";

export default {
  components: {
    AppLink
  },
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { getSpaceSubscriptions } = useSubscriptions();
    const visible = ref(false);
    const textKey = ref("");

    watch(
      () => props.space,
      space => {
        // Reset banner state
        visible.value = false;
        textKey.value = "";

        // Check if the space has subscriptions but none
        // of them is active anymore
        const subscriptions = getSpaceSubscriptions(space);
        const isCanceled =
          subscriptions.length > 0 &&
          subscriptions.every(sub => sub.status !== "active");
        if (isCanceled) {
          visible.value = true;
          textKey.value = "reactivate";
          return;
        }

        // Check if this is a free space and if it was created
        // before subscription features deployment
        /*
         * TODO: uncomment the code below when we are ready,
         * i.e. when emails will have been sent to customers
         */
        // const alreadyExisted =
        //   space.isFree &&
        //   new Date(space.created_at).getTime() <
        //     SUBSCRIPTION_START_DATE.getTime();
        // if (alreadyExisted) {
        //   visible.value = true;
        //   textKey.value = "activate";
        // }
      },
      { immediate: true }
    );

    return {
      routeNames,
      textKey,
      visible
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionStatusBanner.scss"></style>
