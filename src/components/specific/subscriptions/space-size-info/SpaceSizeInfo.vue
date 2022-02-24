<template>
  <div class="space-size-info flex">
    <ProgressBar
      class="m-r-12"
      :width="isXL ? '115px' : '230px'"
      :progress="spaceSubInfo.usedSizePercent"
    >
      <template #text-below-left>
        <div v-if="isXL">
          {{
            `${
              Math.round((100 * spaceSubInfo.smartDataSize) / GB) / 100
            } / ${formatBytes(spaceSubInfo.smartDataSizeAvailable)}`
          }}
        </div>
        <div v-else>
          {{
            $t("SpaceSizeInfo.usage", {
              used: formatBytes(spaceSubInfo.smartDataSize),
              total: formatBytes(spaceSubInfo.smartDataSizeAvailable)
            })
          }}
        </div>
      </template>
    </ProgressBar>
    <AppLink
      v-if="
        spaceSubInfo.isPlatformSubscription &&
        spaceSubInfo.isOrganizationMember &&
        !spaceSubInfo.isCustomSubscription
      "
      :to="{
        name: spaceSubInfo.isPlatformPro
          ? routeNames.subscriptionDatapack
          : routeNames.subscriptionPro,
        query: {
          space: space.id
        }
      }"
    >
      <BIMDataButton color="secondary" fill radius>
        <template v-if="spaceSubInfo.isPlatformPro">
          {{ $t("SpaceSizeInfo.subscribeDatapackButton") }}
        </template>
        <template v-else>
          {{ $t("SpaceSizeInfo.subscribePlatformButton") }}
        </template>
      </BIMDataButton>
    </AppLink>
  </div>
</template>

<script>
import { useStandardBreakpoints } from "@/composables/responsive.js";
import SIZE_UNIT from "@/config/size-unit.js";
import routeNames from "@/router/route-names.js";
import { formatBytes } from "@/utils/files.js";
// Components
import ProgressBar from "@/components/generic/progress-bar/ProgressBar.vue";
import AppLink from "@/components/specific/app/app-link/AppLink.vue";

export default {
  components: {
    AppLink,
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
  setup() {
    return {
      // References
      GB: SIZE_UNIT.GB,
      routeNames,
      // Methods
      formatBytes,
      // Responsive breakpoints
      ...useStandardBreakpoints()
    };
  }
};
</script>
