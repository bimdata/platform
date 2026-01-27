<template>
  <template v-if="isPillsMod">
    <div
      ref="cellPills"
      class="model-tags-cell-pills"
      @mouseenter="hasTags && onHover()"
      @mouseleave="isOver = false"
    >
      <template v-for="(tag, index) in model.tags.slice(0, 9)" :key="tag.id">
        <template v-if="model.tags.length > 9 && index === 8">
          <div class="model-tags-cell-pills__ellipsis-box">
            <BIMDataIconEllipsis
              class="model-tags-cell-pills__ellipsis-box__icon"
              size="xl"
              :rotate="90"
              style
            />
          </div>
        </template>
        <template v-else>
          <div
            class="model-tags-cell-pills__pill"
            :style="{
              backgroundColor: `#${tag.color}40`,
              border: `1px solid #${tag.color}`,
            }"
          ></div>
        </template>
      </template>
      <BIMDataCard v-show="isOver" ref="tagList" class="model-tags-cell-pills__over" width="150px">
        <template #content>
          <div class="model-tags-cell-pills__over__list">
            <template v-for="tag in model.tags" :key="tag.id">
              <div
                class="model-tags-cell-pills__over__list__tag"
                :style="{
                  color: `#${tag.color}`,
                  border: `1px solid #${tag.color}`,
                }"
              >
                <BIMDataTextbox
                  class="model-tags-cell-pills__over__list__tag__text"
                  :text="tag.name"
                  maxWidth="150px"
                />
              </div>
            </template>
          </div>
        </template>
      </BIMDataCard>
    </div>
  </template>
  <template v-else>
    <div ref="cell" class="model-tags-cell">
      <template v-for="tag in model.tags" :key="tag.id">
        <div
          class="model-tags-cell__tag"
          :style="{
            color: `#${tag.color}`,
            border: `1px solid #${tag.color}`,
          }"
        >
          <BIMDataTextbox
            class="model-tags-cell__tag__text"
            :text="tag.name"
            :maxWidth="`${cellWidth}px`"
          />
        </div>
      </template>
    </div>
  </template>
</template>

<script>
import { nextTick, onMounted, onUnmounted, ref, watch, computed } from "vue";
import { dropdownPositioner } from "../../../../../utils/positioner.js";

export default {
  props: {
    model: {
      type: Object,
      required: true,
    },
    parent: {
      type: Object,
    },
  },
  setup(props) {
    const cellWidth = ref(0);
    const maxCellHeight = 43; // stand for two lines of tags
    const isPillsMod = ref(false);
    const hasTags = computed(() => props.model.tags?.length > 0);

    const onResize = (entries) => {
      entries.forEach((entry) => {
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
      () => props.model.tags,
      () => {
        if (isPillsMod.value) {
          isPillsMod.value = false;
          nextTick(() => cellObserver.observe(cell.value));
        }
      },
    );

    const cell = ref(null);
    const cellObserver = new ResizeObserver(onResize);

    onMounted(() => cellObserver.observe(cell.value));
    onUnmounted(() => cellObserver.disconnect());

    const tagList = ref(null);
    const cellPills = ref(null);

    const isOver = ref(false);

    const onHover = () => {
      if (!hasTags.value) return;
      isOver.value = true;
      nextTick(() => {
        tagList.value.$el.style.top = dropdownPositioner(props.parent.$el, tagList.value.$el, 9);
      });
    };

    return {
      // references
      cell,
      isOver,
      hasTags,
      tagList,
      cellPills,
      cellWidth,
      maxCellHeight,
      isPillsMod,
      // methods
      onHover,
    };
  },
};
</script>

<style scoped lang="scss" src="./ModelTagsCell.scss"></style>
