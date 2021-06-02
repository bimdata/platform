<template>
  <div class="file-upload-cell" :class="{ failed }">
    <div class="file-upload-cell--left">
      <FileIcon :name="fileExtension(file.name)" size="20" />
    </div>
    <div class="file-upload-cell--center file-upload-cell__info">
      <div class="file-upload-cell__info__file-name">
        {{ file.name }}
      </div>
      <div v-show="uploading" class="file-upload-cell__info__progress-bar">
        <div
          class="progress-level"
          :style="{ width: `${progress.percentage}%` }"
        />
      </div>
      <div class="file-upload-cell__info__upload-data">
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
    <div class="file-upload-cell--right">
      <BIMDataButton
        v-show="uploading"
        class="file-upload-cell__btn-cancel"
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
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { onMounted, reactive, ref } from "vue";
import { useAuth } from "@/state/auth";
import { fileExtension, formatBytes } from "@/utils/files";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import FileIcon from "@/components/generic/file-icon/FileIcon";

let instanceID = 0;

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    FileIcon
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    folder: {
      type: Object,
      required: true
    },
    file: {
      type: Object,
      required: true
    }
  },
  emits: ["upload-completed", "upload-canceled", "upload-failed"],
  setup(props, { emit }) {
    const { accessToken } = useAuth();

    const uploading = ref(true);
    const canceled = ref(false);
    const failed = ref(false);

    const uppy = new Uppy({
      id: `project-file-${instanceID++}`,
      autoProceed: true,
      allowMultipleUploads: false,
      restrictions: {
        maxFileSize: +process.env.VUE_APP_MAX_UPLOAD_SIZE,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1
      }
    });
    uppy.use(XHRUpload, {
      method: "POST",
      endpoint: `${process.env.VUE_APP_API_BASE_URL}/cloud/${props.project.cloud.id}/project/${props.project.id}/document`,
      fieldName: "file",
      metaFields: ["name", "parent_id"],
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    });
    uppy.on("file-added", () => {
      uploading.value = true;
    });
    uppy.on("upload-error", () => {
      uploading.value = false;
      failed.value = true;
      emit("upload-failed");
    });
    uppy.on("complete", event => {
      const document = event.successful[0].response.body;
      uploading.value = false;
      uppy.reset(); // reset Uppy instance
      emit("upload-completed", document);
    });

    const progress = reactive({
      percentage: 33,
      uploaded: 123,
      rate: 456
    });

    let lastTime = null;
    uppy.on("upload-progress", (file, { bytesUploaded, bytesTotal }) => {
      if (lastTime) {
        const dt = (Date.now() - lastTime) / 1000; // in seconds
        const dx = bytesUploaded - progress.uploaded; // in bytes
        progress.rate = Math.round(dx / dt);
      }
      progress.percentage = Math.round((100 * bytesUploaded) / bytesTotal);
      progress.uploaded = bytesUploaded;
      lastTime = Date.now();
    });

    const cancelUpload = () => {
      uppy.cancelAll();
      uploading.value = false;
      canceled.value = true;
      emit("upload-canceled");
    };

    onMounted(() => {
      uppy.addFile({
        name: props.file.name,
        type: props.file.type,
        data: props.file,
        meta: {
          parent_id: props.folder.id
        }
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
      fileExtension,
      formatBytes
    };
  }
};
</script>

<style scoped lang="scss" src="./FileUploadCell.scss"></style>
