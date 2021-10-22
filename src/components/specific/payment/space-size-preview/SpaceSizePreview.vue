<template>
  <div class="space-size-preview">
    <div class="storage-preview__title">
      <h1>{{ $t("SpaceSizePreview.title") }}</h1>
    </div>
    <div class="space-size-preview__logo">
      <img
        src="/static/space-size-preview-image.svg"
        alt="storage-preview-image"
      />
    </div>
    <div class="space-size-preview__actual">
      <ProgressBar
        class="m-b-12"
        componentWidth="100%"
        :progressPercent="spaceInfo.remainingSizePercent"
      >
        <template #text-left-above>
          <span>
            {{ $t("SpaceSizePreview.actualStorage") }}
          </span>
        </template>
        <template #text-left-below>
          <span>
            {{ formatBytes(spaceInfo.smartDataSize) }}
          </span>
        </template>
        <template #text-right-below>
          <span>
            {{ formatBytes(spaceInfo.smartDataSizeAvailable) }}
          </span>
        </template>
      </ProgressBar>
      <BIMDataText color="color-tertiary-dark">
        {{ $t("SpaceSizePreview.actualStorageText") }}
      </BIMDataText>
    </div>
    <div class="space-size-preview__new">
      <ProgressBar class="m-b-12" componentWidth="100%" :progressPercent="15">
        <template #text-left-above>
          <span>
            {{ $t("SpaceSizePreview.newStorage") }}
          </span>
        </template>
        <template #text-left-below>
          <span>
            {{ formatBytes(spaceInfo.smartDataSize) }}
          </span>
        </template>
        <template #text-right-below>
          <span>
            {{ formatBytes(newSpaceSize) }}
          </span>
        </template>
      </ProgressBar>
      <BIMDataText color="color-tertiary-dark">
        {{ $t("SpaceSizePreview.newStorageText") }}
      </BIMDataText>
    </div>
  </div>
</template>

<script>
import { formatBytes } from "@/utils/files.js";
// Components
import ProgressBar from "@/components/generic/progress-bar/ProgressBar.vue";

export default {
  components: {
    ProgressBar
  },
  props: {
    spaceInfo: {
      type: Object,
      required: true
    },
    newSpaceSize: {
      type: Number,
      required: true
    }
  },
  setup() {
    return {
      // Methods
      formatBytes
    };
  }
};
</script>

<style scoped lang="scss" src="./SpaceSizePreview.scss"></style>
