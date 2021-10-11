<template>
  <div class="bimdata-progress flex flex-col">
    <div class="bimdata-progress--text flex justify-between m-b-6">
      <slot name="text-left-above"></slot>
      <slot name="text-right-above"></slot>
    </div>
    <div class="bimdata-progress__content" :style="{ width: componentWidth }">
      <div
        class="bimdata-progress__content__bar"
        :style="{ width: progressWidth }"
        :class="[`bimdata-progress__content__bar--${indicatorColor}`]"
      ></div>
    </div>
    <div class="bimdata-progress--text flex justify-between m-t-6">
      <slot name="text-left-below"></slot>
      <slot name="text-right-below"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    componentWidth: {
      type: String,
      default: "230px"
    },
    progressWidth: {
      type: String,
      default: "1%"
    },
    indicatorColor: {
      type: String,
      default: "good",
      validator: value => ["good", "warning", "high"].includes(value)
    }
  },
  setup(props) {
    const indicatorColorState = () => {
      const indicator = (10 * 10) / 3;
      if (props.progressWidth <= indicator) {
        console.log("good indicator:");
      }
      if (indicator <= props.progressWidth <= indicator * 2) {
        console.log("warning indicator:");
      }
      if (props.progressWidth >= indicator * 2) {
        console.log("high indicator:");
      }
    };
    return {
      indicatorColorState
    };
  }
};
</script>

<style scoped lang="scss" src="./ProgressBar.scss"></style>
