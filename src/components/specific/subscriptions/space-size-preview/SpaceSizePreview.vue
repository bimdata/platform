<template>
  <div class="space-size-preview">
    <div class="space-size-preview__title">
      <h1>{{ $t("SpaceSizePreview.title") }}</h1>
    </div>
    <div class="space-size-preview__image">
      <img
        src="/static/space-size-preview-image.svg"
        alt="storage-preview-image"
      />
    </div>
    <div class="space-size-preview__actual-size">
      <ProgressBar width="100%" :progress="spaceInfo.usedSizePercent">
        <template #text-above-left>
          <span>
            {{ $t("SpaceSizePreview.actualStorage") }}
          </span>
        </template>
        <template #text-below-left>
          <span>
            {{ formatBytes(spaceInfo.smartDataSize) }}
          </span>
        </template>
        <template #text-below-right>
          <span>
            {{ formatBytes(spaceInfo.smartDataSizeAvailable) }}
          </span>
        </template>
      </ProgressBar>
      <BIMDataText color="color-tertiary-dark">
        {{ $t("SpaceSizePreview.actualStorageText") }}
      </BIMDataText>
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
            {{ formatBytes(spaceInfo.smartDataSize) }}
          </span>
        </template>
        <template #text-below-right>
          <span>
            {{ formatBytes(newSizeAvailable) }}
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
import { computed } from "vue";
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
    newSizeAvailable: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const newUsedSizePercent = computed(() => {
      return Math.round(
        props.spaceInfo.usedSizePercent *
          (props.spaceInfo.smartDataSizeAvailable / props.newSizeAvailable)
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
