<template>
  <BIMDataCard class="files-manager" :titleHeader="$t('FilesManager.title')">
    <template #left>
      <FilesManagerBreadcrumb :file="currentFolder" />
    </template>
    <template #content>
      <template v-if="fileStructure.children.length > 0">
        <div class="files-manager__actions">
          <FolderCreationButton
            class="files-manager__actions__btn-new-folder"
            width="194px"
            :project="project"
            :folder="currentFolder"
          />
          <FileUploadButton
            class="files-manager__actions__btn-new-file"
            width="194px"
            multiple
            @upload="uploadFiles"
          />
          <BIMDataSearch
            class="files-manager__actions__input-search"
            width="400px"
            :placeholder="$t('FilesManager.searchInputPlaceholder')"
            v-model="searchText"
            clear
          />
        </div>
        <FileTree
          class="files-manager__tree"
          :project="project"
          :fileStructure="fileStructure"
          :selectedFile="currentFolder"
          @file-selected="onFileSelected"
        />
        <div class="files-manager__files">
          <transition name="fade">
            <FilesActionBar
              v-show="selection.length > 0"
              class="files-manager__files__action-bar"
              :fileStructure="fileStructure"
              :files="selection"
              @delete="openDeleteModal"
              @download="downloadFiles"
              @move="moveFiles"
            />
          </transition>
          <FilesTable
            class="files-manager__files__table"
            :project="project"
            :folder="currentFolder"
            :files="displayedFiles"
            :filesToUpload="filesToUpload"
            @delete="openDeleteModal([$event])"
            @download="downloadFiles([$event])"
            @file-clicked="onFileSelected"
            @file-uploaded="onFileUploaded"
            @selection-changed="setSelection"
          />
        </div>

        <transition name="fade">
          <FilesDeleteModal
            v-if="showDeleteModal"
            :project="project"
            :files="filesToDelete"
            @close="closeDeleteModal"
          />
        </transition>
      </template>

      <template v-else>
        <FilesManagerOnboarding
          class="files-manager__onboarding"
          :project="project"
          :rootFolder="fileStructure"
          @file-uploaded="onFileUploaded"
        />
      </template>
    </template>
  </BIMDataCard>
</template>

<script>
import { inject, ref, watch, watchEffect } from "vue";
import { useFiles } from "@/state/files";
import { download } from "@/utils/download";
import { FILE_TYPE } from "@/utils/file-structure";
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";
import FileTree from "@/components/specific/files/file-tree/FileTree";
import FileUploadButton from "@/components/specific/files/file-upload-button/FileUploadButton";
import FilesTable from "@/components/specific/files/files-table/FilesTable";
import FolderCreationButton from "@/components/specific/files/folder-creation-button/FolderCreationButton";
import FilesActionBar from "./files-action-bar/FilesActionBar";
import FilesDeleteModal from "./files-delete-modal/FilesDeleteModal";
import FilesManagerBreadcrumb from "./files-manager-breadcrumb/FilesManagerBreadcrumb";
import FilesManagerOnboarding from "./files-manager-onboarding/FilesManagerOnboarding";

export default {
  components: {
    BIMDataCard,
    BIMDataSearch,
    FileTree,
    FileUploadButton,
    FilesTable,
    FolderCreationButton,
    FilesActionBar,
    FilesDeleteModal,
    FilesManagerBreadcrumb,
    FilesManagerOnboarding
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    fileStructure: {
      type: Object,
      required: true
    }
  },
  emits: ["file-uploaded"],
  setup(props, { emit }) {
    const { moveFiles: move, getArchiveUrl } = useFiles();

    const handler = inject("fileStructureHandler");
    const currentFolder = ref(null);
    const currentFiles = ref([]);

    watch(
      () => props.fileStructure,
      struct => {
        if (!currentFolder.value || !handler().exists(currentFolder.value)) {
          currentFolder.value = struct;
        } else {
          currentFolder.value = handler().structure(currentFolder.value);
        }
      },
      { immediate: true }
    );
    watch(
      () => currentFolder.value,
      folder => {
        const childrenFolders = folder.children
          .filter(child => child.type === FILE_TYPE.FOLDER)
          .sort((a, b) => (a.name < b.name ? -1 : 1));
        const childrenFiles = folder.children
          .filter(child => child.type !== FILE_TYPE.FOLDER)
          .sort((a, b) => (a.name < b.name ? -1 : 1));
        currentFiles.value = childrenFolders.concat(childrenFiles);
      },
      { immediate: true }
    );
    const onFileSelected = file => {
      if (file.type === FILE_TYPE.FOLDER) {
        currentFolder.value = file;
      }
    };

    const displayedFiles = ref([]);
    watch(
      () => currentFiles.value,
      () => (displayedFiles.value = currentFiles.value),
      { immediate: true }
    );

    const searchText = ref("");
    const filterFiles = value => {
      const text = value.trim().toLowerCase();
      if (text) {
        displayedFiles.value = currentFiles.value.filter(a =>
          a.name.toLowerCase().includes(text)
        );
      } else {
        displayedFiles.value = currentFiles.value;
      }
    };
    watchEffect(() => filterFiles(searchText.value));

    const selection = ref([]);
    const setSelection = models => {
      selection.value = models;
    };

    const filesToUpload = ref([]);
    const uploadFiles = files => {
      filesToUpload.value = files;
      setTimeout(() => (filesToUpload.value = []), 100);
    };
    const onFileUploaded = () => {
      emit("file-uploaded");
    };

    const filesToDelete = ref([]);
    const showDeleteModal = ref(false);
    const openDeleteModal = models => {
      filesToDelete.value = models;
      showDeleteModal.value = true;
    };
    const closeDeleteModal = () => {
      filesToDelete.value = [];
      showDeleteModal.value = false;
    };

    const moveFiles = async event => {
      await move(props.project, event.files, event.dest);
    };

    const downloadFiles = async files => {
      let downloadName, downloadUrl;
      if (files.length === 0) {
        return;
      }
      if (files.length === 1 && files[0].type !== FILE_TYPE.FOLDER) {
        downloadName = files[0].fileName;
        downloadUrl = files[0].file;
      } else {
        downloadName = props.project.name;
        downloadUrl = getArchiveUrl(props.project, files);
      }
      download({ name: downloadName, url: downloadUrl });
    };

    return {
      // References
      currentFolder,
      displayedFiles,
      filesToDelete,
      filesToUpload,
      searchText,
      selection,
      showDeleteModal,
      // Methods
      closeDeleteModal,
      downloadFiles,
      moveFiles,
      onFileSelected,
      onFileUploaded,
      openDeleteModal,
      setSelection,
      uploadFiles
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesManager.scss"></style>
