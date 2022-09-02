<template>
  <div ref="onboarding" class="files-manager-onboarding">
    <FilesManagerOnboardingImage />
    <div>
      {{ $t("FilesManagerOnboarding.text") }}
    </div>
    <div class="files-manager-onboarding__actions">
      <BIMDataButton
        fill
        radius
        color="primary"
        width="120px"
        @click="
          fileUploadInput('file', event => uploadFile(event), {
            multiple: true
          })
        "
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
      <BIMDataDropdownMenu
        class="files-manager-onboarding__actions__dropdown"
        v-click-away="close"
        ref="dropdown"
        width="20%"
        height="32px"
        directionClass="up"
        @click="toggle"
      >
        <template #header>
          <span> {{ $t("FilesManagerOnboarding.GEDStructureImport") }}</span>
          <BIMDataIcon
            :name="isOpen ? 'deploy' : 'chevron'"
            fill
            size="xxs"
            color="primary"
            :rotate="isOpen ? 180 : 0"
          />
        </template>
        <template #element>
          <ul
            class="bimdata-list"
            :style="{ maxHeight: dropdownMaxHeight + 'px' }"
          >
            <li
              v-for="project in projectsTree"
              :key="project.name"
              @click="project.action"
            >
              <BIMDataTextbox :text="project.name" />
            </li>
          </ul>
        </template>
      </BIMDataDropdownMenu>
    </div>
    <transition name="fade">
      <div
        v-show="showFolderForm || fileUploads.length > 0"
        class="files-manager-onboarding__overlay"
      >
        <div class="files-manager-onboarding__overlay__uploads">
          <FileUploadCard
            v-for="(file, i) of fileUploads"
            :key="i"
            condensed
            :project="project"
            :folder="rootFolder"
            :file="file"
            @upload-completed="updateUploadCount"
            @upload-canceled="updateUploadCount"
            @upload-failed="updateUploadCount"
          />
        </div>

        <FolderCreationForm
          v-if="showFolderForm"
          class="files-manager-onboarding__overlay__folder-form"
          :project="project"
          :folder="rootFolder"
          @close="showFolderForm = false"
          @success="showFolderForm = false"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useToggle } from "../../../../../composables/toggle.js";
import { fileUploadInput } from "../../../../../utils/upload.js";

// Components
import FileUploadCard from "../../../../../components/specific/files/file-upload-card/FileUploadCard.vue";
import FolderCreationForm from "../../../../../components/specific/files/folder-creation-form/FolderCreationForm.vue";
import FilesManagerOnboardingImage from "./FilesManagerOnboardingImage.vue";

export default {
  components: {
    FilesManagerOnboardingImage,
    FileUploadCard,
    FolderCreationForm
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    projectsTree: {
      type: Object,
      required: true
    },
    rootFolder: {
      type: Object,
      required: true
    }
  },
  emits: ["file-uploaded"],
  setup(props, { emit }) {
    const { isOpen, toggle, close } = useToggle();

    let uploadCount = 0;
    const fileUploads = ref([]);
    const uploadFile = event => {
      const files = Array.from(event.target.files);
      if (files.length === 0) return;

      uploadCount = 0;
      fileUploads.value = files;
    };

    const updateUploadCount = () => {
      uploadCount++;
      if (uploadCount === fileUploads.value.length) {
        uploadCount = 0;
        fileUploads.value = [];
        emit("file-uploaded");
      }
    };

    const showFolderForm = ref(false);
    const createFolder = () => {
      showFolderForm.value = true;
    };

    const onboarding = ref(null);
    const dropdown = ref(null);
    const dropdownMaxHeight = computed(
      () =>
        dropdown.value?.$el?.getBoundingClientRect().y -
        onboarding.value?.getBoundingClientRect().y
    );

    return {
      // References
      fileUploads,
      showFolderForm,
      dropdownMaxHeight,
      onboarding,
      dropdown,
      isOpen,
      // Methods
      toggle,
      close,
      createFolder,
      updateUploadCount,
      uploadFile,
      fileUploadInput
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesManagerOnboarding.scss"></style>
