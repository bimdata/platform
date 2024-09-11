<template>
  <div class="space-size-preview" :class="`space-size-preview--${layout}`">
    <div class="space-size-preview__title">
      <h1>{{ $t("SpaceSizePreview.title") }}</h1>
    </div>
    <div class="space-size-preview__image">
      <SpaceSizePreviewImage />
    </div>
    <div class="space-size-preview__actual-size">
      <ProgressBar width="100%" :progress="spaceSubInfo.usedSizePercent">
        <template #text-above-left>
          <span>
            {{ $t("SpaceSizePreview.actualStorage") }}
          </span>
        </template>
        <template #text-below-left>
          <span>
            {{ formatBytes(spaceSubInfo.total_size) }}
          </span>
        </template>
        <template #text-below-right>
          <span>
            {{ formatBytes(spaceSubInfo.total_size_available) }}
          </span>
        </template>
      </ProgressBar>
    </div>
    <div class="space-size-preview__new-size">
      <ProgressBar width="100%" :progress="newUsedSizePercent">
        <template #text-above-left>
          <span>
            {{ $t("SpaceSizePreview.newStorage") }}
          </span>
        </template>
        <template #text-below-left>
          <span>
            {{ formatBytes(spaceSubInfo.total_size) }}
          </span>
        </template>
        <template #text-below-right>
          <span>
            {{ formatBytes(newSizeAvailable) }}
          </span>
        </template>
      </ProgressBar>
      <BIMDataText color="color-granite-light">
        {{
          $t("SpaceSizePreview.newStorageText", {
            size: formatBytes(newSizeAvailable)
          })
        }}
      </BIMDataText>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { formatBytes } from "../../../../utils/files.js";
// Components
import ProgressBar from "../../../generic/progress-bar/ProgressBar.vue";

export default {
  components: {
    ProgressBar
  },
  props: {
    layout: {
      type: String,
      default: "vertical",
      validator: value => ["horizontal", "vertical"].includes(value)
    },
    spaceSubInfo: {
      type: Object,
      required: true
    },
    newSizeAvailable: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const newUsedSizePercent = computed(() => {
      return Math.round(
        props.spaceSubInfo.usedSizePercent *
          (props.spaceSubInfo.total_size_available /
            props.newSizeAvailable)
      );
    });

    return {
      // References
      newUsedSizePercent,
      // Methods
      formatBytes
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceSizePreview.scss"></style>
