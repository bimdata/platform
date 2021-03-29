<template>
  <img class="file-icon" :wdith="size" :height="size" :src="`./${name}.svg`" />
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: "unknown"
    },
    size: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped lang="scss" src="./FileIcon.scss"></style>
