<template>
  <div class="empty-files-manager">
    <img
      width="260"
      height="260"
      src="/static/empty-files-manager-illustration.svg"
    />
    <div>
      {{ $t("ProjectBoard.ProjectFilesManager.onboardingText") }}
    </div>
    <div class="empty-files-manager__actions">
      <BIMDataButton color="primary" fill radius @click="uploadFile">
        {{ $t("ProjectBoard.ProjectFilesManager.buttonUploadFile") }}
      </BIMDataButton>
      <BIMDataButton color="primary" fill radius @click="createFolder">
        {{ $t("ProjectBoard.ProjectFilesManager.buttonCreateFolder") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";

export default {
  components: {
    BIMDataButton
  },
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  setup() {
    const uploadFile = () => {};
    const createFolder = () => {};

    return {
      // Methods
      createFolder,
      uploadFile
    };
  }
};
</script>

<style scoped lang="scss" src="./EmptyFilesManager.scss"></style>
