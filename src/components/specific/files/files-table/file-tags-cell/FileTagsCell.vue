<template>
  <template v-if="isPillsMod">
    <div
      ref="cellPills"
      class="file-tags-cell-pills"
      @mouseenter="onHover"
      @mouseleave="isOver = false"
    >
      <template v-for="(tag, index) in file.tags.slice(0, 9)" :key="tag.id">
        <template v-if="file.tags.length > 9 && index === 8">
          <div class="file-tags-cell-pills__ellipsis-box">
            <BIMDataIcon
              class="file-tags-cell-pills__ellipsis-box__icon"
              name="ellipsis"
              size="xl"
              :rotate="90"
              style
            />
          </div>
        </template>
        <template v-else>
          <div
            class="file-tags-cell-pills__pill"
            :style="{
              backgroundColor: `#${tag.color}40`,
              border: `1px solid #${tag.color}`
            }"
          ></div>
        </template>
      </template>
      <template v-if="isOver">
        <BIMDataCard
          ref="tagList"
          class="file-tags-cell-pills__over"
          width="150px"
        >
          <template #content>
            <div class="file-tags-cell-pills__over__list">
              <template v-for="tag in file.tags" :key="tag.id">
                <div
                  class="file-tags-cell-pills__over__list__tag"
                  :style="{
                    color: `#${tag.color}`,
                    border: `1px solid #${tag.color}`
                  }"
                >
                  <BIMDataTextbox
                    class="file-tags-cell-pills__over__list__tag__text"
                    :text="tag.name"
                    maxWidth="150px"
                  />
                </div>
              </template>
            </div>
          </template>
        </BIMDataCard>
      </template>
    </div>
  </template>
  <template v-else>
    <div ref="cell" class="file-tags-cell">
      <template v-for="tag in file.tags" :key="tag.id">
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
            :maxWidth="`${cellWidth}px`"
          />
        </div>
      </template>
    </div>
  </template>
</template>

<script>
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";

export default {
  props: {
    file: {
      type: Object,
      required: true
    },
    filesTable: {
      type: Object
    }
  },
  setup(props) {
    const cellWidth = ref(0);
    const maxCellHeight = 43; // stand for two lines of tags
    const isPillsMod = ref(false);

    const onResize = entries => {
      entries.forEach(entry => {
        cellWidth.value = entry.contentRect.width;
        const height = entry.target.scrollHeight;
        isPillsMod.value = height > maxCellHeight;
      });
    };

    watch(isPillsMod, () => {
      if (isPillsMod.value) {
        cellObserver.disconnect();
      }
    });

    watch(
      () => props.file.tags,
      () => {
        if (isPillsMod.value) {
          isPillsMod.value = false;
          nextTick(() => cellObserver.observe(cell.value));
        }
      }
    );

    const cell = ref(null);
    const cellObserver = new ResizeObserver(onResize);

    onMounted(() => cellObserver.observe(cell.value));
    onUnmounted(() => cellObserver.disconnect());

    const tagList = ref(null);
    const cellPills = ref(null);

    const tagListPosition = () => {
      const { height: cellPillsHeight } =
        cellPills.value.getBoundingClientRect();

      const { height: heightFilesTable, y: yFilesTable } =
        props.filesTable.$el.getBoundingClientRect();

      const { height: heightTagList, y: yTagList } =
        tagList.value.$el.getBoundingClientRect();

      if (yTagList - yFilesTable + heightTagList > heightFilesTable) {
        tagList.value.$el.style.top =
          tagList.value.$el.style.top -
          heightTagList +
          cellPillsHeight +
          9 +
          "px";
      }
    };

    const isOver = ref(null);

    const onHover = () => {
      isOver.value = true;
      nextTick(() => tagListPosition());
    };

    return {
      // references
      cell,
      isOver,
      tagList,
      cellPills,
      cellWidth,
      maxCellHeight,
      isPillsMod,
      // methods
      onHover
    };
  }
};
</script>

<style scoped lang="scss" src="./FileTagsCell.scss"></style>
