<template>
  <div class="storage-preview">
    <div class="storage-preview__title">
      <h1>{{ $t("StoragePreview.title") }}</h1>
    </div>
    <div class="storage-preview__logo">
      <img
        src="/static/storage-preview-image.svg"
        alt="storage-preview-image"
      />
    </div>
    <div class="storage-preview__actual">
      <ProgressBar class="m-b-12" componentWidth="100%" :progressPercent="36">
        <template #text-left-above>
          {{ $t("StoragePreview.actualStorage") }}
        </template>
        <template #text-left-below>
          <span>125MB</span>
        </template>
        <template #text-right-below>
          <span>500MB</span>
        </template>
      </ProgressBar>
      <BIMDataText color="color-tertiary-dark">
        {{ $t("StoragePreview.actualStorageText") }}
      </BIMDataText>
    </div>
    <div class="storage-preview__new">
      <ProgressBar class="m-b-12" componentWidth="100%" :progressPercent="15">
        <template #text-left-above>
          {{ $t("StoragePreview.newStorage") }}
        </template>
        <template #text-left-below>
          <span>125MB</span>
        </template>
        <template #text-right-below>
          <span>10GB</span>
        </template>
      </ProgressBar>
      <BIMDataText color="color-tertiary-dark">
        {{ $t("StoragePreview.newStorageText") }}
      </BIMDataText>
    </div>
  </div>
</template>

<script>
// Components
import ProgressBar from "@/components/generic/progress-bar/ProgressBar.vue";

export default {
  components: {
    ProgressBar
  },
  props: {
    // TODO
  },
  setup() {
    // TODO
  }
};
</script>

<style scoped lang="scss" src="./StoragePreview.scss"></style>
