<template>
  <div class="project-file-uploader">
    <div class="project-file-uploader__upload-list">
      <transition-group name="card-list">
        <FileUploadCard
          v-for="(file, i) of filesToUpload"
          :key="i"
          :project="project"
          :file="file"
          @upload-completed="onSuccess(i, $event)"
          @upload-canceled="clean(i, 6000)"
          @upload-failed="clean(i, 12000)"
        />
      </transition-group>
    </div>
    <div
      class="project-file-uploader__upload-area"
      @dragover.prevent="() => {}"
      @drop.prevent="uploadFiles"
    >
      <BIMDataButton
        class="project-file-uploader__upload-area__btn-close"
        ghost
        rounded
        icon
        @click="close"
      >
        <BIMDataIcon name="close" size="xxxs" />
      </BIMDataButton>
      <div class="project-file-uploader__upload-area__text">
        {{ $t("ProjectFileUploader.uploadAreaText") }}
      </div>
      <div class="project-file-uploader__upload-area__separator">
        <span class="project-file-uploader__upload-area__separator__text">
          {{ $t("ProjectFileUploader.separatorText") }}
        </span>
      </div>
      <BIMDataButton
        class="project-file-uploader__upload-area__btn-upload"
        color="primary"
        fill
        radius
        @click="selectFiles"
      >
        {{ $t("ProjectFileUploader.buttonUpload") }}
        <input
          hidden
          ref="fileInput"
          type="file"
          multiple
          :accept="allowedFileTypes.join(',')"
          @change="uploadFiles"
        />
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { fileExtension } from "@/utils/files";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import FileUploadCard from "@/components/specific/files/file-upload-card/FileUploadCard";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
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
  emits: ["close", "file-uploaded"],
  setup(props, { emit }) {
    const fileInput = ref(null);
    const filesToUpload = ref([]);

    const selectFiles = () => {
      fileInput.value.click();
    };

    const uploadFiles = event => {
      let files = null;
      if (event.dataTransfer) {
        // Files from drag & drop
        files = event.dataTransfer.files;
      } else {
        // Files from input
        files = event.target.files;
      }
      files = Array.from(files).filter(file => {
        if (props.allowedFileTypes.length > 0) {
          // Only keep allowed files
          return (
            props.allowedFileTypes.includes(file.type) ||
            props.allowedFileTypes.includes("." + fileExtension(file.name))
          );
        }
        if (props.forbiddenFileTypes.length > 0) {
          // Discard forbidden files
          return !(
            props.forbiddenFileTypes.includes(file.type) ||
            props.forbiddenFileTypes.includes("." + fileExtension(file.name))
          );
        }
        return true;
      });
      filesToUpload.value = filesToUpload.value.concat(files);
    };

    const onSuccess = (index, document) => {
      clean(index, 3000);
      emit("file-uploaded", document);
    };

    const clean = (index, delay = 100) => {
      setTimeout(() => filesToUpload.value.splice(index, 1), delay);
    };

    const close = () => {
      filesToUpload.value = [];
      emit("close");
    };

    return {
      // References
      fileInput,
      filesToUpload,
      // Methods
      clean,
      close,
      onSuccess,
      selectFiles,
      uploadFiles
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectFileUploader.scss"></style>
