<template>
  <BIMDataButton
    class="space-card-image-button"
    ghost
    squared
    @click="selectImage"
  >
    {{ $t("SpaceCardImageButton.buttonText") }}
  </BIMDataButton>
</template>

<script>
import { inject } from "vue";
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

    const uploader = spaceImageUploader(props.space, {
      onUploadStart: () => {
        loading.value = true;
      },
      onUploadComplete: () => {
        loadUserSpaces();
        loadOrganizationSpaces(props.space.organization);
        emit("upload-completed");
      },
      onUploadError: () => {
        loading.value = false;
        emit("upload-failed");
      }
    });

    const uploadImage = event => {
      const file = event.target.files[0];
      if (file) {
        uploader.upload(file);
      }
    };

    const selectImage = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = uploadImage;
      input.click();
    };

    return {
      // Methods
      selectImage
    };
  }
};
</script>
