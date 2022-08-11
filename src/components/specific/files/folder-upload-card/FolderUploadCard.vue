<template>
  <div class="folder-upload-card" :class="{ condensed, failed }">
    <div class="folder-upload-card--left">
      <BIMDataFileIcon fileName="folder" :size="condensed ? 20 : 32" />
    </div>
    <div class="folder-upload-card--center folder-upload-card__info">
      <div class="folder-upload-card__info__file-name">
        {{ file.name }}
      </div>
      <div v-show="uploading" class="folder-upload-card__info__progress-bar">
        <div
          class="progress-level"
          :style="{ width: `${progress.percentage}%` }"
        />
      </div>
      <div class="folder-upload-card__info__upload-data">
        <template v-if="uploading">
          <span>{{
            `${formatBytes(progress.uploaded)} of ${formatBytes(file.size)}` +
            ` (${progress.percentage}% done)`
          }}</span>
          <span>{{
            progress.rate ? `${formatBytes(progress.rate)}/s` : ""
          }}</span>
        </template>
        <template v-else>
          <span>
            {{ formatBytes(file.size) }}
            <span v-show="canceled" class="message">
              {{ $t("FileUploadCard.cancelMessage") }}
            </span>
            <span v-show="failed" class="message">
              {{ $t("FileUploadCard.errorMessage") }}
            </span>
          </span>
        </template>
      </div>
    </div>
    <div class="folder-upload-card--right">
      <BIMDataButton
        v-show="uploading"
        class="folder-upload-card__btn-cancel"
        width="24px"
        height="24px"
        ghost
        rounded
        icon
        @click="cancelUpload"
      >
        <BIMDataIcon name="close" size="xxxs" />
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from "vue";
import { useUpload } from "@/composables/upload.js";
import { formatBytes } from "@/utils/files.js";

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    // folder: {
    //   type: Object
    // },
    files: {
      type: Object,
      required: true
    },
    condensed: {
      type: Boolean,
      default: false
    }
  },
  emits: ["upload-completed", "upload-canceled", "upload-failed"],
  setup(props, { emit }) {
    const { projectFileUploader } = useUpload();

    const totalToUpload = ref(folder);
    const uploading = ref(false);
    const canceled = ref(false);
    const failed = ref(false);

    let lastProgressTime = null;
    const progress = reactive({
      percentage: 0,
      uploaded: 0,
      rate: 0
    });

    const handlers = {
      onUploadStart: () => {
        uploading.value = true;
      },
      onUploadProgress: ({ bytesUploaded, bytesTotal }) => {
        if (lastProgressTime) {
          const dt = (Date.now() - lastProgressTime) / 1000; // in seconds
          const dx = bytesUploaded - progress.uploaded; // in bytes
          progress.rate = Math.round(dx / dt);
        }
        progress.percentage = Math.round((100 * bytesUploaded) / bytesTotal);
        progress.uploaded = bytesUploaded;
        lastProgressTime = Date.now();
      },
      onUploadComplete: ({ response: document, bytesUploaded, bytesTotal }) => {
        uploading.value = false;
        emit("upload-completed", document);
      },
      onUploadError: () => {
        uploading.value = false;
        failed.value = true;
        emit("upload-failed");
      }
    };

    const uploader = projectFileUploader(props.project, handlers);

    const cancelUpload = () => {
      uploader.cancel();
      uploading.value = false;
      canceled.value = true;
      emit("upload-canceled");
    };

    onMounted(() => {
      files.forEach(file => {
        uploader.upload(file, file.parentId);
      });
    });

    return {
      // References
      canceled,
      failed,
      progress,
      uploading,
      // Methods
      cancelUpload,
      formatBytes
    };
  }
};
</script>

<style scoped lang="scss" src="./FileUploadCard.scss"></style>
