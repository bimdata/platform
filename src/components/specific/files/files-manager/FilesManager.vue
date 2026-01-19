<template>
  <div class="files-manager">
    <template v-if="hasFiles">
      <FilesManagerActions
        :currentFolder="currentFolder"
        :currentSpace="currentSpace"
        :project="project"
        :selectedFileTab="selectedFileTab"
        :spaceSubInfo="spaceSubInfo"
        :importFromOtherProjectsActions="importFromOtherProjectsActions"
        :initialSearchText="searchText"
        @update:searchText="searchText = $event"
        @upload-files="uploadFiles"
      />
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
          :class="{ 'without-tree': selectedFileTab.id !== 'folders' }"
        >
          <transition name="fade">
            <FilesActionBar
              class="files-manager__files__action-bar"
              v-show="selection.length > 0"
              :project="project"
              :fileStructure="fileStructure"
              :files="selection"
              :initialFolder="currentFolder"
              @delete-files="openFileDeleteModalOrWarningModal"
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
            ref="filesTable"
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
            @create-photosphere="createModelFromFile($event, MODEL_TYPE.PHOTOSPHERE)"
            @delete="openFileDeleteModal([$event])"
            @download="downloadFiles([$event])"
            @dragover.prevent="() => {}"
            @drop.prevent="uploadFiles"
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
            ref="filesTable"
            v-else-if="selectedFileTab.id === 'files'"
            :allFiles="displayedAllFiles"
            :allFolders="allFolders"
            :selection="selection"
            :project="project"
            :loadingFileIds="loadingFileIds"
            :files="displayedFiles"
            @create-model="createModelFromFile"
            @create-photosphere="createModelFromFile($event, MODEL_TYPE.PHOTOSPHERE)"
            @delete="openFileDeleteModal([$event])"
            @download="downloadFiles([$event])"
            @file-clicked="onFileSelected"
            @go-folders-view="goFoldersView"
            @manage-access="openAccessManager"
            @open-tag-manager="openTagManager"
            @open-versioning-manager="openVersioningManager"
            @open-visa-manager="openVisaManager"
            @remove-model="removeModel"
            @selection-changed="setSelection"
          />
          <VisasTable
            ref="filesTable"
            v-else-if="selectedFileTab.id === 'visas'"
            :allFolders="allFolders"
            :selection="selection"
            :visas="displayedVisas"
            @file-clicked="onFileSelected"
            @go-folders-view="goFoldersView"
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
            @preview-visa="onFileSelected"
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
import { computed, onActivated, onBeforeMount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useAppModal } from "../../app/app-modal/app-modal.js";
import { useAppNotification } from "../../app/app-notification/app-notification.js";
import { useAppSidePanel } from "../../app/app-side-panel/app-side-panel.js";
import { useSession } from "../../../../composables/session.js";
import { useListFilter } from "../../../../composables/list-filter.js";
import { useStandardBreakpoints } from "../../../../composables/responsive.js";
import { FILE_TYPE } from "../../../../config/files.js";
import { MODEL_TYPE } from "../../../../config/models.js";
import { IS_DELETION_TEMP_WORKAROUND_ENABLED } from "../../../../config/projects.js";
import { VISA_STATUS } from "../../../../config/visa.js";
import FileService from "../../../../services/FileService.js";
import TagService from "../../../../services/TagService";
import { useFiles } from "../../../../state/files.js";
import { useModels } from "../../../../state/models.js";
import { useProjects } from "../../../../state/projects.js";
import { useSpaces } from "../../../../state/spaces.js";
import { useVisa } from "../../../../state/visa.js";
import { collectDescendants } from "../../../../utils/file-tree.js";
import { isFolder } from "../../../../utils/file-structure.js";
import { getFilesFromEvent } from "../../../../utils/files.js";
import { isFullTotal } from "../../../../utils/spaces.js";
import { fileUploadInput } from "../../../../utils/upload.js";

// Components
import AllFilesTable from "../all-files-table/AllFilesTable.vue";
import AppSidePanelContent from "../../../specific/app/app-side-panel/AppSidePanelContent.vue";
import DocumentViewer from "../document-viewer/DocumentViewer.vue";
import FilesActionBar from "./files-action-bar/FilesActionBar.vue";
import FilesDeleteModal from "./files-delete-modal/FilesDeleteModal.vue";
import FilesManagerActions from "./files-manager-actions/FilesManagerActions.vue";
import FilesManagerOnboarding from "./files-manager-onboarding/FilesManagerOnboarding.vue";
import FileTree from "../file-tree/FileTree.vue";
import FileTreePreviewModal from "../file-tree-preview-modal/FileTreePreviewModal.vue";
import FolderAccessManager from "../folder-access-manager/FolderAccessManager.vue";
import FoldersTable from "../folder-table/FoldersTable.vue";
import SubscriptionModal from "../../subscriptions/subscription-modal/SubscriptionModal.vue";
import TagsMain from "../../tags/tags-main/TagsMain.vue";
import VersioningMain from "../../versioning/versioning-main/VersioningMain.vue";
import VisaMain from "../../visa/visa-main/VisaMain.vue";
import VisasDeleteModal from "./visas-delete-modal/VisasDeleteModal.vue";
import VisasTable from "../visas-table/VisasTable.vue";

export default {
  components: {
    AllFilesTable,
    AppSidePanelContent,
    FilesActionBar,
    FilesDeleteModal,
    FilesManagerActions,
    FilesManagerOnboarding,
    FileTree,
    FileTreePreviewModal,
    FolderAccessManager,
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
    const { gedFilesTab, gedTargetFolder } = useSession();

    const { fileStructureHandler: handler, moveFiles: move, downloadFiles: download } = useFiles();
    const { createModel, createPhotosphere, deleteModels } = useModels();

    const { fetchToValidateVisas, fetchCreatedVisas } = useVisa();

    const currentFolder = ref(null);
    const currentFiles = ref([]);
    const toValidateVisas = ref([]);
    const createdVisas = ref([]);
    const allTags = ref([]);
    const hasFiles = computed(() => props.fileStructure.children.length > 0);

    const sortByName = (a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase());

    const filesTable = ref(null);
    const documentViewerFilesList = computed(() => {
      if (!filesTable.value) return [];

      if (selectedFileTab.value.id === "folders") {
        // WARNING displayedRows is name from DS, may change
        return filesTable.value.filesTable.displayedRows.map((row) => row.data);
      }
      if (selectedFileTab.value.id === "files") {
        return filesTable.value.displayedListFiles;
      } else {
        return filesTable.value.enhancedVisas;
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
            selectedFileTab: selectedFileTab.value,
          },
        });
      }
    };

    const backToParent = (file) => {
      const parentFolder = handler.parent(file);

      currentFolder.value = handler.deserialize(parentFolder);
      if (selectedFileTab.value.id === "visas") {
        selectedFileTab.value = filesTabs[0];
      }
    };

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

    const createModelFromFile = async (file, type) => {
      try {
        loadingFileIds.value.push(file.id);
        let model;
        if (type === MODEL_TYPE.PHOTOSPHERE) {
          model = await createPhotosphere(props.project, file);
        } else {
          model = await createModel(props.project, file);
        }
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
    const openFileDeleteModal = (files) => {
      filesToDelete.value = files;
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

    const openFileDeleteModalOrWarningModal = (files) => {
      if (IS_DELETION_TEMP_WORKAROUND_ENABLED) {
        openModal({ component: WarningModal });
      } else {
        openFileDeleteModal(files);
      }
    };

    const moveFiles = async (event) => {
      await move(props.project, event.files, event.dest);
    };

    const downloadFiles = async (files) => {
      await download(props.project, files);
    };

    const { openSidePanel, closeSidePanel } = useAppSidePanel();

    const showAccessManager = ref(false);
    const showVersioningManager = ref(false);
    const showVisaManager = ref(false);
    const showTagManager = ref(false);
    const managers = {
      visa: showVisaManager,
      versioning: showVersioningManager,
      access: showAccessManager,
      tag: showTagManager,
    };
    const setManagerVisibility = (manager, value) => {
      Object.values(managers).forEach((ref) => (ref.value = false));
      if (managers[manager]) {
        managers[manager].value = value;
      }
    };

    const folderToManage = ref(null);
    const fileToManage = ref(null);
    const currentVisa = ref(null);

    let stopCurrentFilesWatcher;
    const openAccessManager = (folder) => {
      folderToManage.value = folder;
      setManagerVisibility("access", true);

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
    const openVisaManager = (file) => {
      onTabChange(filesTabs[2]);
      openSidePanel();
      try {
        visasLoading.value = true;
        fileToManage.value = file;
        currentVisa.value = file;
        setManagerVisibility("visa", true);
      } finally {
        visasLoading.value = false;
      }
    };

    const closeVisaManager = () => {
      closeSidePanel();
      setTimeout(() => {
        setManagerVisibility("visa", false);
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
        setManagerVisibility("versioning", true);
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
          openVisaManager(currentVisa.value);
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

    onMounted(() => {
      fetchVisas();
      fetchTags();
    });

    onActivated(() => {
      const folderId = gedTargetFolder.get();
      if (folderId) {
        jumpToTargetFolder(folderId);
      } else {
        jumpToTargetFolder(props.fileStructure.id);
      }
      gedTargetFolder.clear();
    });

    const openSubscriptionModal = () => {
      openModal({ component: SubscriptionModal });
    };

    const getFoldersInFolder = (folder) => collectDescendants(folder, isFolder);
    const getFilesInFolder = (folder) => collectDescendants(folder, (child) => !isFolder(child));

    const allFiles = computed(() => getFilesInFolder(props.fileStructure));
    const allFolders = computed(() => getFoldersInFolder(props.fileStructure));

    const filesTabs = [
      {
        id: "folders",
        text: t("FilesManager.foldersTab"),
        count: computed(() => props.fileStructure.children.length),
      },
      {
        id: "files",
        text: t("FilesManager.filesTab"),
        count: computed(() => allFiles.value.length),
      },
      {
        id: "visas",
        text: t("FilesManager.visasTab"),
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

    const jumpToTargetFolder = (folderId) => {
      selectedFileTab.value = filesTabs[0];
      const folder = handler.get({ nature: FILE_TYPE.FOLDER, id: folderId });
      currentFolder.value = handler.deserialize(folder);
    };

    watch(searchText, (newValue) => {
      filterFilesSearchText.value = newValue;
      filterAllFilesSearchText.value = newValue;
      filterVisasSearchText.value = newValue;
    });

    watch(
      () => props.fileStructure,
      (struct) => {
        const folderId = gedTargetFolder.get();

        if (folderId) {
          jumpToTargetFolder(folderId);
          gedTargetFolder.clear();
        } else {
          currentFolder.value = struct;
        }
      },
      { immediate: true }
    );

    watch(
      () => currentFolder.value,
      (folder) => {
        const childrenFolders = folder.children.filter(isFolder).sort(sortByName);
        const childrenFiles = folder.children.filter((c) => !isFolder(c)).sort(sortByName);
        currentFiles.value = childrenFolders.concat(childrenFiles);
        gedTargetFolder.set(folder.id);
      },
      { immediate: true }
    );

    return {
      // References
      allFiles,
      allFolders,
      allTags,
      allVisas,
      currentFolder,
      currentSpace,
      currentVisa,
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
      hasFiles,
      importFromOtherProjectsActions,
      loadingFileIds,
      MODEL_TYPE,
      searchText,
      selectedFileTab,
      selection,
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
      isFullTotal,
      moveFiles,
      onFileSelected,
      openAccessManager,
      openFileDeleteModal,
      openFileDeleteModalOrWarningModal,
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
