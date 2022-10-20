<template>
  <div ref="onboarding" class="files-manager-onboarding">
    <FilesManagerOnboardingImage />
    <div>
      {{ $t("FilesManagerOnboarding.text") }}
    </div>
    <div class="files-manager-onboarding__actions">
      <div class="files-manager-onboarding__actions__base">
        <BIMDataButton
          fill
          radius
          color="primary"
          width="150px"
          @click="
            fileUploadInput('file', event => uploadFile(event.target.files), {
              multiple: true
            })
          "
        >
          {{ $t("FilesManagerOnboarding.uploadFileButtonText") }}
        </BIMDataButton>
        <BIMDataButton
          width="150px"
          color="primary"
          fill
          radius
          @click="createFolder"
        >
          {{ $t("FilesManagerOnboarding.createFolderButtonText") }}
        </BIMDataButton>
      </div>
      <div class="files-manager-onboarding__actions__advanced">
        <template v-if="project.isAdmin">
          <template v-if="!isGedMenuOpen">
            <BIMDataButton
              color="primary"
              outline
              radius
              icon
              @click="openGedMenu"
            >
              <BIMDataIcon name="plus" size="s" />
            </BIMDataButton>
          </template>
          <template v-if="isGedMenuOpen">
            <BIMDataDropdownMenu
              class="files-manager-onboarding__actions__enhanced__dropdown"
              v-click-away="closeProjects && closeGedMenu"
              ref="dropdown"
              :header="false"
              :menuItems="gedMenu"
              :subListMaxHeight="dropdownMaxHeight + 'px'"
            />
          </template>
        </template>
      </div>
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
import { useI18n } from "vue-i18n";

import { useToggle } from "../../../../../composables/toggle.js";
import { fileUploadInput } from "../../../../../utils/upload.js";
import FileService from "../../../../../services/FileService.js";

// Components
import FilesManagerOnboardingImage from "./FilesManagerOnboardingImage.vue";
import FileUploadCard from "../../file-upload-card/FileUploadCard.vue";
import FolderCreationForm from "../../folder-creation-form/FolderCreationForm.vue";

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
    const { t } = useI18n();

    const {
      isOpen: isProjectsOpen,
      toggle: toggleProjects,
      close: closeProjects
    } = useToggle();

    const {
      isOpen: isGedMenuOpen,
      open: openGedMenu,
      close: closeGedMenu
    } = useToggle();

    let uploadCount = 0;
    const fileUploads = ref([]);
    const uploadFile = async files => {
      uploadCount = 0;

      const fileList = Array.from(files);

      if (files[0].webkitRelativePath) {
        fileUploads.value = await FileService.createFolderStructure(
          props.project,
          props.rootFolder,
          fileList
        );
      } else {
        fileUploads.value = fileList;
      }
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

    const gedMenu = computed(() => {
      if (!props.project.isAdmin) return;
      const items = [];
      items.push(
        {
          name: t("FilesManagerOnboarding.GEDStructureImport"),
          children: {
            position: "up",
            list: props.projectsTree
          }
        },
        {
          name: t("FilesManagerOnboarding.folderImport"),
          action: () =>
            fileUploadInput("folder", event => uploadFile(event.target.files))
        }
      );
      return items;
    });

    return {
      // References
      fileUploads,
      showFolderForm,
      dropdownMaxHeight,
      onboarding,
      dropdown,
      gedMenu,
      isProjectsOpen,
      isGedMenuOpen,
      // Methods
      toggleProjects,
      closeProjects,
      openGedMenu,
      closeGedMenu,
      createFolder,
      updateUploadCount,
      uploadFile,
      fileUploadInput
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesManagerOnboarding.scss"></style>
