<template>
  <div class="folder-upload-card" :class="{ condensed, failed }">
    <div class="folder-upload-card--left">
      <BIMDataIcon name="folder" />
    </div>
    <div class="folder-upload-card--center folder-upload-card__info">
      <div class="folder-upload-card__info__file-name">
        {{ folder.folderName }}
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
            `${formatBytes(progress.folderUploaded)} of ${formatBytes(
              folder.size
            )}` + ` (${progress.percentage}% done)`
          }}</span>
          <span>{{
            progress.rate ? `${formatBytes(progress.rate)}/s` : ""
          }}</span>
        </template>
        <template v-else>
          <span>
            {{ formatBytes(folder.size) }}
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
import { reactive, ref, watch } from "vue";
import { useUpload } from "@/composables/upload.js";
import { formatBytes } from "@/utils/files.js";

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    folder: {
      type: Object,
      default: () => {}
    },
    condensed: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "upload-completed",
    "upload-canceled",
    "upload-failed",
    "emptying-folder"
  ],
  setup(props, { emit }) {
    const { projectFileUploader } = useUpload();

    const uploading = ref(false);
    const canceled = ref(false);
    const failed = ref(false);

    let lastProgressTime = null;
    const progress = reactive({
      percentage: 0,
      fileUploaded: 0,
      folderUploaded: 0,
      rate: 0
    });

    const handlers = {
      onUploadStart: () => {
        uploading.value = true;
      },
      onUploadProgress: ({ bytesUploaded, bytesTotal }) => {
        const currentlyUploaded = bytesUploaded - progress.fileUploaded;
        progress.folderUploaded += currentlyUploaded;

        if (lastProgressTime) {
          const dt = (Date.now() - lastProgressTime) / 1000; // in seconds
          const dx = currentlyUploaded; // in bytes
          progress.rate = Math.round(dx / dt);
        }
        progress.percentage = Math.round(
          (100 * progress.folderUploaded) / props.folder.size
        );

        progress.fileUploaded = bytesUploaded;
        lastProgressTime = Date.now();

        if (bytesUploaded >= bytesTotal) {
          progress.fileUploaded = 0;

          const index = files.value.findIndex(
            f => f.key === currentFile.value.key
          );
          files.value.splice(index, 1);
          if (files.value.length === 0) {
            uploading.value = false;
            emit("upload-completed");
            emit("emptying-folder");
          }
        }
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

    const files = ref(props.folder.files);
    const currentFile = ref(null);

    watch(
      files.value,
      async () => {
        if (files.value.length === 0) return;
        currentFile.value = files.value[0];
        await uploader.upload(
          currentFile.value.file,
          currentFile.value.parentId
        );
      },
      { immediate: true }
    );

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

<style scoped lang="scss" src="./FolderUploadCard.scss"></style>
