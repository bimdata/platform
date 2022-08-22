<template>
  <div ref="onboarding" class="files-manager-onboarding">
    <FilesManagerOnboardingImage />
    <div>
      {{ $t("FilesManagerOnboarding.text") }}
    </div>
    <div class="files-manager-onboarding__actions">
      <FileUploadButton width="120px" multiple @upload="uploadFile">
        {{ $t("FilesManagerOnboarding.uploadFileButtonText") }}
      </FileUploadButton>
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
        ref="dropdown"
        width="20%"
        height="32px"
        directionClass="up"
      >
        <template #header>
          <span> {{ $t("FilesManagerOnboarding.GEDStructureImport") }}</span>
          <BIMDataIcon
            name="deploy"
            fill
            size="xxs"
            color="primary"
            :rotate="180"
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

// Components
import FileUploadButton from "@/components/specific/files/file-upload-button/FileUploadButton";
import FileUploadCard from "@/components/specific/files/file-upload-card/FileUploadCard";
import FolderCreationForm from "@/components/specific/files/folder-creation-form/FolderCreationForm";
import FilesManagerOnboardingImage from "./FilesManagerOnboardingImage.vue";

export default {
  components: {
    FilesManagerOnboardingImage,
    FileUploadButton,
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
    let uploadCount = 0;
    const fileUploads = ref([]);
    const uploadFile = files => {
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
      // Methods
      createFolder,
      updateUploadCount,
      uploadFile
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesManagerOnboarding.scss"></style>
