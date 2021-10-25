<template>
  <div class="datapack-sub-info">
    <img class="heading" :src="heading" alt="BIMData Platform" />
    <img class="image" :src="image" alt="Datapack image" />
    <div class="content">
      <h1 class="title">
        {{ $t("DatapackSubInfo.title") }}
      </h1>
      <div class="text">
        <div>
          {{ $t("DatapackSubInfo.datapacks") }}
        </div>
        <div>2 DataPacks</div>
      </div>
      <div class="text">
        <div>
          {{ $t("DatapackSubInfo.storage") }}
        </div>
        <div>2GB</div>
      </div>
    </div>
  </div>
</template>

<script>
import heading from "./heading.svg";
import image from "./image.svg";

export default {
  props: {
    spaceInfo: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {
      heading,
      image
    };
  }
};
</script>

<style scoped lang="scss" src="./DatapackSubInfo.scss"></style>
