<template>
  <div class="flex">
    <ProgressBar class="m-r-12" :progress="spaceSubInfo.usedSizePercent">
      <template #text-below-left>
        <div>
          {{ formatBytes(spaceSubInfo.smartDataSize) }}
          {{ $t("SpaceSizeInfo.used") }}
          {{ $t("SpaceSizeInfo.from") }}
          {{ formatBytes(spaceSubInfo.smartDataSizeAvailable) }}
          <span v-if="!spaceSubInfo.isPlatformPro">
            {{ $t("SpaceSizeInfo.included") }}
          </span>
        </div>
      </template>
    </ProgressBar>
    <div
      v-if="spaceSubInfo.isPlatformSubscription && spaceSubInfo.isOrganizationMember"
    >
      <BIMDataButton
        class="m-r-18"
        color="secondary"
        fill
        radius
        @click="
          () =>
            spaceSubInfo.isPlatformPro
              ? goToSubscriptionDatapack()
              : goToSubscriptionPro()
        "
      >
        {{
          $t(
            `SpaceSizeInfo.${
              spaceSubInfo.isPlatformPro
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
import routeNames from "@/router/route-names.js";
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
    spaceSubInfo: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();

    const goToSubscriptionPro = () => {
      router.push({
        name: routeNames.subscriptionPro,
        query: {
          space: props.space.id
        }
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
