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
      <div ref="tagContent" class="tags-item__content__info">
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
            @click="onColorSelector"
          ></div>
          <template v-if="displayColorSelector">
            <div
              ref="colorSelector"
              class="tags-item__content__info__action__color-selector"
            >
              <ColorSelector
                :modelValue="tagColor"
                @update:modelValue="onSubmitTagColor"
                v-click-away="
                  () => {
                    displayColorSelector = false;
                  }
                "
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, ref, watch } from "vue";

import TagService from "@/services/TagService";
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
    tagsMain: {
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
    const tagName = ref(props.tag.name);
    const editTagName = ref(false);
    const tagContent = ref(null);
    const input = ref(null);

    watch(editTagName, () =>
      setTimeout(() => editTagName.value && input.value.focus(), 50)
    );

    const onSubmitTagName = async () => {
      if (tagName.value && tagName.value !== props.tag.name) {
        await TagService.updateTag(props.project, props.tag, {
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
      await TagService.deleteTag(props.project, props.tag);
      emit("fetch-tags");
      emit("file-updated");
      isSafeZone.value = false;
    };

    const toggle = async (tag, checked) => {
      if (checked) {
        await TagService.addDocumentTag(props.project, props.document, {
          id: tag.id,
          name: tag.name,
          color: tag.color
        });
      } else {
        await TagService.deleteDocumentTag(props.project, props.document, tag);
      }
      tag.isSelected = checked;
      emit("tag-updater", tag);
    };

    const tagColor = ref(props.tag.color);
    const displayColorSelector = ref(false);

    const onSubmitTagColor = async colorValue => {
      if (colorValue !== props.tag.color) {
        await TagService.updateTag(props.project, props.tag, {
          color: colorValue
        });
        tagColor.value = colorValue;
        emit("fetch-tags");
        emit("file-updated");
      }
    };

    const onColorSelector = () => {
      displayColorSelector.value = true;
      nextTick(() => colorPanelPosition());
    };

    const colorSelector = ref(null);

    const colorPanelPosition = () => {
      const { height: tagHeight } = tagContent.value.getBoundingClientRect();

      colorSelector.value.style.top = tagHeight + "px";

      const { height: heightTagsMain, y: yTagsMain } =
        props.tagsMain.getBoundingClientRect();
      const { height: heightColorPanel, y: yColorPanel } =
        colorSelector.value.getBoundingClientRect();

      if (yColorPanel - yTagsMain + heightColorPanel > heightTagsMain) {
        colorSelector.value.style.top = "-" + heightColorPanel + "px";
      }
    };

    return {
      // references
      input,
      tagName,
      tagColor,
      tagContent,
      isSafeZone,
      editTagName,
      colorSelector,
      displayColorSelector,
      // methods
      onCancelSubmitTagName,
      adjustBorderColor,
      onSubmitTagColor,
      onSubmitTagName,
      onColorSelector,
      onDeleteTag,
      toggle
    };
  }
};
</script>

<style scoped lang="scss" src="./TagsItem.scss"></style>
