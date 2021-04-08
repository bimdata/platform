<template>
  <img
    class="file-icon"
    :width="size"
    :height="(+size * 4) / 3"
    :src="icons[`icon_${name}`]"
  />
</template>

<script>
import icons from "./icons";

export default {
  props: {
    name: {
      type: String,
      default: "unknown"
    },
    size: {
      type: [String, Number],
      default: "16"
    }
  },
  setup() {
    return {
      icons
    };
  }
};
</script>

<style scoped lang="scss" src="./FileIcon.scss"></style>
