<template>
  <span
    class="bcf-priority-cell flex items-center justify-center p-x-6"
    :class="`bcf-priority-cell--${priorityValue}`"
  >
    {{ bcfTopic.priority }}
  </span>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    bcfTopic: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const priorityValue = computed(() => {
      if (props.bcfTopic.priority) {
        return props.bcfTopic.priority.toLowerCase();
      }
      return "";
    });

    return {
      // References
      priorityValue
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfPriorityCell.scss"></style>
