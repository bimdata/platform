<template>
  <BIMDataCard class="color-selector">
    <template #content>
      <div
        class="color-selector__line"
        v-for="(colorLine, i) of colorLines"
        :key="`colorLine${i}`"
      >
        <div
          class="color-selector__line__element"
          v-for="([colorName, colorValue], j) of colorLine"
          :class="{ selected: colorValue === selectedColor }"
          :key="`colorElement${j}ofColorLine${i}`"
          :style="`background-color: #${colorValue}`"
          :title="colorName"
          @click="$emit('color-select', colorValue)"
        ></div>
      </div>
    </template>
  </BIMDataCard>
</template>

<script>
import { colors } from "./colors.js";

const colorLines = Object.entries(colors).reduce((acc, cur, i) => {
  if (i % 5 === 0) {
    acc.push([cur]);
  } else {
    acc[acc.length - 1].push(cur);
  }
  return acc;
}, []);

export default {
  props: {
    selectedColor: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      colorLines
    };
  },
  methods: {
    toColorString(color) {
      return `#${color.toString(16).padStart(6, 0)}`;
    }
  }
};
</script>

<style lang="scss">
.color-selector {
  &__line {
    display: flex;
    &__element {
      cursor: pointer;
      height: 30px;
      width: 30px;
      margin: 4px;
      border-radius: 3px;
      &.selected {
        border: solid 2px var(--color-primary);
      }
    }
  }
}
</style>
