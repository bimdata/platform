<template>
  <span
    class="bcf-priority-cell flex items-center justify-center p-x-6"
    :style="{
      'background-color': `#${priorityColor}`,
      color: adjustColor(`#${priorityColor}`, '#ffffff', 'var(--color-text)')
    }"
  >
    {{ bcfTopic.index }}
  </span>
</template>

<script>
import { computed } from "vue";

import { adjustColor } from "@/components/generic/color-selector/colors.js";

export default {
  props: {
    bcfTopic: {
      type: Object,
      required: true
    },
    detailedExtensions: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const priorityColor = computed(() => {
      if (props.bcfTopic.priority) {
        const priorityDetail = props.detailedExtensions.priorities.find(
          priority => priority.priority === props.bcfTopic.priority
        );
        if (priorityDetail && priorityDetail.color) {
          return priorityDetail.color;
        }
      }
      return "D8D8D8";
    });

    return {
      // References
      adjustColor,
      priorityColor
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfIndexCell.scss"></style>
