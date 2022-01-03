<template>
  <BIMDataButton
    class="space-card-image-button"
    ghost
    squared
    @click="selectImage"
  >
    {{ $t("SpaceCardImageButton.buttonText") }}
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
import { inject, ref } from "vue";
import { useUpload } from "@/composables/upload.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSpaces } from "@/state/spaces.js";

export default {
  props: {
    space: {
      type: Object,
      required: true
    }
  },
  emits: ["upload-completed", "upload-failed"],
  setup(props, { emit }) {
    const { loadOrganizationSpaces } = useOrganizations();
    const { loadUserSpaces } = useSpaces();
    const { spaceImageUploader } = useUpload();

    const loading = inject("loading", false);

    const fileInput = ref(null);

    const uploader = spaceImageUploader(props.space, {
      onUploadStart: () => {
        loading.value = true;
      },
      onUploadComplete: () => {
        loadUserSpaces();
        loadOrganizationSpaces(props.space.organization);
        uploader.reset();
        emit("upload-completed");
      },
      onUploadError: () => {
        loading.value = false;
        emit("upload-failed");
      }
    });

    const selectImage = () => {
      fileInput.value.click();
    };
    const uploadImage = event => {
      const file = event.target.files[0];
      if (file) {
        uploader.upload(file);
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
