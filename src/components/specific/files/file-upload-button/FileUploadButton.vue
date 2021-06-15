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
      <BIMDataIcon name="addFile" size="xs" />
      <span>{{ $t("FileUploadButton.addFileButtonText") }}</span>
    </slot>
    <input hidden ref="fileInput" type="file" multiple @change="uploadFile" />
  </BIMDataButton>
</template>

<script>
import { ref } from "vue";
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
