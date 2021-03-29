<template>
  <div class="file-upload-card">
    <div class="file-upload-card--left">
      <FileIcon name="ifc" size="24px" />
    </div>
    <div class="file-upload-card--center file-upload-card__info">
      <div class="file-upload-card__info__file-name">
        {{ file.name }}
      </div>
      <div class="file-upload-card__info__progress-bar"></div>
      <div class="file-upload-card__info__progress">
        {{ file.size }}
      </div>
      <div class="file-upload-card__info__upload-rate"></div>
    </div>
    <div class="file-upload-card--right">
      <BIMDataButton ghost rounded icon>
        <BIMDataIcon name="close" size="xs" />
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { onMounted, ref } from "vue";
import { useAuth } from "@/state/auth";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/BIMDataIcon.js";
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
    file: {
      type: Object,
      required: true
    }
  },
  emits: ["success", "error"],
  setup(props, { emit }) {
    const { accessToken } = useAuth();

    const showProgressBar = ref(false);

    const uppy = new Uppy({
      id: `project-file-${instanceID++}`,
      autoProceed: true,
      allowMultipleUploads: false,
      restrictions: {
        maxFileSize: process.env.VUE_APP_MAX_UPLOAD_SIZE,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1,
        allowedFileTypes: null
      }
    });
    uppy.use(XHRUpload, {
      method: "POST",
      endpoint: `${process.env.VUE_APP_API_BASE_URL}/cloud/${props.project.cloud.id}/project/${props.project.id}/document`,
      metaFields: [],
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    });
    uppy.on("file-added", () => {
      // TODO: start upload
      showProgressBar.value = true;
    });
    uppy.on("upload-progress", () => {
      // TODO: update progress bar
    });
    uppy.on("upload-error", (file, error) => {
      showProgressBar.value = false;
      emit("error", error);
    });
    uppy.on("complete", () => {
      showProgressBar.value = false;
      emit("success");
    });

    onMounted(() => {
      uppy.addFile({
        name: props.file.name,
        type: props.file.type,
        size: props.file.size,
        data: props.file
      });
    });

    return {
      showProgressBar
    };
  }
};
</script>

<style scoped lang="scss" src="./FileUploadCard.scss"></style>
