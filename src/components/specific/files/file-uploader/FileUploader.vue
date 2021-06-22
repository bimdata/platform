<template>
  <div class="file-uploader">
    <div class="file-uploader__upload-list">
      <transition-group name="list">
        <FileUploadCard
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
      <FileUploadButton
        class="file-uploader__upload-area__btn-upload"
        width="150px"
        multiple
        :accept="allowedFileTypes"
        @upload="uploadFiles"
      >
        {{ $t("FileUploader.uploadButtonText") }}
      </FileUploadButton>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { fileExtension, generateFileKey } from "@/utils/files";
// Components
import FileUploadButton from "@/components/specific/files/file-upload-button/FileUploadButton";
import FileUploadCard from "@/components/specific/files/file-upload-card/FileUploadCard";

export default {
  components: {
    FileUploadButton,
    FileUploadCard
  },
  props: {
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
      let files = null;
      if (event.dataTransfer) {
        // Files from drag & drop
        files = Array.from(event.dataTransfer.files);
      } else {
        // Files from input
        files = event;
      }
      const forbiddenUploads = [];
      files = files.filter(file => {
        let shouldUpload = true;
        if (props.allowedFileTypes.length > 0) {
          // Only keep allowed files
          shouldUpload =
            props.allowedFileTypes.includes(file.type) ||
            props.allowedFileTypes.includes("." + fileExtension(file.name));
        }
        if (props.forbiddenFileTypes.length > 0) {
          // Discard forbidden files
          shouldUpload = !(
            props.forbiddenFileTypes.includes(file.type) ||
            props.forbiddenFileTypes.includes("." + fileExtension(file.name))
          );
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
        Object.assign(file, { key: generateFileKey(file.name, file.size) })
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
      uploadFiles
    };
  }
};
</script>

<style scoped lang="scss" src="./FileUploader.scss"></style>
