<template>
  <div class="file-tags-cell">
    <template v-for="tag in tagsToDisplay" :key="tag.id">
      <div
        class="file-tags-cell__tag"
        :style="{
          color: `#${tag.color}`,
          border: `1px solid #${tag.color}`
        }"
      >
        <BIMDataTextbox
          class="file-tags-cell__tag__text"
          :text="tag.name"
          maxWidth="58px"
        />
      </div>
    </template>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const tagsToDisplay = computed(() => {
      return props.file.tags;
    });
    return {
      tagsToDisplay,
      console
    };
  }
};
// soit 3 tags en dessous x pxl
// soit 2 tags dont 1 qui est au dessus de x pxl
</script>

<style scoped lang="scss" src="./FileTagsCell.scss"></style>
