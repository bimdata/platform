<template>
  <div class="flex" v-if="size.role === 100">
    <ProgressBar class="m-r-12" :progressPercent="calcSize">
      <template #text-left-below>
        <div>
          {{ formatBytes(size.smartDataSize) }}
          {{ $t("SpaceBoard.progressBar.using") }}
          {{ $t("SpaceBoard.progressBar.from") }}
          {{ formatBytes(size.smartDataSizeAvailable) }}
          <span v-if="!isPlatformPaid">{{
            $t("SpaceBoard.progressBar.included")
          }}</span>
        </div>
      </template>
    </ProgressBar>
    <div v-if="isPlatformSubscription && isOrganizationMember">
      <BIMDataButton
        v-if="isPlatformPaid"
        color="secondary"
        fill
        radius
        @click="goToPaddlePayment"
        class="m-r-18"
      >
        {{ $t("SpaceBoard.progressBar.upgradeStorageButton") }}
      </BIMDataButton>
      <BIMDataButton
        v-else
        color="secondary"
        fill
        radius
        @click="goToPaddlePayment"
        class="m-r-18"
      >
        {{ $t("SpaceBoard.progressBar.buyPlatformProButton") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { routeNames } from "@/router";

import { usePayment } from "@/state/payment.js";
import { useSpaces } from "@/state/spaces";

import ProgressBar from "@/components/generic/progress-bar/ProgressBar";

import { formatBytesV2 } from "@/utils/files.js";

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
    const { spaceSize } = useSpaces();
    const { retrievePlaformSubscriptions } = usePayment();

    const router = useRouter();

    const size = ref({});
    const isPlatformSubscription = ref(false);
    const isOrganizationMember = ref(false);
    const isPlatformPaid = ref(false);
    const calcSize = ref(0);

    const goToPaddlePayment = () => {
      router.push({ name: routeNames.paddlePayment });
    };

    watch(
      () => props.space,
      async () => {
        size.value = await spaceSize(props.space);

        isPlatformSubscription.value =
          size.value.managedBy === "BIMDATA_PLATFORM";

        if (isPlatformSubscription.value) {
          try {
            let platformSubscriptions = await retrievePlaformSubscriptions(
              props.space.organization,
              props.space
            );
            isOrganizationMember.value = true;
            // boolean for upgrade platform or pay platform pro
            isPlatformPaid.value = platformSubscriptions.some(
              platformSubscription => platformSubscription.status === "active"
            );
          } catch (e) {
            isOrganizationMember.value = false;
          }
        }

        // calculation of the remaining size
        calcSize.value = 100 - size.value.remainingSmartDataSizePercent;
      },
      { immediate: true }
    );

    return {
      // References
      isPlatformSubscription,
      isPlatformPaid,
      isOrganizationMember,
      calcSize,
      size,
      formatBytes: formatBytesV2,
      // Methods
      goToPaddlePayment
    };
  }
};
</script>
