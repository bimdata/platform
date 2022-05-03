<template>
  <div class="tag-list">
    <BIMDataCheckbox
      :modelValue="tag.isSelected"
      @update:modelValue="toggle(tag, $event)"
    />
    <div class="tag-list__info">
      <span>{{ tag.name }}</span>
      <div class="tag-list__info__action">
        <BIMDataButton color="high" icon margin="12px">
          <BIMDataIcon name="edit" size="xxs" />
        </BIMDataButton>
        <BIMDataButton fillColor color="primary" icon margin="12px">
          <BIMDataIcon name="delete" size="xxs" />
        </BIMDataButton>
        <div class="tag-list__info__action__color-selector">
          <div
            :style="{
              'background-color': `#${color}`
            }"
            @click="displayColorSelector = true"
          ></div>
          <BIMDataColorSelector
            v-if="displayColorSelector"
            v-click-away="() => (displayColorSelector = false)"
            :modelValue="color"
            @update:modelValue="updateColorSelector($event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    tag: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "tag-updater"],
  setup(_, { emit }) {
    const color = ref("c0c0c0");
    const displayColorSelector = ref(false);
    const toggle = (tag, checked) => {
      tag.isSelected = checked;
      console.log("tag in toggle", tag);
      emit("tag-updater", tag);
    };

    const updateColorSelector = choosenColor => {
      console.log("update color", choosenColor);
      color.value = choosenColor;
    };

    return {
      color,
      displayColorSelector,
      console,
      // methods
      updateColorSelector,
      toggle
    };
  }
};
</script>

<style scoped lang="scss" src="./TagList.scss"></style>
