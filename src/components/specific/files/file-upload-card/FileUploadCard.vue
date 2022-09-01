<template>
  <div class="file-upload-card" :class="{ condensed, failed }">
    <div class="file-upload-card--left">
      <template v-if="file.type === FILE_TYPE.FOLDER">
        <BIMDataIcon name="folder" size="s" />
      </template>
      <template v-else>
        <BIMDataFileIcon :fileName="file.name" :size="condensed ? 20 : 32" />
      </template>
    </div>
    <div class="file-upload-card--center file-upload-card__info">
      <div class="file-upload-card__info__file-name">
        {{ file.name }}
      </div>
      <div v-show="uploading" class="file-upload-card__info__progress-bar">
        <div
          class="progress-level"
          :style="{ width: `${progress.percentage}%` }"
        />
      </div>
      <div class="file-upload-card__info__upload-data">
        <template v-if="uploading">
          <span>{{
            `${formatBytes(
              file.type === FILE_TYPE.FOLDER
                ? progress.folderUploaded
                : progress.uploaded
            )} of ${formatBytes(file.size)}` + ` (${progress.percentage}% done)`
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
    <div class="file-upload-card--right">
      <BIMDataButton
        v-show="uploading"
        class="file-upload-card__btn-cancel"
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
import { onMounted, reactive, ref, watch } from "vue";
import { formatBytes } from "../../../../utils/files.js";
import { useUpload } from "../../../../composables/upload.js";
import { FILE_TYPE } from "../../../../config/files.js";

export default {
  props: {
    isModelUpload: {
      type: Boolean,
      default: false
    },
    project: {
      type: Object,
      required: true
    },
    folder: {
      type: Object
    },
    file: {
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
    const { projectFileUploader, projectModelUploader } = useUpload();

    const simultaneousUploadLimit = 3;
    const uploading = ref(false);
    const canceled = ref(false);
    const failed = ref(false);

    let lastProgressTime = null;
    const progress = reactive({
      percentage: 0,
      uploaded: 0,
      fileUploaded: {},
      folderUploaded: 0,
      onGoingUploadsCounter: 0,
      rate: 0
    });

    const handlers = {
      onUploadStart: () => {
        uploading.value = true;
        progress.onGoingUploadsCounter++;
      },
      onUploadProgress: ({ bytesUploaded, bytesTotal, id }) => {
        if (props.file.type === FILE_TYPE.FOLDER) {
          const currentlyUploaded = bytesUploaded - progress.fileUploaded[id];
          progress.folderUploaded += currentlyUploaded;

          if (lastProgressTime) {
            const dt = (Date.now() - lastProgressTime) / 1000; // in seconds
            const dx = currentlyUploaded; // in bytes
            progress.rate = Math.round(dx / dt);
          }
          progress.percentage = Math.round(
            (100 * progress.folderUploaded) / props.file.size
          );

          progress.fileUploaded[id] = bytesUploaded;
          lastProgressTime = Date.now();

          if (
            bytesUploaded >= bytesTotal &&
            progress.onGoingUploadsCounter < simultaneousUploadLimit
          ) {
            files.value.shift();
          }
        } else {
          if (lastProgressTime) {
            const dt = (Date.now() - lastProgressTime) / 1000; // in seconds
            const dx = bytesUploaded - progress.uploaded; // in bytes
            progress.rate = Math.round(dx / dt);
          }
          progress.percentage = Math.round((100 * bytesUploaded) / bytesTotal);
          progress.uploaded = bytesUploaded;
          lastProgressTime = Date.now();
        }
      },
      onUploadComplete: ({ response: document }) => {
        progress.onGoingUploadsCounter--;

        if (progress.onGoingUploadsCounter === 0) {
          uploading.value = false;
          emit("upload-completed", document);
        }

        if (
          props.file.type === FILE_TYPE.FOLDER &&
          progress.onGoingUploadsCounter < simultaneousUploadLimit
        ) {
          files.value.shift();
        }
      },
      onUploadError: () => {
        uploading.value = false;
        failed.value = true;
        emit("upload-failed");
      }
    };

    let uploader;
    if (props.isModelUpload) {
      uploader = projectModelUploader(props.project, handlers);
    } else {
      uploader = projectFileUploader(props.project, handlers);
    }

    const cancelUpload = () => {
      uploader.cancel();
      uploading.value = false;
      canceled.value = true;
      emit("upload-canceled");
    };

    const files = ref(
      props.file.files?.map((file, index) =>
        Object.assign(file, { id: index })
      ) || undefined
    );

    if (props.file.type === FILE_TYPE.FOLDER) {
      watch(
        files.value,
        () => {
          if (files.value.length === 0) return;
          const { id } = uploader.upload(
            files.value[0].file,
            files.value[0].parentId,
            null
          );
          progress.fileUploaded[id] = 0;
        },
        { immediate: true }
      );
    } else {
      onMounted(() =>
        uploader.upload(props.file, props.folder ? props.folder.id : null)
      );
    }

    return {
      // References
      canceled,
      failed,
      FILE_TYPE,
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
