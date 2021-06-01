<template>
  <BIMDataButton
    class="file-upload-button"
    :width="width"
    :height="height"
    color="primary"
    fill
    radius
    @click="selectFile"
  >
    <BIMDataIcon name="addFile" size="xs" />
    <span>{{ $t("FileUploadButton.addFileButtonText") }}</span>
    <input hidden ref="fileInput" type="file" multiple @change="uploadFile" />
  </BIMDataButton>
</template>

<script>
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { ref } from "vue";
import { useAuth } from "@/state/auth";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  props: {
    width: {
      type: String,
      default: "32px"
    },
    height: {
      type: String,
      default: "32px"
    },
    project: {
      type: Object,
      required: true
    },
    folder: {
      type: Object
    }
  },
  emits: ["upload-completed", "upload-failed"],
  setup(props, { emit }) {
    const { accessToken } = useAuth();

    const fileInput = ref(null);

    const uppy = new Uppy({
      id: `project-file-${props.project.id}`,
      autoProceed: true,
      allowMultipleUploads: false,
      restrictions: {
        maxFileSize: +process.env.VUE_APP_MAX_UPLOAD_SIZE,
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
      // loading.value = true;
    });
    uppy.on("upload-error", () => {
      // loading.value = false;
      emit("upload-failed");
    });
    uppy.on("complete", event => {
      const document = event.successful[0].response.body;
      // loading.value = false;
      uppy.reset(); // reset Uppy instance
      emit("upload-completed", document);
    });

    const selectFile = () => {
      fileInput.value.click();
    };
    const uploadFile = event => {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        if (file) {
          uppy.addFile({
            name: file.name,
            type: file.type,
            data: file,
            meta: {
              parent_id: props.folder.id
            }
          });
        }
      });
    };

    return {
      // References
      fileInput,
      // Methods
      selectFile,
      uploadFile
    };
  }
};
</script>
