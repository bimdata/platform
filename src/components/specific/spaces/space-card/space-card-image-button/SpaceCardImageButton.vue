<template>
  <BIMDataButton
    class="space-card-image-button"
    ghost
    squared
    @click="selectImage"
  >
    {{ $t("SpaceCardImageButton.text") }}
  </BIMDataButton>
</template>

<script setup>
import { inject } from "vue";
import UploadService from "../../../../../services/UploadService.js";
import { useOrganizations } from "../../../../../state/organizations.js";
import { useSpaces } from "../../../../../state/spaces.js";

const props = defineProps({
  space: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["upload-completed", "upload-failed"]);

const { loadOrganizationSpaces } = useOrganizations();
const { loadUserSpaces } = useSpaces();

const loading = inject("loading", false);

const uploader = UploadService.createSpaceImageUploader(props.space, {
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
  if (file) uploader.upload(file);
};

const selectImage = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = uploadImage;
  input.click();
};
</script>
