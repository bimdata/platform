<template>
  <div class="platform-subscription">
    <div class="platform-subscription__left">
      <PlatformSubInfo />
    </div>
    <div class="platform-subscription__center">
      <PlatformSubForm :space="space" />
    </div>
    <div class="platform-subscription__right">
      <SpaceSizePreview :space="space" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
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
  setup() {
    const space = ref({});

    return {
      // References
      space
    };
  }
};
</script>

<style scoped lang="scss" src="./PlatformSubscription.scss"></style>
