<template>
  <div class="flex">
    <ProgressBar class="m-r-12" :progress="spaceInfo.usedSizePercent">
      <template #text-below-left>
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
        class="m-r-18"
        color="secondary"
        fill
        radius
        @click="
          () =>
            spaceInfo.isPlatformPaid
              ? goToSubscriptionDatapack()
              : goToSubscriptionPro()
        "
      >
        {{
          $t(
            `SpaceSizeInfo.${
              spaceInfo.isPlatformPaid
                ? "subscribeDatapackButton"
                : "subscribePlatformButton"
            }`
          )
        }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router/index.js";
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
    },
    spaceInfo: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();

    const goToSubscriptionPro = () => {
      router.push({
        name: routeNames.subscriptionPro
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
      // Methods
      formatBytes,
      goToSubscriptionDatapack,
      goToSubscriptionPro
    };
  }
};
</script>
