<template>
  <div class="datapack-sub-info">
    <img class="heading" :src="heading" alt="BIMData Platform" />
  </div>
</template>

<script>
import heading from "./heading.svg";

export default {
  props: {
    spaceInfo: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {
      heading
    };
  }
};
</script>

<style scoped lang="scss" src="./DatapackSubInfo.scss"></style>
