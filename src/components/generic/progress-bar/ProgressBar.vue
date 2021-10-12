<template>
  <div class="bimdata-progress flex flex-col">
    <div class="bimdata-progress--text flex justify-between m-b-6">
      <slot name="text-left-above"></slot>
      <slot name="text-right-above"></slot>
    </div>
    <div class="bimdata-progress__content" :style="{ width: componentWidth }">
      <div
        class="bimdata-progress__content__bar"
        :style="{ width: progressPercent + '%' }"
        :class="[`bimdata-progress__content__bar--${indicatorColorState}`]"
      ></div>
    </div>
    <div class="bimdata-progress--text flex justify-between m-t-6">
      <slot name="text-left-below"></slot>
      <slot name="text-right-below"></slot>
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
      if (33 < props.progressPercent && props.progressPercent <= 66) {
        return "warning";
      }
      if (props.progressPercent > 66) {
        return "high";
      }
      return "good";
    });
    return {
      indicatorColorState
    };
  }
};
</script>

<style scoped lang="scss" src="./ProgressBar.scss"></style>
