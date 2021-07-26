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
    <slot>
      <BIMDataIcon name="addFile" size="xs" margin="0 6 0 0" />
      <span>{{ $t("FileUploadButton.addFileButtonText") }}</span>
    </slot>
    <input
      hidden
      ref="fileInput"
      type="file"
      :multiple="multiple"
      :accept="accept.join(',')"
      @change="uploadFile"
    />
  </BIMDataButton>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    width: {
      type: String,
      default: "32px"
    },
    height: {
      type: String,
      default: "32px"
    },
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: Array,
      default: () => []
    }
  },
  emits: ["upload"],
  setup(props, { emit }) {
    const fileInput = ref(null);

    const selectFile = () => {
      fileInput.value.click();
    };

    const uploadFile = event => {
      const files = Array.from(event.target.files);
      if (files.length > 0) {
        fileInput.value.value = "";
        emit("upload", files);
      }
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
