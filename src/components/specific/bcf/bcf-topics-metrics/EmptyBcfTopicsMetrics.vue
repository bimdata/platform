<template>
  <div
    class="bcf-topics-metrics__loading flex items-center justify-center"
    v-if="loading"
  >
    <BIMDataSpinner />
  </div>
  <div class="flex items-center justify-center" v-if="bcfTopics.length === 0">
    <EmptyBcfStats class="m-r-42" />
    <p>{{ $t("BcfTopicsMetrics.emptyText") }}</p>
  </div>
</template>

<script>
import EmptyBcfStats from "./EmptyBcfStats.vue";
export default {
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
    EmptyBcfStats
  }
};
</script>
