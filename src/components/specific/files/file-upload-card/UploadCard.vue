<template>
  <div class="upload-card" :class="{ condensed, failed }">
    <div class="upload-card--left">
      <template v-if="type === 'folder'">
        <BIMDataIconFolder size="s" />
      </template>
      <template v-else>
        <BIMDataFileIcon :fileName="name" :size="condensed ? 20 : 32" />
      </template>
    </div>
    <div class="upload-card--center upload-card__info">
      <div class="upload-card__info__name">
        {{ name }}
      </div>
      <div v-show="uploading" class="upload-card__info__progress">
        <div class="level" :style="{ width: `${percentage}%` }"></div>
      </div>
      <div class="upload-card__info__data">
        <template v-if="uploading">
          <span>
            {{
              $t("UploadCard.upload", {
                uploaded: formatBytes(uploaded),
                total: formatBytes(total),
                percentage
              })
            }}
          </span>
          <span>
            {{ rate ? `${formatBytes(rate)}/s` : "" }}
          </span>
        </template>
        <template v-else>
          <span>
            {{ formatBytes(total) }}
            <span v-show="canceled" class="message">
              {{ $t("UploadCard.cancelMessage") }}
            </span>
            <span v-show="failed" class="message">
              {{ $t("UploadCard.errorMessage") }}
            </span>
          </span>
        </template>
      </div>
    </div>
    <div class="upload-card--right">
      <BIMDataButton
        v-show="uploading"
        class="upload-card__btn-cancel"
        width="24px"
        height="24px"
        ghost
        rounded
        icon
        @click="$emit('cancel')"
      >
        <BIMDataIconClose size="xxxs" />
      </BIMDataButton>
    </div>
  </div>
</template>

<script setup>
import { formatBytes } from "../../../../utils/files.js";

defineProps({
  type: {
    type: String,
    required: true,
    validator: v => ["file", "folder"].includes(v)
  },
  name: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    default: 0
  },
  uploaded: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  rate: {
    type: Number,
    default: 0
  },
  uploading: {
    type: Boolean,
    default: false
  },
  failed: {
    type: Boolean,
    default: false
  },
  canceled: {
    type: Boolean,
    default: false
  },
  condensed: {
    type: Boolean,
    default: false
  }
});

defineEmits(["cancel"]);
</script>

<style scoped lang="scss" src="./UploadCard.scss"></style>
