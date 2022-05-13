<template>
  <div class="file-tags-cell">
    {{ console.log("file", file) }}
    <template v-for="tag in file.tags" :key="tag.id">
      <div class="file-tags-cell__tag">
        <span
          :style="{
            color: `#${tag.color}`,
            border: `1px solid #${tag.color}`
          }"
          >{{ tag.name }}</span
        >
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./FileTagsCell.scss"></style>
