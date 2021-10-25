<template>
  <div class="datapack-subscription">
    <div class="datapack-subscription__left">
      <DatapackSubInfo :spaceInfo="spaceInfo" />
    </div>
    <div class="datapack-subscription__center">
      <DatapackSubForm :space="space" :spaceInfo="spaceInfo" />
    </div>
    <div class="datapack-subscription__right">
      <SpaceSizePreview
        :spaceInfo="spaceInfo"
        :newSizeAvailable="10 * Math.pow(1024, 3)"
      />
    </div>
  </div>
</template>

<script>
// Components
import DatapackSubForm from "@/components/specific/payment/datapack-sub-form/DatapackSubForm.vue";
import DatapackSubInfo from "@/components/specific/payment/datapack-sub-info/DatapackSubInfo.vue";
import SpaceSizePreview from "@/components/specific/payment/space-size-preview/SpaceSizePreview.vue";

export default {
  components: {
    DatapackSubForm,
    DatapackSubInfo,
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

<style scoped lang="scss" src="./DatapackSubscription.scss"></style>
