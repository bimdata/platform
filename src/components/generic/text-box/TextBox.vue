<template>
  <div
    class="text-box"
    @mouseenter="showTooltip = true"
    @mouseleave="showTooltip = false"
  >
    {{ displayedText }}
    <div
      v-if="tooltip && displayedText !== text"
      v-show="showTooltip"
      class="text-box__tooltip"
      :class="[
        `text-box__tooltip--${tooltipPosition}`,
        `text-box__tooltip--${tooltipColor}`
      ]"
    >
      {{ text }}
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    text: {
      type: String,
      required: true
    },
    maxLength: {
      type: Number,
      validator: value => value > 0
    },
    cutOn: {
      type: String,
      default: "middle",
      validator: value => ["start", "middle", "end"].includes(value)
    },
    cutSymbol: {
      type: String,
      default: "..."
    },
    tooltip: {
      type: Boolean,
      default: true
    },
    tooltipPosition: {
      type: String,
      default: "bottom",
      validator: value => ["top", "right", "bottom", "left"].includes(value)
    },
    tooltipColor: {
      type: String,
      default: "primary",
      validator: value =>
        ["primary", "secondary", "granite-light", "silver-light"].includes(
          value
        )
    }
  },
  setup(props) {
    const displayedText = ref("");
    const showTooltip = ref(false);

    watch(
      [
        () => props.text,
        () => props.maxLength,
        () => props.cutOn,
        () => props.cutSymbol
      ],
      () => {
        const l = props.text.length;
        const c = props.cutSymbol.length;
        const max = props.maxLength;
        if (max && max < l && max > c) {
          let cutIndex,
            head = "",
            tail = "";
          switch (props.cutOn) {
            case "start":
              cutIndex = l - (max - c);
              tail = props.text.slice(cutIndex);
              break;
            case "middle":
              cutIndex = (max - c) / 2;
              head = props.text.slice(0, Math.ceil(cutIndex));
              tail = props.text.slice(l - Math.floor(cutIndex));
              break;
            case "end":
              cutIndex = max - c;
              head = props.text.slice(0, cutIndex);
              break;
          }
          displayedText.value = `${head}${props.cutSymbol}${tail}`;
        } else {
          displayedText.value = props.text;
        }
      },
      { immediate: true }
    );

    return {
      displayedText,
      showTooltip
    };
  }
};
</script>

<style scoped lang="scss" src="./TextBox.scss"></style>
