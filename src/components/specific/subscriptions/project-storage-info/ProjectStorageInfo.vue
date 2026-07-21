<template>
  <div class="project-storage-info">
    <div class="project-storage-info__header">
      <div class="project-storage-info__header__values">
        {{
          $t("ProjectStorageInfo.usage", {
            used: formatBytes(totalUsed),
            total: formatBytes(quota),
          })
        }}
      </div>
    </div>
    <div class="project-storage-info__bar" role="progressbar">
      <span
        v-if="thisProjectPercent > 0"
        class="project-storage-info__bar__segment project-storage-info__bar__segment--this"
        :style="{ width: `${thisProjectPercent}%` }"
      ></span>
      <span
        v-if="othersPercent > 0"
        class="project-storage-info__bar__segment project-storage-info__bar__segment--others"
        :style="{ width: `${othersPercent}%` }"
      ></span>
    </div>
    <div class="project-storage-info__legend">
      <div class="project-storage-info__legend__item project-storage-info__legend__item--this">
        <span class="project-storage-info__legend__dot"></span>
        <span class="project-storage-info__legend__label">
          {{ $t("ProjectStorageInfo.currentProject") }}
        </span>
        <span class="project-storage-info__legend__value">
          ({{ formatBytes(currentProjectSize) }})
        </span>
      </div>
      <div class="project-storage-info__legend__item project-storage-info__legend__item--others">
        <span class="project-storage-info__legend__dot"></span>
        <span class="project-storage-info__legend__label">
          {{ $t("ProjectStorageInfo.otherProjects") }}
        </span>
        <span class="project-storage-info__legend__value">
          ({{ formatBytes(otherProjectsSize) }})
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { formatBytes } from "../../../../utils/files.js";

export default {
  props: {
    spaceSubInfo: {
      type: Object,
      required: true,
    },
    currentProjectSize: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const quota = computed(() => props.spaceSubInfo?.total_size_available ?? 0);
    const totalUsed = computed(() => props.spaceSubInfo?.total_size ?? 0);
    const otherProjectsSize = computed(() =>
      Math.max(0, totalUsed.value - props.currentProjectSize),
    );

    const percent = (value) => (quota.value > 0 ? Math.max(0, (value / quota.value) * 100) : 0);
    const thisProjectPercent = computed(() => percent(props.currentProjectSize));
    const othersPercent = computed(() => percent(otherProjectsSize.value));

    return {
      // References
      quota,
      totalUsed,
      otherProjectsSize,
      thisProjectPercent,
      othersPercent,
      // Methods
      formatBytes,
    };
  },
};
</script>

<style scoped lang="scss" src="./ProjectStorageInfo.scss"></style>
