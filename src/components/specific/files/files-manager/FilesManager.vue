<template>
  <BIMDataCard class="files-manager" :titleHeader="$t('FilesManager.title')">
    <template #left>
      <FilesManagerBreadcrumb :file="currentFolder" />
    </template>
    <template #content>
      <template v-if="fileStructure.children.length > 0">
        <div class="files-manager__actions">
          <FolderCreationButton
            :disabled="!project.isAdmin && currentFolder.userPermission < 100"
            class="files-manager__actions__btn-new-folder"
            width="194px"
            :project="project"
            :folder="currentFolder"
          />
          <FileUploadButton
            :disabled="!project.isAdmin && currentFolder.userPermission < 100"
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
              :project="project"
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
            @file-uploaded="$emit('file-uploaded')"
            @manage-access="openAccessManager($event)"
            @selection-changed="setSelection"
          />
        </div>

        <transition name="slide-fade-right">
          <div v-show="showSidePanel" class="files-manager__side-panel">
            <FolderAccessManager
              v-if="showAccessManager"
              :project="project"
              :folder="folderToManage"
              :groups="groups"
              @folder-permission-updated="$emit('folder-permission-updated')"
              @group-permission-updated="$emit('group-permission-updated')"
              @close="closeAccessManager"
            />
          </div>
        </transition>

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
          @file-uploaded="$emit('file-uploaded')"
        />
      </template>
    </template>
  </BIMDataCard>
</template>

<script>
import { ref, watch } from "vue";
import { useListFilter } from "@/composables/list-filter";
import { useFiles } from "@/state/files";
import { FILE_TYPE } from "@/utils/file-structure";
// Components
import FileTree from "@/components/specific/files/file-tree/FileTree";
import FileUploadButton from "@/components/specific/files/file-upload-button/FileUploadButton";
import FilesTable from "@/components/specific/files/files-table/FilesTable";
import FolderAccessManager from "@/components/specific/files/folder-access-manager/FolderAccessManager";
import FolderCreationButton from "@/components/specific/files/folder-creation-button/FolderCreationButton";
import FilesActionBar from "./files-action-bar/FilesActionBar";
import FilesDeleteModal from "./files-delete-modal/FilesDeleteModal";
import FilesManagerBreadcrumb from "./files-manager-breadcrumb/FilesManagerBreadcrumb";
import FilesManagerOnboarding from "./files-manager-onboarding/FilesManagerOnboarding";

export default {
  components: {
    FileTree,
    FileUploadButton,
    FilesTable,
    FolderAccessManager,
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
    },
    groups: {
      type: Array,
      required: true
    }
  },
  emits: [
    "file-uploaded",
    "folder-permission-updated",
    "group-permission-updated"
  ],
  setup(props) {
    const {
      fileStructureHandler: handler,
      moveFiles: move,
      downloadFiles: download
    } = useFiles();

    const currentFolder = ref(null);
    const currentFiles = ref([]);

    watch(
      () => props.fileStructure,
      struct => {
        if (!currentFolder.value || !handler.exists(currentFolder.value)) {
          currentFolder.value = struct;
        } else {
          currentFolder.value = handler.structure(currentFolder.value);
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

    const { filteredList: displayedFiles, searchText } = useListFilter(
      currentFiles,
      file => file.name
    );

    const selection = ref([]);
    const setSelection = models => {
      selection.value = models;
    };

    const filesToUpload = ref([]);
    const uploadFiles = files => {
      filesToUpload.value = files;
      setTimeout(() => (filesToUpload.value = []), 100);
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
      await download(props.project, files);
    };

    const showSidePanel = ref(false);
    const showAccessManager = ref(false);
    const folderToManage = ref(null);
    let stopCurrentFilesWatcher;
    const openAccessManager = folder => {
      folderToManage.value = folder;
      showAccessManager.value = true;
      showSidePanel.value = true;
      // Watch for current files changes in order to update
      // folder data in access manager accordingly
      stopCurrentFilesWatcher = watch(
        () => currentFiles.value,
        files => {
          const newFolder = files.find(file => file.id === folder.id);
          if (newFolder) {
            folderToManage.value = newFolder;
          } else {
            closeAccessManager();
          }
        }
      );
    };
    const closeAccessManager = () => {
      stopCurrentFilesWatcher();
      showSidePanel.value = false;
      setTimeout(() => {
        showAccessManager.value = false;
        folderToManage.value = null;
      }, 100);
    };

    return {
      // References
      currentFolder,
      displayedFiles,
      filesToDelete,
      filesToUpload,
      folderToManage,
      searchText,
      selection,
      showAccessManager,
      showDeleteModal,
      showSidePanel,
      // Methods
      closeAccessManager,
      closeDeleteModal,
      downloadFiles,
      moveFiles,
      openAccessManager,
      onFileSelected,
      openDeleteModal,
      setSelection,
      uploadFiles
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesManager.scss"></style>
