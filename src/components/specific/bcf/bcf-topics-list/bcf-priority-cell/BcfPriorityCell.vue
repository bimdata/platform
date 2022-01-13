<template>
  <span
    class="bcf-priority-cell flex items-center justify-center p-x-6"
    :class="`bcf-priority-cell--${priorityValue}`"
  >
    {{ bcfTopic.priority }}
  </span>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const priorityValue = ref("");

    watch(
      () => props.bcfTopic,
      () => {
        if (props.bcfTopic.priority === "High") {
          priorityValue.value = "high";
        }
        if (props.bcfTopic.priority === "Medium") {
          priorityValue.value = "medium";
        }
        if (props.bcfTopic.priority === "Low") {
          priorityValue.value = "low";
        }
      },
      { immediate: true }
    );

    return {
      // References
      priorityValue
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfPriorityCell.scss"></style>
