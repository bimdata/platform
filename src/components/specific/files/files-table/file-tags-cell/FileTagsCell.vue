<template>
  <div class="file-tags-cell">
    {{ console.log("tagList", tagList) }}
    <template v-for="tag in tagList.displayedArray" :key="tag.id">
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
import { isEmpty } from "lodash";
import { addSizeToTag, isTooWide, tagDispatcher } from "./tag-config";

export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const tagList = computed(() => {
      if (!isEmpty(props.file.tags)) {
        const tagsWithSize = addSizeToTag(props.file.tags);
        let sumTagSize = tagsWithSize.reduce((a, b) => a + b.size, 0);

        if (isTooWide(sumTagSize)) {
          return tagDispatcher(tagsWithSize, sumTagSize);
        } else {
          return { displayedArray: props.file.tags };
        }
      } else {
        return { displayedArray: [] };
      }
    });
    return {
      tagList,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./FileTagsCell.scss"></style>
