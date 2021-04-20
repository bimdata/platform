<template>
  <div class="files-manager-onboarding">
    <img width="260" height="260" src="/static/files-manager-onboarding.svg" />
    <div>
      {{ $t("FilesManagerOnboarding.text") }}
    </div>
    <div class="files-manager-onboarding__actions">
      <BIMDataButton
        width="120px"
        color="primary"
        fill
        radius
        @click="uploadFile"
      >
        {{ $t("FilesManagerOnboarding.uploadFileButtonText") }}
      </BIMDataButton>
      <BIMDataButton
        width="120px"
        color="primary"
        fill
        radius
        @click="createFolder"
      >
        {{ $t("FilesManagerOnboarding.createFolderButtonText") }}
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

<style scoped lang="scss" src="./FilesManagerOnboarding.scss"></style>
