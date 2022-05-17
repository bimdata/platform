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
import { isEmpty } from "lodash";

export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const tagStyle = {
      maxBoxWidth: 126 * 2,
      maxTagWidth: 58,
      fontSize: 10,
      paddingX: 5,
      gap: 3
    };

    const isTooWide = sumTagSize => tagStyle.maxBoxWidth < sumTagSize;

    const tagDispatcher = (tagsWithSize, sumTagSize) => {
      let tagList = {
        displayedArray: [],
        hiddedArray: []
      };
      for (const tag of tagsWithSize.reverse()) {
        sumTagSize -= tag.size;

        if (isTooWide(sumTagSize)) {
          tagList.hiddedArray.push(tag);
        } else {
          tagList.displayedArray = tagsWithSize.slice(
            0,
            tagsWithSize.length - tagList.hiddedArray.length
          );
          break;
        }
      }
      return tagList;
    };

    const tagsToDisplay = computed(() => {
      if (!isEmpty(props.file.tags)) {
        const sizeOfStyle = tagStyle.paddingX * 2 + tagStyle.gap;

        const tagsWithSize = props.file.tags.map(tag => {
          const size = tag.name.length * (tagStyle.fontSize / 2);

          return {
            ...tag,
            size:
              size < tagStyle.maxTagWidth
                ? size + sizeOfStyle
                : tagStyle.maxTagWidth + sizeOfStyle
          };
        });

        let sumTagSize = tagsWithSize.reduce((a, b) => a + b.size, 0);

        if (isTooWide(sumTagSize)) {
          const res = tagDispatcher(tagsWithSize, sumTagSize);
          console.log("res", res);
          return props.file.tags;
        } else {
          return props.file.tags;
        }
      } else {
        return props.file.tags;
      }
    });
    return {
      tagsToDisplay,
      console
    };
  }
};
</script>

<style scoped lang="scss" src="./FileTagsCell.scss"></style>
