<template>
  <div class="flex" v-if="spaceInformation.role === 100">
    <ProgressBar
      class="m-r-12"
      :progressPercent="spaceInformation.remainingSizePercent"
    >
      <template #text-left-below>
        <div>
          {{ formatBytes(spaceInformation.smartDataSize) }}
          {{ $t("SpaceBoard.progressBar.using") }}
          {{ $t("SpaceBoard.progressBar.from") }}
          {{ formatBytes(spaceInformation.smartDataSizeAvailable) }}
          <span v-if="!isPlatformPaid">{{
            $t("SpaceBoard.progressBar.included")
          }}</span>
        </div>
      </template>
    </ProgressBar>
    <div
      v-if="
        spaceInformation.isPlatformSubscription &&
        spaceInformation.isOrganizationMember
      "
    >
      <BIMDataButton
        v-if="spaceInformation.isPlatformPaid"
        color="secondary"
        fill
        radius
        @click="goToPayment"
        class="m-r-18"
      >
        {{ $t("SpaceBoard.progressBar.upgradeStorageButton") }}
      </BIMDataButton>
      <BIMDataButton
        v-else
        color="secondary"
        fill
        radius
        @click="goToPayment"
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
    const { retrieveSpaceInformation } = usePayment();

    const router = useRouter();

    const spaceInformation = ref({});

    const goToPayment = () => {
      router.push({
        name: routeNames.spacePayment
      });
    };

    watch(
      () => props.space,
      async () => {
        spaceInformation.value = await retrieveSpaceInformation(props.space);
      },
      { immediate: true }
    );

    return {
      // References
      spaceInformation,
      formatBytes: formatBytesV2,
      // Methods
      goToPayment
    };
  }
};
</script>
