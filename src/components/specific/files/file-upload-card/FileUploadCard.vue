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
          :style="{
            width: `${progress.percentage}%`
          }"
        />
      </div>
      <div class="file-upload-card__info__upload-data">
        <template v-if="uploading">
          <span>{{
            `${formatBytes(
              progress.folderUploaded || progress.fileUploaded
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
      fileUploaded: 0,
      folderUploaded: 0,
      onGoingUploads: {},
      rate: 0
    });

    const handlers = {
      onUploadStart: () => {
        uploading.value = true;
      },
      onUploadProgress: ({ bytesUploaded, bytesTotal, id }) => {
        if (props.file.type === FILE_TYPE.FOLDER) {
          const currentlyUploaded =
            bytesUploaded - progress.onGoingUploads[id].uploaded;
          progress.folderUploaded += currentlyUploaded;

          if (lastProgressTime) {
            const dt = (Date.now() - lastProgressTime) / 1000; // in seconds
            const dx = currentlyUploaded; // in bytes
            progress.rate = Math.round(dx / dt);
          }
          const rawPercentage = Math.round(
            (100 * progress.folderUploaded) / props.file.size
          );
          progress.percentage = rawPercentage > 100 ? 100 : rawPercentage;

          progress.onGoingUploads[id].uploaded = bytesUploaded;
          lastProgressTime = Date.now();

          if (
            bytesUploaded >= bytesTotal &&
            Object.keys(progress.onGoingUploads).length <
              simultaneousUploadLimit
          ) {
            files.value.shift();
          }
        } else {
          if (lastProgressTime) {
            const dt = (Date.now() - lastProgressTime) / 1000; // in seconds
            const dx = bytesUploaded - progress.fileUploaded; // in bytes
            progress.rate = Math.round(dx / dt);
          }
          progress.percentage = Math.round((100 * bytesUploaded) / bytesTotal);
          progress.fileUploaded = bytesUploaded;
          lastProgressTime = Date.now();
        }
      },
      onUploadComplete: ({ response: document, id }) => {
        delete progress.onGoingUploads[id];

        if (Object.keys(progress.onGoingUploads).length === 0) {
          uploading.value = false;
          emit("upload-completed", document);
        }

        if (
          props.file.type === FILE_TYPE.FOLDER &&
          Object.keys(progress.onGoingUploads).length < simultaneousUploadLimit
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
      Object.values(progress.onGoingUploads).forEach(upload =>
        upload.uploader.cancel()
      );
      uploading.value = false;
      canceled.value = true;
      files.value = [];

      if (props.file.type === FILE_TYPE.FOLDER) {
        emit("upload-completed");
      } else {
        emit("upload-canceled");
      }
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
          progress.onGoingUploads[id] = { uploader, uploaded: 0 };
        },
        { immediate: true }
      );
    } else {
      onMounted(() => {
        const { id } = uploader.upload(
          props.file,
          props.folder ? props.folder.id : null
        );
        progress.onGoingUploads[id] = { uploader };
      });
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
