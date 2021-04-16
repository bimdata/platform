<template>
  <div class="empty-files-manager">
    <img
      width="260"
      height="260"
      src="/static/empty-files-manager-illustration.svg"
    />
    <div>
      {{ $t("EmptyFilesManager.onboardingText") }}
    </div>
    <div class="empty-files-manager__actions">
      <BIMDataButton
        width="120px"
        color="primary"
        fill
        radius
        @click="uploadFile"
      >
        {{ $t("EmptyFilesManager.uploadFileButtonText") }}
      </BIMDataButton>
      <BIMDataButton
        width="120px"
        color="primary"
        fill
        radius
        @click="createFolder"
      >
        {{ $t("EmptyFilesManager.createFolderButtonText") }}
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
