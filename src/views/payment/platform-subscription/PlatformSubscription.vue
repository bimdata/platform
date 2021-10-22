<template>
  <div class="platform-subscription">
    <div class="platform-subscription__left">
      <PlatformSubInfo />
    </div>
    <div class="platform-subscription__center">
      <PlatformSubForm :space="space" />
    </div>
    <div class="platform-subscription__right">
      <SpaceSizePreview :spaceInfo="spaceInfo" :newSpaceSize="10000000000" />
    </div>
  </div>
</template>

<script>
// Components
import PlatformSubForm from "@/components/specific/payment/platform-sub-form/PlatformSubForm.vue";
import PlatformSubInfo from "@/components/specific/payment/platform-sub-info/PlatformSubInfo.vue";
import SpaceSizePreview from "@/components/specific/payment/space-size-preview/SpaceSizePreview.vue";

export default {
  components: {
    PlatformSubForm,
    PlatformSubInfo,
    SpaceSizePreview
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
  }
};
</script>

<style scoped lang="scss" src="./PlatformSubscription.scss"></style>
