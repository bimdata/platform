<template>
  <div class="file-uploader">
    <div class="file-uploader__upload-list">
      <transition-group name="list">
        <FileUploadCard
          :isModelUpload="isModelUploader"
          v-for="file of fileUploads"
          :key="file.key"
          :project="project"
          :file="file"
          @upload-completed="onUploadCompleted(file.key, $event)"
          @upload-canceled="cleanUpload(file.key, 6000)"
          @upload-failed="cleanUpload(file.key, 12000)"
        />
      </transition-group>
    </div>
    <div
      class="file-uploader__upload-area"
      @dragover.prevent="() => {}"
      @drop.prevent="uploadFiles"
    >
      <BIMDataButton
        class="file-uploader__upload-area__btn-close"
        ghost
        rounded
        icon
        @click="close"
      >
        <BIMDataIcon name="close" size="xxxs" />
      </BIMDataButton>
      <div class="file-uploader__upload-area__text">
        {{ $t("FileUploader.uploadAreaText") }}
      </div>
      <div class="file-uploader__upload-area__separator">
        <span class="file-uploader__upload-area__separator__text">
          {{ $t("FileUploader.separatorText") }}
        </span>
      </div>
      <BIMDataButton
        class="file-uploader__upload-area__btn-upload"
        fill
        radius
        color="primary"
        @click="
          fileUploadInput('file', event => uploadFiles(event), {
            accept: allowedFileTypes,
            multiple: true
          })
        "
      >
        {{ $t("FileUploader.uploadButtonText") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { fileUploadInput } from "../../../../utils/upload.js";
import { fileExtension, generateFileKey } from "../../../../utils/files.js";

// Components
import FileUploadCard from "../../../../components/specific/files/file-upload-card/FileUploadCard.vue";

export default {
  components: {
    FileUploadCard
  },
  props: {
    isModelUploader: {
      type: Boolean,
      default: false
    },
    autoclose: {
      type: Boolean,
      default: false
    },
    project: {
      type: Object,
      required: true
    },
    allowedFileTypes: {
      type: Array,
      default: () => []
    },
    forbiddenFileTypes: {
      type: Array,
      default: () => []
    }
  },
  emits: ["close", "file-uploaded", "forbidden-upload-attempt"],
  setup(props, { emit }) {
    const fileUploads = ref([]);

    const uploadFiles = event => {
      const targetFiles = Array.from(event.target.files);
      if (targetFiles.length === 0) return;

      let files = null;
      if (targetFiles.dataTransfer) {
        // Files from drag & drop
        files = Array.from(targetFiles.dataTransfer.files);
      } else {
        // Files from input
        files = targetFiles;
      }
      const forbiddenUploads = [];
      files = files.filter(file => {
        let shouldUpload = true;
        let fileType = file.type.toLowerCase();
        let fileExt = fileExtension(file.name).toLowerCase();

        if (props.allowedFileTypes.length > 0) {
          // Only keep allowed files
          shouldUpload = props.allowedFileTypes
            .map(type => type.toLowerCase())
            .some(type => type === fileType || type === fileExt);
        }
        if (props.forbiddenFileTypes.length > 0) {
          // Discard forbidden files
          shouldUpload = !props.forbiddenFileTypes
            .map(type => type.toLowerCase())
            .some(type => type === fileType || type === fileExt);
        }
        if (!shouldUpload) {
          forbiddenUploads.push(file);
        }

        return shouldUpload;
      });
      if (forbiddenUploads.length > 0) {
        emit("forbidden-upload-attempt", forbiddenUploads);
      }
      files = files.map(file =>
        Object.assign(file, { key: generateFileKey(file) })
      );
      fileUploads.value = fileUploads.value.concat(files);
    };

    const onUploadCompleted = (key, document) => {
      cleanUpload(key, 3000);
      emit("file-uploaded", document);
    };

    const cleanUpload = (key, delay = 100) => {
      setTimeout(() => {
        const index = fileUploads.value.findIndex(f => f.key === key);
        fileUploads.value.splice(index, 1);
        if (props.autoclose && fileUploads.value.length === 0) {
          setTimeout(() => close(), 800);
        }
      }, delay);
    };

    const close = () => {
      fileUploads.value = [];
      emit("close");
    };

    return {
      // References
      fileUploads,
      // Methods
      cleanUpload,
      close,
      onUploadCompleted,
      uploadFiles,
      fileUploadInput
    };
  }
};
</script>

<style scoped lang="scss" src="./FileUploader.scss"></style>
