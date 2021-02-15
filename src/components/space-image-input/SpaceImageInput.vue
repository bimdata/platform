<template>
  <BIMDataButton ghost squared class="space-image-input" @click="selectImage">
    {{ $t("Spaces.SpaceActionMenu.changeImage") }}
    <input hidden ref="fileInput" type="file" @change="uploadImage" />
  </BIMDataButton>
</template>

<script>
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { inject, ref } from "vue";
import { useAuth } from "@/state/auth";
import { useSpaces } from "@/state/spaces";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";

export default {
  components: {
    BIMDataButton
  },
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  emits: ["success", "error"],
  setup(props, { emit }) {
    const { user } = useAuth();
    const { softUpdateSpace } = useSpaces();

    const loading = inject("loading", false);

    const fileInput = ref(null);

    const uppy = new Uppy({
      id: `space-image-${props.space.id}`,
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
      method: "PATCH",
      endpoint: `${process.env.VUE_APP_API_BASE_URL}/cloud/${props.space.id}`,
      fieldName: "image",
      metaFields: [],
      headers: {
        Authorization: `Bearer ${user.value.access_token}`
      }
    });
    uppy.on("file-added", () => {
      loading.value = true;
    });
    uppy.on("upload-error", (file, error) => {
      emit("error", error);
    });
    uppy.on(
      "complete",
      ({
        successful: [
          {
            response: {
              body: { image }
            }
          }
        ]
      }) => {
        softUpdateSpace({ ...props.space, image });
        uppy.reset(); // reset Uppy instance
        emit("success");
      }
    );

    const selectImage = () => {
      fileInput.value.click();
    };
    const uploadImage = ({
      target: {
        files: [file]
      }
    }) => {
      if (file) {
        uppy.addFile({
          name: file.name,
          type: file.type,
          size: file.size,
          data: file
        });
      }
    };

    return {
      // References,
      fileInput,
      // Methods
      selectImage,
      uploadImage
    };
  }
};
</script>
