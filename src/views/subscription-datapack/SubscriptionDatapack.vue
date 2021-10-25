<template>
  <div class="subscription-datapack">
    <ViewHeader>
      <template #left>
        <GoBackButton />
      </template>
      <template #center>
        <h1 class="subscription-datapack__title">
          {{ $t("SubscriptionDatapack.title") }}
        </h1>
      </template>
    </ViewHeader>
    <div class="subscription-datapack__content">
      <div class="subscription-datapack__content__head">
        <!-- TODO: space selector -->
      </div>
      <div class="subscription-datapack__content__body">
        <div class="subscription-datapack__content__body__left">
          <DatapackSubInfo :spaceInfo="spaceInfo" />
        </div>
        <div class="subscription-datapack__content__body__center">
          <DatapackSubForm
            :space="space"
            @quantity-updated="onQuantityUpdate"
            @datapack-created="() => {}"
          />
        </div>
        <div class="subscription-datapack__content__body__right">
          <SpaceSizePreview
            :spaceInfo="spaceInfo"
            :newSizeAvailable="newSizeAvailable"
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
import DatapackSubForm from "@/components/specific/payment/datapack-sub-form/DatapackSubForm.vue";
import DatapackSubInfo from "@/components/specific/payment/datapack-sub-info/DatapackSubInfo.vue";
import SpaceSizePreview from "@/components/specific/payment/space-size-preview/SpaceSizePreview.vue";

const OneGB = Math.pow(1024, 3);

export default {
  components: {
    GoBackButton,
    DatapackSubForm,
    DatapackSubInfo,
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
      smartDataSize: 29255230,
      smartDataSizeAvailable: 536870912000,
      remainingSmartDataPize: 536841656770,
      remainingSmartDataSizePercent: 99.99455078877509,
      usedSizePercent: 0.005449211224913597,
      isPlatformSubscription: true,
      isOrganizationMember: true,
      isPlatformPaid: true
    });

    const newSizeAvailable = ref(
      spaceInfo.value.smartDataSizeAvailable + OneGB
    );

    const onQuantityUpdate = quantity => {
      newSizeAvailable.value =
        spaceInfo.value.smartDataSizeAvailable + quantity * OneGB;
    };

    return {
      // References
      newSizeAvailable,
      space,
      spaceInfo,
      // Methods
      onQuantityUpdate
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionDatapack.scss"></style>
