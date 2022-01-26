<template>
  <div class="bcf-topics-metrics">
    <div class="flex items-center justify-center" v-if="bcfTopics.length === 0">
      <EmptyBcfStats class="m-r-42" />
      <p>Add BCF Topics to start to have some stats here.</p>
    </div>
    <div v-else-if="loading">
      <BIMDataSpinner class="m-b-12" /> <span> loading metrics </span>
    </div>
    <div v-else class="bcf-topics-metrics__content flex justify-around">
      <Graph :barsData="barsData" :size="size" />
      <div class="bcf-topics-metrics__content__total flex items-center">
        <strong>{{ bcfTopics.length }}</strong> <span>issues</span>
      </div>
      <div
        class="bcf-topics-metrics__content__legend flex items-start justify-center m-l-12"
      >
        <div
          v-for="barData in barsData"
          :key="barData"
          class="flex items-center m-y-6"
        >
          <div
            :style="{
              width: '10px',
              height: '10px',
              'border-radius': '50px',
              'background-color': barData.color
            }"
          ></div>
          <strong class="m-x-6">{{ barData.percentage }} %</strong>
          <span
            >Priorité {{ barData.label ? barData.label : "non défini" }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

import EmptyBcfStats from "./EmptyBcfStats.vue";
import Graph from "../../../generic/graph/Graph.vue";
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
    loading: {
      type: Boolean
    }
  },

  components: {
    EmptyBcfStats,
    Graph
  },
  setup(props) {
    const priorityOptions = ref([]);
    watch(
      () => props.bcfTopics,
      () => {
        priorityOptions.value = [
          ...new Set(props.bcfTopics.map(bcfTopic => bcfTopic.priority))
        ];
      }
    );

    const barsData = ref([]);
    watch(
      () => priorityOptions.value,
      () => {
        if (priorityOptions.value) {
          (barsData.value = []),
            priorityOptions.value.forEach(priority => {
              let barData = {};
              barData.color = "palevioletred";
              const v1 = props.bcfTopics.filter(
                bcfTopic => bcfTopic.priority === priority
              ).length;
              const calcPercentage = (v1 * 100) / props.bcfTopics.length;
              barData.percentage = calcPercentage.toFixed(0);
              barData.label = priority;
              barsData.value.push(barData);
            });
        }
      },
      { immediate: true }
    );
    return {
      barsData,
      priorityOptions
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicsMetrics.scss"></style>
