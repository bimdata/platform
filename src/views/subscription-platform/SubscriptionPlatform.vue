<template>
  <div class="subscription-platform">
    <ViewHeader>
      <template #left>
        <GoBackButton />
      </template>
      <template #center>
        <h1 class="subscription-platform__title">
          {{ $t("SubscriptionPlatform.title") }}
        </h1>
      </template>
    </ViewHeader>
    <div class="subscription-platform__content">
      <div class="subscription-platform__content__head">
        <!-- TODO: space creator -->
      </div>
      <div class="subscription-platform__content__body">
        <div class="subscription-platform__content__body__left">
          <PlatformSubInfo />
        </div>
        <div class="subscription-platform__content__body__center">
          <PlatformSubForm :space="space" />
        </div>
        <div class="subscription-platform__content__body__right">
          <SpaceSizePreview
            :spaceInfo="spaceInfo"
            :newSizeAvailable="10 * Math.pow(1024, 3)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import PlatformSubForm from "@/components/specific/payment/platform-sub-form/PlatformSubForm.vue";
import PlatformSubInfo from "@/components/specific/payment/platform-sub-info/PlatformSubInfo.vue";
import SpaceSizePreview from "@/components/specific/payment/space-size-preview/SpaceSizePreview.vue";

export default {
  components: {
    GoBackButton,
    PlatformSubForm,
    PlatformSubInfo,
    SpaceSizePreview,
    ViewHeader
  },
  setup() {
    const space = ref({
      id: 558,
      name: "My New Space",
      organization: {
        id: 1935
      }
    });
    const spaceInfo = ref({
      managedBy: "BIMDATA_PLATFORM",
      role: 100,
      totalSize: 29255230,
      smartDtaSize: 29255230,
      totalSizeAvailable: 536870912000,
      smartDataSizeAvailable: 536870912000,
      remainingTotalSize: 536841656770,
      remainingSmartDataPize: 536841656770,
      remainingTotalSizePercent: 99.99455078877509,
      remainingSmartDataSizePercent: 99.99455078877509,
      isPlatformSubscription: true,
      isOrganizationMember: true,
      isPlatformPaid: false,
      usedSizePercent: 0.005449211224913597
    });

    return {
      // References
      space,
      spaceInfo
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionPlatform.scss"></style>
