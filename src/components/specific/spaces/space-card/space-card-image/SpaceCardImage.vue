<template>
  <div class="space-card-image" :style="{ backgroundColor }">
    <img v-if="space.image" :src="space.image" />
    <svg
      v-else
      viewBox="-37 -27.5 215 196"
      :style="{
        '--color': svg.color,
        '--dark-color': svg.colorDark,
        '--light-color': svg.colorLight
      }"
    >
      <component :is="fallbackImage" />
    </svg>
  </div>
</template>

<script>
import seedrandom from "seedrandom";
import colors from "./colors";
import fallbackImages from "./fallback-images";

export default {
  components: {
    ...fallbackImages
  },
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const rng = seedrandom(props.space.id.toString());
    const randomNumber = n => Math.abs(rng.int32()) % n;

    const fallbackImageNames = Object.keys(fallbackImages);
    const fallbackImage =
      fallbackImageNames[randomNumber(fallbackImageNames.length)];

    const svgColors = colors[randomNumber(colors.length)];

    const svgColorCodes = Object.values(svgColors);
    const backgroundColor = svgColorCodes[randomNumber(svgColorCodes.length)];

    return {
      backgroundColor,
      fallbackImage,
      svg: {
        ...svgColors
      }
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceCardImage.scss"></style>
