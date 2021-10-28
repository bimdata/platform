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
        <div>
          {{ datapacks.length }}
          DataPacks
        </div>
      </div>
      <div class="text">
        <div>
          {{ $t("DatapackSubInfo.storage") }}
        </div>
        <div>
          <span>{{ formatBytes(spaceInfo.smartDataSizeAvailable) }}</span>
          <span>
            ({{
              $t("DatapackSubInfo.including", { quantity: datapacksQuantity })
            }})
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { formatBytes } from "@/utils/files.js";
import heading from "./heading.svg";
import image from "./image.svg";

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
    const datapacks = computed(() => props.subscription?.data_packs || []);
    const datapacksQuantity = computed(() =>
      datapacks.value.map(d => d.quantity).reduce((a, b) => a + b, 0)
    );

    return {
      // References
      datapacks,
      datapacksQuantity,
      heading,
      image,
      // Methods
      formatBytes
    };
  }
};
</script>

<style scoped lang="scss" src="./DatapackSubInfo.scss"></style>
