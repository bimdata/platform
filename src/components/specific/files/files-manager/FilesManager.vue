<template>
  <div class="files-manager">
    <template v-if="fileStructure.children.length > 0">
      <FilesManagerActions
        :currentFolder="currentFolder"
        :currentSpace="currentSpace"
        :project="project"
        :selectedFileTab="selectedFileTab"
        :spaceSubInfo="spaceSubInfo"
        :importFromOtherProjectsActions="importFromOtherProjectsActions"
        :initialSearchText="searchText"
        @update:searchText="handleSearchTextUpdate"
        @upload-files="uploadFiles"
      />
    </template>
    <template v-if="fileStructure.children.length > 0">
      <div class="files-manager__content">
        <transition name="slide-fade-left">
          <FileTree
            v-show="selectedFileTab.id === 'folders'"
            data-guide="file-tree"
            class="files-manager__tree"
            :project="project"
            :fileStructure="fileStructure"
            :selectedFile="currentFolder"
            @file-selected="onFileSelected"
          />
        </transition>

        <div
          class="files-manager__files"
          :class="selectedFileTab.id !== 'folders' ? `without-tree` : ''"
        >
          <transition name="fade">
            <FilesActionBar
              class="files-manager__files__action-bar"
              v-show="selection.length > 0"
              :project="project"
              :fileStructure="fileStructure"
              :files="selection"
              :initialFolder="currentFolder"
              @delete-files="openFileDeleteModal"
              @delete-visas="openVisaDeleteModal"
              @download="downloadFiles"
              @move="moveFiles"
            />
          </transition>

          <BIMDataTabs
            :tabs="filesTabs"
            width="100%"
            height="40px"
            tabSize="160"
            :selected="selectedFileTab.id"
            @tab-selected="onTabChange"
            class="files-manager__tabs"
          >
            <template #tab="{ tab }">
              <span class="files-manager__tabs-label">
                {{ tab.text }}
              </span>
              <span v-if="tab.id !== 'folders'" class="files-manager__tabs-count m-l-6">
                {{ tab.count }}
              </span>
            </template>
          </BIMDataTabs>
          <FoldersTable
            v-if="selectedFileTab.id === 'folders'"
            :files="displayedFiles"
            :project="project"
            :loadingFileIds="loadingFileIds"
            :selection="selection"
            :filesToUpload="filesToUpload"
            :folder="currentFolder"
            :foldersToUpload="foldersToUpload"
            @back-parent-folder="backToParent"
            @create-model="createModelFromFile"
            @delete="openFileDeleteModal([$event])"
            @download="downloadFiles([$event])"
            @file-clicked="onFileSelected"
            @file-uploaded="$emit('file-uploaded')"
            @manage-access="openAccessManager"
            @open-tag-manager="openTagManager"
            @open-versioning-manager="openVersioningManager"
            @open-visa-manager="openVisaManager"
            @remove-model="removeModel"
            @row-drop="({ event, data }) => uploadFiles(event, data)"
            @selection-changed="setSelection"
          />
          <AllFilesTable
            v-else-if="selectedFileTab.id === 'files'"
            :allFiles="displayedAllFiles"
            :selection="selection"
            :project="project"
            :loadingFileIds="loadingFileIds"
            :files="displayedFiles"
            @create-model="createModelFromFile"
            @delete="openFileDeleteModal([$event])"
            @download="downloadFiles([$event])"
            @file-clicked="onFileSelected"
            @manage-access="openAccessManager"
            @open-tag-manager="openTagManager"
            @open-versioning-manager="openVersioningManager"
            @open-visa-manager="openVisaManager"
            @remove-model="removeModel"
            @selection-changed="setSelection"
          />
          <VisasTable
            v-else-if="selectedFileTab.id === 'visas'"
            :selection="selection"
            :visas="displayedVisas"
            @reach-visa="openVisaManager"
            @selection-changed="setSelection"
            @delete="openVisaDeleteModal([$event])"
          />
        </div>

        <AppSidePanelContent side="right" :header="false">
          <template v-if="visasLoading">
            <div class="files-manager__content__loading flex items-center justify-center">
              <BIMDataSpinner />
            </div>
          </template>
          <FolderAccessManager
            v-if="showAccessManager"
            :project="project"
            :folder="folderToManage"
            @close="closeSidePanel"
          />
          <VisaMain
            v-else-if="showVisaManager"
            :project="project"
            :document="fileToManage"
            :visa="currentVisa"
            @close="closeVisaManager"
            @create-visa="goVisasView"
            @fetch-visas="fetchVisas"
            @reach-file="backToParent"
          />
          <TagsMain
            v-else-if="showTagManager"
            :project="project"
            :document="fileToManage"
            :allTags="allTags"
            @close="closeTagManager"
            @fetch-tags="fetchTags"
            @file-updated="$emit('file-updated')"
          />
          <VersioningMain
            v-else-if="showVersioningManager"
            :project="project"
            :document="fileToManage"
            :currentFolder="currentFolder"
            :spaceSubInfo="spaceSubInfo"
            @file-uploaded="$emit('file-uploaded')"
            @close="closeVersioningManager"
          />
        </AppSidePanelContent>
      </div>
    </template>

    <template v-else>
      <FilesManagerOnboarding
        class="files-manager__onboarding"
        :project="project"
        :importFromOtherProjectsActions="importFromOtherProjectsActions"
        :rootFolder="fileStructure"
        @file-uploaded="$emit('file-uploaded')"
      />
    </template>
  </div>
</template>

<script>
import { computed, onBeforeMount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useAppModal } from "../../app/app-modal/app-modal.js";

import { useAppNotification } from "../../app/app-notification/app-notification.js";
import { useAppSidePanel } from "../../app/app-side-panel/app-side-panel.js";

import { useSession } from "../../../../composables/session.js";
import { useListFilter } from "../../../../composables/list-filter.js";
import { useStandardBreakpoints } from "../../../../composables/responsive.js";
import { VISA_STATUS } from "../../../../config/visa.js";
import FileService from "../../../../services/FileService.js";
import TagService from "../../../../services/TagService";
import { useFiles } from "../../../../state/files.js";
import { useModels } from "../../../../state/models.js";
import { useProjects } from "../../../../state/projects.js";
import { useSpaces } from "../../../../state/spaces.js";
import { useVisa } from "../../../../state/visa.js";
import { isFolder } from "../../../../utils/file-structure.js";
import { getFilesFromEvent } from "../../../../utils/files.js";
import { isFullTotal } from "../../../../utils/spaces.js";
import { fileUploadInput } from "../../../../utils/upload.js";

// Components
import AppSidePanelContent from "../../../specific/app/app-side-panel/AppSidePanelContent.vue";
import DocumentViewer from "../document-viewer/DocumentViewer.vue";
import FilesActionBar from "./files-action-bar/FilesActionBar.vue";
import FilesDeleteModal from "./files-delete-modal/FilesDeleteModal.vue";
import FilesManagerOnboarding from "./files-manager-onboarding/FilesManagerOnboarding.vue";
import FileTree from "../file-tree/FileTree.vue";
import FileTreePreviewModal from "../file-tree-preview-modal/FileTreePreviewModal.vue";
import FolderAccessManager from "../folder-access-manager/FolderAccessManager.vue";
import SubscriptionModal from "../../subscriptions/subscription-modal/SubscriptionModal.vue";
import TagsMain from "../../tags/tags-main/TagsMain.vue";
import VersioningMain from "../../versioning/versioning-main/VersioningMain.vue";
import VisaMain from "../../visa/visa-main/VisaMain.vue";

import FoldersTable from "../folder-table/FoldersTable.vue";
import VisasTable from "../visas-table/VisasTable.vue";
import AllFilesTable from "../all-files-table/AllFilesTable.vue";
import VisasDeleteModal from "./visas-delete-modal/VisasDeleteModal.vue";

import FilesManagerActions from "./files-manager-actions/FilesManagerActions.vue";

export default {
  components: {
    AllFilesTable,
    AppSidePanelContent,
    FilesActionBar,
    FilesDeleteModal,
    FilesManagerActions,
    FilesManagerOnboarding,
    // FilesTable,
    FileTree,
    FileTreePreviewModal,
    FolderAccessManager,
    // FolderCreationButton,
    FoldersTable,
    TagsMain,
    VersioningMain,
    VisaMain,
    VisasTable,
    VisasDeleteModal,
  },
  props: {
    spaceSubInfo: {
      type: Object,
      required: true,
    },
    project: {
      type: Object,
      required: true,
    },
    fileStructure: {
      type: Object,
      required: true,
    },
  },
  emits: ["file-uploaded", "file-updated", "model-created"],
  setup(props, { emit }) {
    const route = useRoute();
    const { t } = useI18n();
    const { pushNotification } = useAppNotification();
    const { currentSpace } = useSpaces();
    const { openModal, closeModal } = useAppModal();

    const { spaceProjects } = useProjects();
    const { gedFilesTab } = useSession();

    const {
      fileStructureHandler: handler,
      moveFiles: move,
      downloadFiles: download,
      projectFileStructure,
    } = useFiles();
    const { createModel, deleteModels } = useModels();

    const { fetchToValidateVisas, fetchCreatedVisas } = useVisa();

    const currentFolder = ref(null);
    const currentFiles = ref([]);
    const toValidateVisas = ref([]);
    const createdVisas = ref([]);
    const allTags = ref([]);

    const getFilesInFolder = (folder) => {
      const files = [];
      folder.children.forEach((child) => {
        if (isFolder(child)) {
          files.push(...getFilesInFolder(child));
        } else {
          files.push(child);
        }
      });
      return files;
    };
    const allFiles = computed(() =>
      props.fileStructure.children.flatMap((file) => {
        if (isFolder(file)) {
          return getFilesInFolder(file);
        } else {
          return file;
        }
      })
    );

    watch(
      () => props.fileStructure,
      (struct) => {
        if (!currentFolder.value || !handler.exists(currentFolder.value)) {
          currentFolder.value = struct;
        } else {
          currentFolder.value = handler.deserialize(currentFolder.value);
        }
      },
      { immediate: true }
    );
    watch(
      () => currentFolder.value,
      (folder) => {
        const childrenFolders = folder.children
          .filter((child) => isFolder(child))
          .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
        const childrenFiles = folder.children
          .filter((child) => !isFolder(child))
          .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
        currentFiles.value = childrenFolders.concat(childrenFiles);
      },
      { immediate: true }
    );

    const filesTable = ref(null);
    const documentViewerFilesList = computed(() => {
      if (!filesTable.value) return [];

      if (selectedFileTab.value.id === "folders") {
        // WARNING displayedRows is name from DS, may change
        return filesTable.value.filesTable.displayedRows.map((row) => row.data);
      } else {
        return filesTable.value.displayedListFiles;
      }
    });

    const onFileSelected = (file) => {
      if (isFolder(file)) {
        currentFolder.value = handler.deserialize(file);
      } else {
        openModal({
          component: DocumentViewer,
          props: {
            project: props.project,
            folder: currentFolder.value,
            document: file,
            currentView: documentViewerFilesList.value,
          },
        });
      }
    };

    const backToParent = (file) => {
      const parentFolder = handler.parent(file);
      currentFolder.value = handler.deserialize(parentFolder);
      if (file.visas) {
        selectedFileTab.value = filesTabs[0];
      }
    };

    // const { filteredList: displayedFiles, searchText } = useListFilter(
    //   currentFiles,
    //   (file) => file.name
    // );

    // // Apply search to "allFiles" list
    // const displayedAllFiles = computed(() => {
    //   const text = searchText.value.trim().toLowerCase();
    //   return text ? allFiles.value.filter(file =>
    //     file.name.toLowerCase().includes(text)
    //   ) : allFiles.value;
    // });

    const selection = ref([]);
    const setSelection = (models) => {
      selection.value = models;
    };

    const filesToUpload = ref([]);
    const foldersToUpload = ref([]);
    const uploadFiles = async (event, folder = currentFolder.value) => {
      const { files, folders } = await getFilesFromEvent(event);
      files.forEach((file) => (file.folder = folder));

      filesToUpload.value = files;
      foldersToUpload.value = await Promise.all(
        folders.map((f) => FileService.createFolderStructure(props.project, folder, f))
      );

      setTimeout(() => {
        filesToUpload.value = [];
        foldersToUpload.value = [];
      }, 10);
    };

    const loadingFileIds = ref([]);

    const createModelFromFile = async (file) => {
      try {
        loadingFileIds.value.push(file.id);
        const model = await createModel(props.project, file);
        emit("model-created", model);
        pushNotification({
          type: "success",
          title: t("t.success"),
          message: t("FilesManager.createModelNotification"),
        });
      } finally {
        loadingFileIds.value = loadingFileIds.value.filter((id) => id !== file.id);
      }
    };

    const removeModel = async (file) => {
      try {
        loadingFileIds.value.push(file.id);
        await deleteModels(props.project, [{ id: file.model_id, type: file.model_type }]);
      } finally {
        loadingFileIds.value = loadingFileIds.value.filter((id) => id !== file.id);
      }
    };

    const filesToDelete = ref([]);
    const showDeleteModal = ref(false);
    const openFileDeleteModal = (models) => {
      filesToDelete.value = models;
      openModal({
        component: FilesDeleteModal,
        props: {
          project: props.project,
          files: filesToDelete.value,
          onClose: closeModal,
        },
      });
      showDeleteModal.value = true;
    };

    const visasToDelete = ref([]);
    const openVisaDeleteModal = (visas) => {
      visasToDelete.value = visas;
      openModal({
        component: VisasDeleteModal,
        props: {
          project: props.project,
          visas: visasToDelete.value,
          onClose: closeModal,
          onDelete: closeDeleteModal,
        },
      });
    };
    const closeDeleteModal = async () => {
      if (filesToDelete.value.length) {
        filesToDelete.value = [];
      }
      if (visasToDelete.value.length) {
        visasToDelete.value = [];
        await fetchVisas();
      }
      closeModal();
    };

    const moveFiles = async (event) => {
      await move(props.project, event.files, event.dest);
    };

    const downloadFiles = async (files) => {
      await download(props.project, files);
    };

    const { openSidePanel, closeSidePanel } = useAppSidePanel();

    const showAccessManager = ref(false);
    const showVisaManager = ref(false);
    const showTagManager = ref(false);
    const setManagerVisibility = ({
      visa = false,
      versioning = false,
      access = false,
      tag = false,
    }) => {
      showVisaManager.value = visa;
      showVersioningManager.value = versioning;
      showAccessManager.value = access;
      showTagManager.value = tag;
    };

    const folderToManage = ref(null);
    const fileToManage = ref(null);
    const currentVisa = ref(null);

    let stopCurrentFilesWatcher;
    const openAccessManager = (folder) => {
      folderToManage.value = folder;
      setManagerVisibility({ access: true });

      openSidePanel();
      // Watch for current files changes in order to update
      // folder data in access manager accordingly
      stopCurrentFilesWatcher = watch(
        () => currentFiles.value,
        (files) => {
          const newFolder = files.find((file) => file.id === folder.id);
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
      closeSidePanel();
      setTimeout(() => {
        showAccessManager.value = false;
        folderToManage.value = null;
      }, 100);
    };

    const visasLoading = ref(false);
    const openVisaManager = async (file) => {
      openSidePanel();
      try {
        visasLoading.value = true;
        await loadVisaData(file);
        fileToManage.value = file;
        currentVisa.value = file;

        setManagerVisibility({ visa: true });
      } finally {
        visasLoading.value = false;
      }
    };
    const loadVisaData = async (file) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500);
      });
    };

    const closeVisaManager = () => {
      closeSidePanel();
      setTimeout(() => {
        setManagerVisibility({ visa: false });
        fileToManage.value = null;
        currentVisa.value = null;
      }, 100);
    };

    const openTagManager = (file) => {
      openSidePanel();
      if (file.file_name) {
        fileToManage.value = file;
        showTagManager.value = true;
        showAccessManager.value = false;
        showVisaManager.value = false;
        showVersioningManager.value = false;
      }
    };
    const closeTagManager = () => {
      closeSidePanel();
      setTimeout(() => {
        showTagManager.value = false;
        fileToManage.value = null;
      }, 100);
    };

    const openVersioningManager = (file) => {
      openSidePanel();
      if (file.file_name) {
        fileToManage.value = file;
        setManagerVisibility({ versioning: true });
      }
    };
    const closeVersioningManager = () => {
      closeSidePanel();
      setTimeout(() => {
        showVersioningManager.value = false;
        fileToManage.value = null;
      }, 100);
    };

    const fetchVisas = async () => {
      const [toValidateResponse, createdResponse] = await Promise.all([
        fetchToValidateVisas(props.project),
        fetchCreatedVisas(props.project),
      ]);

      toValidateVisas.value = toValidateResponse;
      createdVisas.value = createdResponse;
      if (route.query.visaId) {
        currentVisa.value = toValidateVisas.value.find(
          (v) => v.id === parseInt(route.query.visaId)
        );
        if (currentVisa.value) {
          openVisaManager();
        }
      }
    };

    const visasCounter = computed(
      () =>
        toValidateVisas.value.filter((v) => v.status !== VISA_STATUS.CLOSE).length +
        createdVisas.value.filter((v) => v.status !== VISA_STATUS.CLOSE).length
    );

    const fetchTags = async () => {
      allTags.value = await TagService.fetchAllTags(props.project);
    };

    const importFromOtherProjectsActions = computed(() => {
      return spaceProjects.value
        .filter((project) => project.id != props.project.id)
        .map((project) => ({
          name: project.name,
          action: () => {
            openModal({
              component: FileTreePreviewModal,
              props: {
                sourceProject: project,
                currentProject: props.project,
                onSuccess() {
                  emit("file-updated");
                },
              },
            });
          },
        }));
    });

    const allVisas = computed(() => {
      return [...toValidateVisas.value, ...createdVisas.value].sort((a, b) => {
        if (a.created_at < b.created_at) return 1;
        if (a.created_at > b.created_at) return -1;
        return 0;
      });
    });

    onMounted(async () => {
      fetchVisas();
      fetchTags();
    });

    const openSubscriptionModal = () => {
      openModal({ component: SubscriptionModal });
    };

    const getFoldersInFolder = (folder) => {
      const folders = [];
      folder.children.forEach((child) => {
        if (isFolder(child)) {
          folders.push(child);
          folders.push(...getFoldersInFolder(child));
        }
      });
      return folders;
    };
    const allFolders = computed(() =>
      props.fileStructure.children.flatMap((file) => {
        if (isFolder(file)) {
          return [file, ...getFoldersInFolder(file)];
        } else {
          return [];
        }
      })
    );

    const filesTabs = [
      {
        id: "folders",
        text: "Dossiers",
        count: computed(() => props.fileStructure.children.length),
      },
      {
        id: "files",
        text: "Tous les fichiers",
        count: computed(() => allFiles.value.length),
      },
      {
        id: "visas",
        text: "Mes visas",
        count: computed(() => visasCounter.value),
      },
    ];

    const DEFAULT_FILE_TAB = filesTabs[0].id;
    const selectedFileTab = ref(filesTabs[0]);
    const onTabChange = (tab) => {
      const tabKey = filesTabs.find((t) => t.id === tab.id) ? tab.id : DEFAULT_FILE_TAB;

      gedFilesTab.set(props.project.id, tabKey); 

      selectedFileTab.value = tab;
      selection.value = [];
    };
    onBeforeMount(() => {
      const savedTabKey = gedFilesTab.get(props.project.id) || DEFAULT_FILE_TAB;
      const savedTab = filesTabs.find((t) => t.id === savedTabKey) || filesTabs[0];
      onTabChange(savedTab);
    });

    const goFoldersView = () => {
      selectedFileTab.value = filesTabs[0];
      selection.value = [];
    };
    const goVisasView = () => {
      selectedFileTab.value = filesTabs[2];
      selection.value = [];
    };

    const searchText = ref("");
    const { filteredList: displayedFiles, searchText: filterFilesSearchText } = useListFilter(
      currentFiles,
      (file) => file.name
    );
    const { filteredList: displayedAllFiles, searchText: filterAllFilesSearchText } = useListFilter(
      allFiles,
      (file) => file.name
    );
    const { filteredList: displayedVisas, searchText: filterVisasSearchText } = useListFilter(
      allVisas,
      (visa) => visa.document.name
    );
    const handleSearchTextUpdate = (newSearchText) => {
      searchText.value = newSearchText;
      if (selectedFileTab.value.id === "folders") {
        filterFilesSearchText.value = newSearchText;
      }
      if (selectedFileTab.value.id === "files") {
        filterAllFilesSearchText.value = newSearchText;
      }
      if (selectedFileTab.value.id === "visas") {
        filterVisasSearchText.value = newSearchText;
      }
    };
    watch(searchText, (newValue) => {
      if (selectedFileTab.value.id === "folders") {
        filterFilesSearchText.value = newValue;
      }
      if (selectedFileTab.value.id === "files") {
        filterAllFilesSearchText.value = newValue;
      }
      if (selectedFileTab.value.id === "visas") {
        filterVisasSearchText.value = newValue;
      }
    });

    return {
      // References
      allFiles,
      allFolders,
      allTags,
      allVisas,
      currentFolder,
      currentSpace,
      currentVisa,
      displayedAllFiles,
      displayedFiles,
      displayedAllFiles,
      displayedVisas,
      fileToManage,
      filesTabs,
      filesTable,
      filesToDelete,
      filesToUpload,
      foldersToUpload,
      folderToManage,
      importFromOtherProjectsActions,
      loadingFileIds,
      searchText,
      selectedFileTab,
      selection,
      // shouldSubscribe,
      showAccessManager,
      showDeleteModal,
      showTagManager,
      showVersioningManager,
      showVisaManager,
      // Methods
      backToParent,
      closeAccessManager,
      closeDeleteModal,
      closeSidePanel,
      closeTagManager,
      closeVersioningManager,
      closeVisaManager,
      createModelFromFile,
      downloadFiles,
      fetchTags,
      fetchVisas,
      fileUploadInput,
      goFoldersView,
      goVisasView,
      handleSearchTextUpdate,
      isFullTotal,
      moveFiles,
      onFileSelected,
      openAccessManager,
      openFileDeleteModal,
      openVisaDeleteModal,
      openSidePanel,
      openSubscriptionModal,
      onTabChange,
      openTagManager,
      openVersioningManager,
      openVisaManager,
      removeModel,
      setSelection,
      uploadFiles,
      visasLoading,
      // Responsive breakpoints
      ...useStandardBreakpoints(),
    };
  },
};
</script>

<style scoped lang="scss" src="./FilesManager.scss"></style>
