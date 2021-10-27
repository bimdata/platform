<template>
  <div class="flex">
    <ProgressBar class="m-r-12" :progressPercent="spaceInfo.usedSizePercent">
      <template #text-left-below>
        <div>
          {{ formatBytes(spaceInfo.smartDataSize) }}
          {{ $t("SpaceSizeInfo.used") }}
          {{ $t("SpaceSizeInfo.from") }}
          {{ formatBytes(spaceInfo.smartDataSizeAvailable) }}
          <span v-if="!spaceInfo.isPlatformPaid">
            {{ $t("SpaceSizeInfo.included") }}
          </span>
        </div>
      </template>
    </ProgressBar>
    <div
      v-if="spaceInfo.isPlatformSubscription && spaceInfo.isOrganizationMember"
    >
      <BIMDataButton
        v-if="spaceInfo.isPlatformPaid"
        class="m-r-18"
        color="secondary"
        fill
        radius
        @click="goToSubscriptionDatapack"
      >
        {{ $t("SpaceSizeInfo.subscribeDatapackButton") }}
      </BIMDataButton>
      <BIMDataButton
        v-else
        class="m-r-18"
        color="secondary"
        fill
        radius
        @click="goToSubscriptionPlatform"
      >
        {{ $t("SpaceSizeInfo.subscribePlatformButton") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { routeNames } from "@/router/index.js";
import { useSubscriptions } from "@/state/subscriptions.js";
import { formatBytes } from "@/utils/files.js";
// Components
import ProgressBar from "@/components/generic/progress-bar/ProgressBar.vue";

export default {
  components: {
    ProgressBar
  },
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const { retrieveSpaceInformation } = useSubscriptions();

    const spaceInfo = ref({});
    watch(
      () => props.space,
      async () => {
        spaceInfo.value = await retrieveSpaceInformation(props.space);
      },
      { immediate: true }
    );

    const goToSubscriptionPlatform = () => {
      router.push({
        name: routeNames.subscriptionPlatform
      });
    };
    const goToSubscriptionDatapack = () => {
      router.push({
        name: routeNames.subscriptionDatapack,
        query: {
          space: props.space.id
        }
      });
    };

    return {
      // References
      spaceInfo,
      // Methods
      formatBytes,
      goToSubscriptionDatapack,
      goToSubscriptionPlatform
    };
  }
};
</script>
