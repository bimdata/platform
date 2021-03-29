<template>
  <div class="project-file-uploader">
    <div class="project-file-uploader__upload-list"></div>
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
        @click="$emit('close')"
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
          @change="uploadFiles"
        />
      </BIMDataButton>
    </div>
  </div>
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
    project: {
      type: Object,
      required: true
    }
  },
  emits: ["close"],
  setup() {
    const fileInput = ref(null);

    const selectFiles = () => {
      fileInput.value.click();
    };

    const uploadFiles = event => {
      let files = null;
      if (event.dataTransfer) {
        files = event.dataTransfer.files;
      } else {
        files = event.target.files;
      }
      files = Array.from(files);
      console.log(files);
    };

    return {
      // References
      fileInput,
      //Methods
      selectFiles,
      uploadFiles
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectFileUploader.scss"></style>
