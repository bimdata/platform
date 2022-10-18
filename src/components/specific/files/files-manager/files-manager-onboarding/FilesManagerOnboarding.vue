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
          fileUploadInput('file', event => uploadFile(event.target.files), {
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
            class="files-manager-onboarding__actions__dropdown"
            v-click-away="closeProjects && closeGedMenu"
            ref="dropdown"
            width="20%"
            height="32px"
            directionClass="none"
            :menuItems="gedMenu"
            :subListMaxHeight="dropdownMaxHeight + 'px'"
          />
        </template>
      </template>
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
import async from "async";

import { useToggle } from "../../../../../composables/toggle.js";
import { fileUploadInput } from "../../../../../utils/upload.js";
import FileService from "../../../../../services/FileService.js";
import { FILE_TYPE } from "../../../../../config/files.js";

import {
  getPaths,
  handleInputFiles,
  createTreeFromPaths,
  matchFoldersAndDocs
} from "../../../../../utils//files.js";

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
    const uploadFile = files => {
      uploadCount = 0;

      const fileList = Array.from(files);

      if (files[0].webkitRelativePath) {
        async.each([handleInputFiles(fileList)], async folder => {
          const paths = getPaths(folder);
          const tree = createTreeFromPaths(props.rootFolder, paths);
          const DMSTree = await FileService.createFileStructure(props.project, [
            tree
          ]);

          fileUploads.value = [
            {
              type: FILE_TYPE.FOLDER,
              name: DMSTree[0].name,
              size: folder.reduce((a, b) => a + b.file?.size ?? 0, 0),
              files: matchFoldersAndDocs(DMSTree, folder)
            }
          ];
        });
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
          children: props.projectsTree
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
