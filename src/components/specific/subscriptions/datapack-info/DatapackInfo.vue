<template>
  <div class="datapack-info">
    <div class="datapack-info__text">
      {{ $t("DatapackInfo.storage") }}
    </div>
    <div class="datapack-info__info">
      <span>
        {{ formatBytes(spaceInfo.smartDataSizeAvailable) }}
      </span>
      <span>
        ({{ $t("DatapackInfo.including", { quantity: datapacksQuantity }) }})
      </span>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { formatBytes } from "@/utils/files.js";

export default {
  props: {
    spaceInfo: {
      type: Object,
      required: true
    },
    subscription: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const datapacksQuantity = computed(() =>
      (props.subscription?.data_packs || [])
        .map(d => d.quantity)
        .reduce((a, b) => a + b, 0)
    );

    return {
      // References
      datapacksQuantity,
      // Methods
      formatBytes
    };
  }
};
</script>

<style scoped lang="scss" src="./DatapackInfo.scss"></style>
