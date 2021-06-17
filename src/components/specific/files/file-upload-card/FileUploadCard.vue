<template>
  <div class="file-upload-card" :class="{ condensed, failed }">
    <div class="file-upload-card--left">
      <FileIcon :name="fileExtension(file.name)" :size="condensed ? 20 : 32" />
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
import { onMounted, reactive, ref } from "vue";
import { useUpload } from "@/composables/upload";
import { fileExtension, formatBytes } from "@/utils/files";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import FileIcon from "@/components/generic/file-icon/FileIcon";

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
    const { projectFileUploader } = useUpload();

    const uploading = ref(false);
    const canceled = ref(false);
    const failed = ref(false);

    let lastProgressTime = null;
    const progress = reactive({
      percentage: 0,
      uploaded: 0,
      rate: 0
    });

    const uploader = projectFileUploader(props.project, {
      onUploadStart: () => {
        uploading.value = true;
      },
      onUploadProgress: (file, { bytesUploaded, bytesTotal }) => {
        if (lastProgressTime) {
          const dt = (Date.now() - lastProgressTime) / 1000; // in seconds
          const dx = bytesUploaded - progress.uploaded; // in bytes
          progress.rate = Math.round(dx / dt);
        }
        progress.percentage = Math.round((100 * bytesUploaded) / bytesTotal);
        progress.uploaded = bytesUploaded;
        lastProgressTime = Date.now();
      },
      onUploadComplete: event => {
        const document = event.successful[0].response.body;
        uploading.value = false;
        uploader.reset();
        emit("upload-completed", document);
      },
      onUploadError: () => {
        uploading.value = false;
        failed.value = true;
        emit("upload-failed");
      }
    });

    const cancelUpload = () => {
      uploader.cancel();
      uploading.value = false;
      canceled.value = true;
      emit("upload-canceled");
    };

    onMounted(() => {
      uploader.upload(props.file, props.folder ? props.folder.id : null);
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

<style scoped lang="scss" src="./FileUploadCard.scss"></style>
