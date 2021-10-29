<template>
  <div class="progress-bar">
    <div class="progress-bar__text progress-bar__text--above">
      <slot name="text-above-left"></slot>
      <slot name="text-above-right"></slot>
    </div>
    <div class="progress-bar__content" :style="{ width: componentWidth }">
      <div
        class="progress-bar__content__bar"
        :style="{ width: progressPercent + '%' }"
        :class="[`progress-bar__content__bar--${indicatorColorState}`]"
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
    componentWidth: {
      type: String,
      default: "230px"
    },
    progressPercent: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const indicatorColorState = computed(() => {
      if (props.progressPercent <= 33) {
        return "good";
      }
      if (33 < props.progressPercent && props.progressPercent <= 66) {
        return "warning";
      }
      if (props.progressPercent > 66) {
        return "high";
      }
      return "";
    });
    return {
      indicatorColorState
    };
  }
};
</script>

<style scoped lang="scss" src="./ProgressBar.scss"></style>
