<template>
  <span
    class="bcf-priority-cell flex items-center justify-center p-x-6"
    :style="{
      'background-color': `#${statusColor}`,
      color: adjustColor(`#${statusColor}`, '#ffffff', 'var(--color-text)')
    }"
  >
    {{ bcfTopic.topicStatus }}
  </span>
</template>

<script>
import { computed } from "vue";
import { adjustColor } from "@/components/specific/bcf/bcf-settings/adjustColor.js";

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
    const statusColor = computed(() => {
      if (props.bcfTopic.topicStatus) {
        const statusDetail = props.detailedExtensions.topicStatuses.find(
          status => status.topicStatus === props.bcfTopic.topicStatus
        );
        if (statusDetail && statusDetail.color) {
          return statusDetail.color;
        }
      }
      return "D8D8D8";
    });

    return {
      // References
      statusColor,
      adjustColor
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfStatusCell.scss"></style>
