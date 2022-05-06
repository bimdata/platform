<template>
  <div class="tag-list">
    <template v-if="isSafeZone">
      <div class="tag-list__safe-zone">
        <span>{{ $t("Tag.deleteTag") }}</span>
        <div class="tag-list__safe-zone__action">
          <BIMDataButton
            color="high"
            fill
            radius
            height="28px"
            @click="onDeleteTag"
          >
            {{ $t("Tag.deleteTagButton") }}
          </BIMDataButton>
          <BIMDataButton
            color="primary"
            ghost
            rounded
            icon
            @click="isSafeZone = false"
          >
            <BIMDataIcon name="close" size="xxxs" />
          </BIMDataButton>
        </div>
      </div>
    </template>
    <div class="tag-list__content">
      <BIMDataCheckbox
        :modelValue="tag.isSelected"
        @update:modelValue="toggle(tag, $event)"
      />
      <div class="tag-list__content__info">
        <template v-if="!editTagName">
          <span>{{ tagName }}</span>
        </template>
        <template v-else>
          <BIMDataInput
            v-model="tagName"
            @keyup.enter.stop="onSubmitTagName"
            ref="input"
            style="margin: 0px"
          />
        </template>
        <div class="tag-list__content__info__action">
          <template v-if="!editTagName">
            <BIMDataButton ghost rounded icon @click="editTagName = true">
              <BIMDataIcon name="edit" size="xxs" fill color="default" />
            </BIMDataButton>
          </template>
          <template v-else>
            <BIMDataButton ghost rounded icon @click="onCancelSubmitTagName">
              <BIMDataIcon name="close" size="xxs" fill color="default" />
            </BIMDataButton>
          </template>
          <BIMDataButton ghost rounded icon @click="isSafeZone = true">
            <BIMDataIcon name="delete" size="xxs" fill color="high" />
          </BIMDataButton>
          <div class="tag-list__content__info__action__color-selector">
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
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useTag } from "@/state/tag.js";

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    tag: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "tag-updater", "fetch-tags"],
  setup(props, { emit }) {
    const { updateTag, deleteTag } = useTag();

    const color = ref("c0c0c0");

    const tagName = ref(props.tag.name);
    const editTagName = ref(false);
    const input = ref(null);

    watch(editTagName, () =>
      setTimeout(() => editTagName.value && input.value.focus(), 50)
    );

    const onSubmitTagName = async () => {
      if (tagName.value && tagName.value !== props.tag.name) {
        await updateTag(props.project, props.tag, {
          name: tagName.value
        });
        editTagName.value = false;
        emit("fetch-tags");
      }
    };

    const onCancelSubmitTagName = () => {
      tagName.value = props.tag.name;
      editTagName.value = false;
    };

    const isSafeZone = ref(false);

    const onDeleteTag = async () => {
      await deleteTag(props.project, props.tag);
      emit("fetch-tags");
      isSafeZone.value = false;
    };

    const displayColorSelector = ref(false);
    const toggle = (tag, checked) => {
      tag.isSelected = checked;
      emit("tag-updater", tag);
    };

    const updateColorSelector = choosenColor => {
      console.log("update color", choosenColor);
      color.value = choosenColor;
    };

    return {
      // references
      color,
      input,
      tagName,
      displayColorSelector,
      editTagName,
      isSafeZone,
      console,
      // methods
      updateColorSelector,
      onCancelSubmitTagName,
      onSubmitTagName,
      onDeleteTag,
      toggle
    };
  }
};
</script>

<style scoped lang="scss" src="./TagList.scss"></style>
