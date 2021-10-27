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
          {{ totalQuantity }}
          GB
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import heading from "./heading.svg";
import image from "./image.svg";

export default {
  props: {
    spaceInfo: {
      type: Object,
      required: true
    },
    subscriptions: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const subscription = ref({});
    const datapacks = ref([]);
    const totalQuantity = computed(() =>
      datapacks.value.map(d => d.quantity).reduce((a, b) => a + b, 0)
    );

    watch(
      () => props.subscriptions,
      () => {
        subscription.value = props.subscriptions[0] || {};
        datapacks.value = subscription.value.data_packs || [];
      },
      { immediate: true }
    );

    return {
      // References
      datapacks,
      heading,
      image,
      subscription,
      totalQuantity
    };
  }
};
</script>

<style scoped lang="scss" src="./DatapackSubInfo.scss"></style>
