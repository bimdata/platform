<template>
  <div class="bcf-topics-metrics flex items-center justify-center">
    <div class="flex items-center justify-center" v-if="bcfTopics.length === 0">
      <EmptyBcfStats class="m-r-42" />
      <p>Add BCF Topics to start to have some stats here.</p>
    </div>
    <div v-else>Some stats here</div>
  </div>
</template>

<script>
import EmptyBcfStats from "./EmptyBcfStats.vue";
export default {
  props: {
    bcfTopics: {
      type: Array,
      required: true
    }
  },
  components: {
    EmptyBcfStats
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicsMetrics.scss"></style>
