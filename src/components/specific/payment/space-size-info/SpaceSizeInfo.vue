<template>
  <div class="flex" v-if="spaceInfo.role === 100">
    <ProgressBar
      class="m-r-12"
      :progressPercent="spaceInfo.remainingSizePercent"
    >
      <template #text-left-below>
        <div>
          {{ formatBytes(spaceInfo.smartDataSize) }}
          {{ $t("SpaceSizeInfo.using") }}
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
        color="secondary"
        fill
        radius
        @click="goToPayment"
        class="m-r-18"
      >
        {{ $t("SpaceSizeInfo.upgradeStorageButton") }}
      </BIMDataButton>
      <BIMDataButton
        v-else
        color="secondary"
        fill
        radius
        @click="goToPayment"
        class="m-r-18"
      >
        {{ $t("SpaceSizeInfo.buyPlatformProButton") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { routeNames } from "@/router/index.js";
import { usePayment } from "@/state/payment.js";
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
    const { retrieveSpaceInformation } = usePayment();

    const spaceInfo = ref({});

    const goToPayment = () => {
      router.push({
        name: routeNames.payment
      });
    };

    watch(
      () => props.space,
      async () => {
        spaceInfo.value = await retrieveSpaceInformation(props.space);
      },
      { immediate: true }
    );

    return {
      // References
      spaceInfo,
      // Methods
      formatBytes,
      goToPayment
    };
  }
};
</script>
