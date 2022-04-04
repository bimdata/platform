<template>
  <div class="bcf-topics-metrics">
    <div class="bcf-topics-metrics__content flex justify-around items-center">
      <Graph :barsData="barsData" :placeholder="true"></Graph>
      <div
        class="bcf-topics-metrics__content__legend flex items-start justify-center m-l-12"
      >
        <strong>
          {{ $t(`BcfTopicsMetrics.extension.${extensionType}Title`) }}
        </strong>
        <div
          v-for="barData in barsData"
          :key="barData"
          class="flex items-center"
        >
          <div
            :style="{
              width: '10px',
              height: '10px',
              'border-radius': '50px',
              border: `3px solid ${barData.color}`
            }"
          ></div>
          <strong class="m-x-6">{{ barData.percentage.toFixed(0) }} %</strong>
          <span>
            {{
              barData.label && $t(`BcfTopicsMetrics.extension.${extensionType}`)
            }}
            {{
              barData.label ||
              $t(`BcfTopicsMetrics.extension.${extensionType}NotDefined`)
            }}
            <span>({{ barData.total }})</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

import Graph from "../../../generic/graph/Graph.vue";

const typeFieldMap = {
  Priority: "priority",
  Status: "topicStatus"
};

export default {
  data() {
    return {
      size: 245
    };
  },
  props: {
    bcfTopics: {
      type: Array,
      required: true
    },
    extensionType: {
      type: String
    },
    availableExtensions: {
      type: Array,
      required: true
    }
  },

  components: {
    Graph
  },
  setup(props) {
    const extensionValue = ref([typeFieldMap[props.extensionType]]);

    const barsData = computed(() => {
      if (props.bcfTopics.length) {
        // Add empty priority to match topics without priorities
        const shownExtensions = [...props.availableExtensions];

        shownExtensions.push({
          [extensionValue.value]: undefined
        });

        return shownExtensions
          .map(shownExtension => {
            let barData = {};
            if (shownExtension.color !== undefined) {
              barData.color = `#${shownExtension.color}`;
            } else {
              barData.color = `#D8D8D8`;
            }

            const topicCount = props.bcfTopics.filter(
              bcfTopic =>
                bcfTopic[extensionValue.value] ===
                shownExtension[extensionValue.value]
            ).length;

            barData.percentage = (topicCount * 100) / props.bcfTopics.length;

            barData.label = shownExtension[extensionValue.value];

            barData.total = topicCount;
            return barData;
          })
          .sort((a, b) =>
            parseInt(a.percentage) > parseInt(b.percentage) ? -1 : 1
          );
      }
      return [];
    });
    return {
      typeFieldMap,
      barsData
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicsMetrics.scss"></style>
