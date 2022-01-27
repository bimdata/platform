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
      v-if="
        spaceSubInfo.isPlatformSubscription && spaceSubInfo.isOrganizationMember
      "
    >
      <AppLink
        :to="{
          name: spaceSubInfo.isPlatformPro
            ? routeNames.subscriptionDatapack
            : routeNames.subscriptionPro,
          query: {
            space: space.id
          }
        }"
      >
        <BIMDataButton class="m-r-18" color="secondary" fill radius>
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
      </AppLink>
    </div>
  </div>
</template>

<script>
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
      // Methods
      formatBytes,
      routeNames
    };
  }
};
</script>
