<script setup>
import seedrandom from "seedrandom";
import colors from "./colors.js";
import fallbackImages from "./fallback-images/index.js";

defineOptions({
  components: {
    ...fallbackImages
  },
});

const props = defineProps({
  space: {
    type: Object,
    required: true
  },
  topStripe: {
    type: Boolean,
    default: false
  }
});

const rng = seedrandom(props.space.id.toString());
const randomNumber = n => Math.abs(rng.int32()) % n;

const fallbackImageNames = Object.keys(fallbackImages);
const fallbackImage = fallbackImageNames[randomNumber(fallbackImageNames.length)];

const svgColors = colors[randomNumber(colors.length)];

const svgColorCodes = Object.values(svgColors);
const stripeColor = svgColorCodes[randomNumber(svgColorCodes.length)];

const svg = { ...svgColors };
</script>

<template>
  <div class="space-card-image">
    <div
      v-if="topStripe"
      class="space-card-image__top-stripe"
      :style="{ backgroundColor: stripeColor }"
    ></div>
    <img v-if="space.image" loading="lazy" :src="space.image" />
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

<style scoped src="./SpaceCardImage.css"></style>
