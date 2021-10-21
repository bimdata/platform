<template>
  <div class="datapack-subscription">
    <div class="datapack-subscription__left">
      Datapack Sub Info
      <!-- <DatapackSubInfo :space="space" /> -->
    </div>
    <div class="datapack-subscription__center">
      Datapack Sub Form
      <!-- <DatapackSubForm :space="space" /> -->
    </div>
    <div class="datapack-subscription__right">
      <SpaceSizePreview :space="space" />
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
    }
  }
};
</script>

<style scoped lang="scss" src="./DatapackSubscription.scss"></style>
