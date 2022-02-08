<template>
  <div class="datapack-info">
    <div class="datapack-info__text">
      {{ $t("DatapackInfo.storage") }}
    </div>
    <div class="datapack-info__info">
      <span>
        {{ formatBytes(spaceSubInfo.smartDataSizeAvailable) }}
      </span>
      <span>
        ({{
          $t("DatapackInfo.including", { quantity: datapack?.quantity || 0 })
        }})
      </span>
    </div>
  </div>
</template>

<script>
import { formatBytes } from "@/utils/files.js";

export default {
  props: {
    spaceSubInfo: {
      type: Object,
      required: true
    },
    datapack: {
      type: Object,
      default: null
    }
  },
  setup() {
    return {
      // Methods
      formatBytes
    };
  }
};
</script>

<style scoped lang="scss" src="./DatapackInfo.scss"></style>
