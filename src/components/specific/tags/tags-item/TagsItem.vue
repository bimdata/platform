<template>
  <div
    class="tags-item"
    v-click-away="
      () => {
        editTagName = false;
        isSafeZone = false;
      }
    "
  >
    <template v-if="isSafeZone">
      <div class="tags-item__safe-zone">
        <span>{{ $t("Tag.deleteTag") }}</span>
        <div class="tags-item__safe-zone__action">
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
    <div class="tags-item__content">
      <BIMDataCheckbox
        :modelValue="tag.isSelected"
        @update:modelValue="toggle(tag, $event)"
      />
      <div class="tags-item__content__info">
        <template v-if="!editTagName">
          <BIMDataTextbox :text="tagName" width="250px" />
        </template>
        <template v-else>
          <BIMDataInput
            v-model="tagName"
            @keyup.enter.stop="onSubmitTagName"
            ref="input"
            margin="-12px 0px 0px 0px"
          />
        </template>
        <div class="tags-item__content__info__action">
          <template v-if="!editTagName">
            <BIMDataIcon
              name="edit"
              size="xxs"
              fill
              color="default"
              margin="0 12px 0 0"
              @click="editTagName = true"
            />
          </template>
          <template v-else>
            <BIMDataIcon
              name="close"
              size="xxs"
              fill
              color="default"
              margin="0 12px 0 0"
              @click="onCancelSubmitTagName"
            />
          </template>
          <BIMDataIcon
            name="delete"
            size="xxs"
            fill
            color="high"
            margin="0 12px 0 0"
            @click="isSafeZone = true"
          />

          <div
            class="tags-item__content__info__action__color"
            :style="{
              'background-color': `#${tagColor}`,
              'border-color': adjustBorderColor(`${tagColor}`, -50)
            }"
            @click="displayColorSelector = true"
          ></div>
          <template v-if="displayColorSelector">
            <ColorSelector
              class="tags-item__content__info__action__color-selector"
              :modelValue="tagColor"
              @update:modelValue="onSubmitTagColor"
              v-click-away="
                () => {
                  displayColorSelector = false;
                }
              "
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

import { useTag } from "@/state/tag.js";
import { adjustBorderColor } from "@/components/generic/color-selector/colors.js";

import ColorSelector from "@/components/generic/color-selector/ColorSelector.vue";

export default {
  components: { ColorSelector },
  props: {
    project: {
      type: Object,
      required: true
    },
    document: {
      type: Object,
      required: true
    },
    tag: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "tag-updater", "fetch-tags", "file-updated"],
  setup(props, { emit }) {
    const { updateTag, deleteTag, addDocumentTag, deleteDocumentTag } =
      useTag();
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
        emit("file-updated");
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
      emit("file-updated");
      isSafeZone.value = false;
    };

    const toggle = async (tag, checked) => {
      if (checked) {
        await addDocumentTag(props.project, props.document, {
          id: tag.id,
          name: tag.name,
          color: tag.color
        });
      } else {
        await deleteDocumentTag(props.project, props.document, tag);
      }
      tag.isSelected = checked;
      emit("tag-updater", tag);
    };

    const tagColor = ref(props.tag.color);
    const displayColorSelector = ref(false);

    const onSubmitTagColor = async colorValue => {
      if (colorValue !== props.tag.color) {
        await updateTag(props.project, props.tag, {
          color: colorValue
        });
        tagColor.value = colorValue;
        emit("fetch-tags");
        emit("file-updated");
      }
    };

    return {
      // references
      input,
      tagName,
      tagColor,
      editTagName,
      isSafeZone,
      // methods
      onSubmitTagColor,
      adjustBorderColor,
      onCancelSubmitTagName,
      displayColorSelector,
      onSubmitTagName,
      onDeleteTag,
      toggle
    };
  }
};
</script>

<style scoped lang="scss" src="./TagsItem.scss"></style>
