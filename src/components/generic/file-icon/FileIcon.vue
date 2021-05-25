<template>
  <img
    class="file-icon"
    :width="size"
    :height="(+size * 4) / 3"
    :src="`/static/file-icons/${name || 'unknown'}.svg`"
  />
</template>

<script>
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
  }
};
</script>

<style scoped lang="scss" src="./FileIcon.scss"></style>
