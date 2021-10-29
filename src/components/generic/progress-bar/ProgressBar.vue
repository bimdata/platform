<template>
  <div class="progress-bar">
    <div class="progress-bar__text progress-bar__text--above">
      <slot name="text-above-left"></slot>
      <slot name="text-above-right"></slot>
    </div>
    <div class="progress-bar__content" :style="{ width }">
      <div
        class="progress-bar__content__bar"
        :class="[`progress-bar__content__bar--${barColor}`]"
        :style="{ width: Math.min(progress, 100) + '%' }"
      ></div>
    </div>
    <div class="progress-bar__text progress-bar__text--below">
      <slot name="text-below-left"></slot>
      <slot name="text-below-right"></slot>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    width: {
      type: String,
      default: "230px"
    },
    progress: {
      type: Number,
      default: 0
    },
    warningLimit: {
      type: Number,
      default: 66
    },
    highLimit: {
      type: Number,
      default: 80
    }
  },
  setup(props) {
    const barColor = computed(() => {
      if (props.progress <= props.warningLimit) {
        return "good";
      }
      if (
        props.progress > props.warningLimit &&
        props.progress <= props.highLimit
      ) {
        return "warning";
      }
      if (props.progress > props.highLimit) {
        return "high";
      }
      return "";
    });

    return {
      // References
      barColor
    };
  }
};
</script>

<style scoped lang="scss" src="./ProgressBar.scss"></style>
