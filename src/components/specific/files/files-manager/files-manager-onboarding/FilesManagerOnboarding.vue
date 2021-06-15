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
    <transition name="fade">
      <div
        v-show="showFolderForm"
        class="files-manager-onboarding__overlay"
      >
        <FolderCreationForm
          v-if="showFolderForm"
          class="files-manager-onboarding__overlay__folder-form"
          :project="project" :folder="rootFolder"
          @close="showFolderForm = false"
          @success="showFolderForm = false"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import FolderCreationForm from "@/components/specific/files/folder-creation-form/FolderCreationForm";

export default {
  components: {
    BIMDataButton,
    FolderCreationForm
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    rootFolder: {
      type: Object,
      required: true
    }
  },
  setup() {
    const showFolderForm  = ref(false);

    const uploadFile = () => {};

    const createFolder = () => {
      showFolderForm.value = true;
    };

    return {
      // References
      showFolderForm,
      // Methods
      createFolder,
      uploadFile
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesManagerOnboarding.scss"></style>
