<template>
  <div class="datapack-subscription">
    <div class="datapack-subscription__left">
      Datapack Sub Info
      <!-- <DatapackSubInfo :spaceInfo="spaceInfo" /> -->
    </div>
    <div class="datapack-subscription__center">
      Datapack Sub Form
      <!-- <DatapackSubForm :space="space" :spaceInfo="spaceInfo" /> -->
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
import SpaceSizePreview from "@/components/specific/payment/space-size-preview/SpaceSizePreview.vue";

export default {
  components: {
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
