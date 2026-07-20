<template>
  <div class="project-storage-info">
    <div class="project-storage-info__header">
      <div class="project-storage-info__header__label">
        <BIMDataIconCloud size="xxs" />
        <span>{{ $t("ProjectStorageInfo.title") }}</span>
      </div>
      <div class="project-storage-info__header__values">
        {{
          $t("ProjectStorageInfo.usage", {
            used: formatBytes(spaceSubInfo.total_size ?? 0),
            total: formatBytes(spaceSubInfo.total_size_available ?? 0),
          })
        }}
      </div>
    </div>
    <ProgressBar
      class="project-storage-info__bar"
      width="100%"
      :progress="spaceSubInfo.usedSizePercent ?? 0"
    />
  </div>
</template>

<script>
import { formatBytes } from "../../../../utils/files.js";
// Components
import ProgressBar from "../../../generic/progress-bar/ProgressBar.vue";

export default {
  components: {
    ProgressBar,
  },
  props: {
    spaceSubInfo: {
      type: Object,
      required: true,
    },
  },
  setup() {
    return {
      // Methods
      formatBytes,
    };
  },
};
</script>

<style scoped lang="scss" src="./ProjectStorageInfo.scss"></style>
