<template>
  <div class="space-image" :style="{ backgroundColor: color }">
    <img v-if="space.image" :src="space.image" />
    <svg v-else viewBox="-37 -27.5 215 196" :style="{
      '--dark-color': colorDark,
      '--color': color,
      '--light-color': colorLight
    }">
      <component :is="fallbackImage" />
    </svg>
  </div>
</template>

<script>
import seedrandom from 'seedrandom';
import colors from './colors';
import fallbackImages from './fallback-images';

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
    const randomNumber = () => Math.abs(rng.int32());
    const color = colors[randomNumber() % colors.length];
    let fallbackImage = '';
    const fallbackImageNames = Object.keys(fallbackImages);
    fallbackImage = fallbackImageNames[randomNumber() % fallbackImageNames.length];
    return {
      fallbackImage,
      ...color
    };
  }
}
</script>

<style scoped lang="scss" src="./SpaceImage.scss"></style>
