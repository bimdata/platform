<template>
  <BIMDataButton
    class="space-card-image-input"
    ghost
    squared
    @click="selectImage"
  >
    {{ $t("SpaceCardImageInput.changeImageButtonText") }}
    <input
      hidden
      ref="fileInput"
      type="file"
      accept="image/*"
      @change="uploadImage"
    />
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
  emits: ["upload-completed", "upload-failed"],
  setup(props, { emit }) {
    const { accessToken } = useAuth();
    const { softUpdateSpace } = useSpaces();

    const loading = inject("loading", false);

    const fileInput = ref(null);

    const uppy = new Uppy({
      id: `space-image-${props.space.id}`,
      autoProceed: true,
      allowMultipleUploads: false,
      restrictions: {
        maxFileSize: +process.env.VUE_APP_MAX_UPLOAD_SIZE,
        maxNumberOfFiles: 1,
        minNumberOfFiles: 1
      }
    });
    uppy.use(XHRUpload, {
      method: "PATCH",
      endpoint: `${process.env.VUE_APP_API_BASE_URL}/cloud/${props.space.id}`,
      fieldName: "image",
      metaFields: [],
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    });
    uppy.on("file-added", () => {
      loading.value = true;
    });
    uppy.on("upload-error", () => {
      loading.value = false;
      emit("upload-failed");
    });
    uppy.on("complete", event => {
      const image = event.successful[0].response.body.image;
      softUpdateSpace({ ...props.space, image });
      uppy.reset(); // reset Uppy instance
      emit("upload-completed");
    });

    const selectImage = () => {
      fileInput.value.click();
    };
    const uploadImage = event => {
      const file = event.target.files[0];
      if (file) {
        uppy.addFile({
          name: file.name,
          type: file.type,
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
