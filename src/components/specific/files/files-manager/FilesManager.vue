<template>
  <div class="files-manager">
    <template v-if="fileStructure.children.length > 0">
      <div class="files-manager__actions">
        <div class="start" v-if="selectedFileTab.id === 'folders'">
          <template v-if="menuItems.length > 0">
            <BIMDataDropdownMenu
              ref="dropdown"
              class="files-manager__actions__dropdown"
              width="20%"
              height="32px"
              :menuItems="menuItems"
              :subListMaxHeight="dropdownMaxHeight"
            >
              <template #header="{ isOpen }">
                <BIMDataIconBurgerMenu size="m" fill color="primary" />
                <BIMDataIcon
                  name="chevron"
                  size="xxs"
                  fill
                  color="primary"
                  :rotate="isOpen ? 90 : 0"
                />
              </template>
            </BIMDataDropdownMenu>
          </template>
          <FolderCreationButton
            data-guide="btn-new-folder"
            class="files-manager__actions__btn-new-folder"
            width="100%"
            :project="project"
            :folder="currentFolder"
            :disabled="project.isGuest || !hasAdminPerm(project, currentFolder)"
          >
            <BIMDataIconAddFolder size="xs" />
            <span
              v-if="(project.isAdmin && !isXXXL) || (!project.isAdmin && !isMidXL)"
              style="margin-left: 6px"
            >
              {{ $t("FolderCreationButton.text") }}
            </span>
            <span
              v-else-if="
                (project.isAdmin && !isXL && isXXXL) || (!project.isAdmin && !isMD && isMidXL)
              "
              style="margin-left: 6px"
            >
              {{ $t("t.folder") }}
            </span>
          </FolderCreationButton>
          <BIMDataTooltip
            data-guide="btn-upload-file"
            data-test-id="btn-upload-file"
            class="files-manager__actions__btn-new-file"
            color="high"
            :disabled="currentSpace.isUserOrga || !isFullTotal(spaceSubInfo)"
            :text="
              $t(
                `ProjectOverview.uploadDisableMessage.${
                  isFullTotal(spaceSubInfo) ? 'size' : 'permission'
                }`
              )
            "
          >
            <template v-if="shouldSubscribe">
              <BIMDataButton
                width="100%"
                height="32px"
                color="primary"
                fill
                radius
                :disabled="!hasAdminPerm(project, currentFolder)"
                @click="openSubscriptionModal"
              >
                <BIMDataIconAddFile size="xs" />
                <span
                  v-if="(project.isAdmin && !isXXXL) || (!project.isAdmin && !isMidXL)"
                  style="margin-left: 6px"
                >
                  {{ $t("FileUploadButton.addFileButtonText") }}
                </span>
                <span
                  v-else-if="
                    (project.isAdmin && !isXL && isXXXL) || (!project.isAdmin && !isMD && isMidXL)
                  "
                  style="margin-left: 6px"
                >
                  {{ $t("t.file") }}
                </span>
              </BIMDataButton>
            </template>
            <template v-else>
              <BIMDataButton
                width="100%"
                color="primary"
                fill
                radius
                icon
                :disabled="
                  project.isGuest ||
                  (!currentSpace.isUserOrga && isFullTotal(spaceSubInfo)) ||
                  !hasAdminPerm(project, currentFolder)
                "
                @click="
                  fileUploadInput('file', (event) => uploadFiles(event), {
                    multiple: true,
                  })
                "
              >
                <BIMDataIconAddFile size="xs" />
                <span
                  v-if="(project.isAdmin && !isXXXL) || (!project.isAdmin && !isMidXL)"
                  style="margin-left: 6px"
                >
                  {{ $t("FileUploadButton.addFileButtonText") }}
                </span>
                <span
                  v-else-if="
                    (project.isAdmin && !isXL && isXXXL) || (!project.isAdmin && !isMD && isMidXL)
                  "
                  style="margin-left: 6px"
                >
                  {{ $t("t.file") }}
                </span>
              </BIMDataButton>
            </template>
          </BIMDataTooltip>
        </div>

        <div class="middle">
          <BIMDataSearch
            class="files-manager__actions__input-search"
            :width="isMD ? '200px' : isLG ? '300px' : '400px'"
            :placeholder="$t('t.search')"
            v-model="searchText"
            clear
          />
        </div>
      </div>
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
            :folder="currentFolder"
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
            :allFiles="allFiles"
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
            :visas="allVisas"
            @reach-visa="openVisaManager"
            @selection-changed="setSelection"
            @delete="openVisaDeleteModal([$event])"
          />
          <!-- </transition> -->
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
            @fetch-visas="fetchVisas"
            @close="closeVisaManager"
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
import { computed, onMounted, ref, watch, inject, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useAppModal } from "../../app/app-modal/app-modal.js";
import { useAppNotification } from "../../app/app-notification/app-notification.js";
import { useAppSidePanel } from "../../app/app-side-panel/app-side-panel.js";
import { useListFilter } from "../../../../composables/list-filter.js";
import {
  useStandardBreakpoints,
  useCustomBreakpoints,
} from "../../../../composables/responsive.js";
import { VISA_STATUS } from "../../../../config/visa.js";
import FileService from "../../../../services/FileService.js";
import TagService from "../../../../services/TagService";
import { useFiles } from "../../../../state/files.js";
import { useModels } from "../../../../state/models.js";
import { useProjects } from "../../../../state/projects.js";
import { useSpaces } from "../../../../state/spaces.js";
import { useVisa } from "../../../../state/visa.js";
import { hasAdminPerm, isFolder } from "../../../../utils/file-structure.js";
import { getFilesFromEvent } from "../../../../utils/files.js";
import { isFullTotal } from "../../../../utils/spaces.js";
import { fileUploadInput } from "../../../../utils/upload.js";

// Components
import AppSidePanelContent from "../../../specific/app/app-side-panel/AppSidePanelContent.vue";
import DocumentViewer from "../document-viewer/DocumentViewer.vue";
import FilesActionBar from "./files-action-bar/FilesActionBar.vue";
import FilesDeleteModal from "./files-delete-modal/FilesDeleteModal.vue";
import FilesManagerOnboarding from "./files-manager-onboarding/FilesManagerOnboarding.vue";
import FilesTable from "../files-table/FilesTable.vue";
import FileTree from "../file-tree/FileTree.vue";
import FileTreePreviewModal from "../file-tree-preview-modal/FileTreePreviewModal.vue";
import FolderAccessManager from "../folder-access-manager/FolderAccessManager.vue";
import FolderCreationButton from "../folder-creation-button/FolderCreationButton.vue";
import SubscriptionModal from "../../subscriptions/subscription-modal/SubscriptionModal.vue";
import TagsMain from "../../tags/tags-main/TagsMain.vue";
import VersioningMain from "../../versioning/versioning-main/VersioningMain.vue";
import VisaMain from "../../visa/visa-main/VisaMain.vue";
import FileDragAndDropModal from "./file-drag-and-drop-modal/FileDragAndDropModal.vue";
import FoldersTable from "../folder-table/FoldersTable.vue";
import VisasTable from "../visas-table/VisasTable.vue";
import AllFilesTable from "../all-files-table/AllFilesTable.vue";
import VisasDeleteModal from "./visas-delete-modal/VisasDeleteModal.vue";

export default {
  components: {
    AllFilesTable,
    AppSidePanelContent,
    FilesActionBar,
    FilesDeleteModal,
    FilesManagerOnboarding,
    FilesTable,
    FileTree,
    FileTreePreviewModal,
    FolderAccessManager,
    FolderCreationButton,
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

    const { isXXXL, isMidXL } = useCustomBreakpoints({
      isXXXL: ({ width }) => width <= 1521 - 0.02,
      isMidXL: ({ width }) => width <= 1277 - 0.02,
    });

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

    const { filteredList: displayedFiles, searchText } = useListFilter(
      currentFiles,
      (file) => file.name
    );

    // Apply search to "allFiles" list
    const displayedAllFiles = computed(() => {
      const text = searchText.value.trim().toLowerCase();
      return text ? allFiles.value.filter(file =>
        file.name.toLowerCase().includes(text)
      ) : allFiles.value;
    });

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
          document: fileToManage.value,
          project: props.project,
          visas: visasToDelete.value,
          onClose: closeModal,
        },
      });
    };

    const closeDeleteModal = () => {
      filesToDelete.value = [];
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
    const setManagerVisibility = ({ visa = false, versioning = false, access = false, tag = false }) => {
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
        // showVisaManager.value = false;
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

    const dropdown = ref(null);
    const menuItems = computed(() => {
      const items = [];

      if (props.project.isAdmin) {
        items.push(
          {
            name: t("FilesManager.structureImport"),
            children: { list: importFromOtherProjectsActions.value },
          },
          {
            name: t("FilesManager.gedDownload"),
            action: () => downloadFiles([projectFileStructure.value]),
          }
        );
      }

      if (!props.project.isGuest) {
        items.splice(1, 0, {
          name: t("FilesManager.folderImport"),
          action: () => {
            openModal({
              component: FileDragAndDropModal,
              props: {
                onDrop: (event) => uploadFiles(event),
              },
            });
            dropdown.value.displayed = false; // force close the drop down menu
          },
        });
      }

      return items;
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

    const fileManager = ref(null);
    const dropdownMaxHeight = computed(() => {
      if (!fileManager.value || !dropdown.value) return;
      const { y, height: H } = dropdown.value.$el.getBoundingClientRect();
      return `${fileManager.value?.$el?.getBoundingClientRect().height - H - y}px`;
    });

    const shouldSubscribe = inject("shouldSubscribe");
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
        count: computed(() => allVisas.value.length),
      },
    ];
    const selectedFileTab = ref(filesTabs[0]);
    const onTabChange = (tab) => {
      selectedFileTab.value = tab;
      selection.value = [];
    };
    const goFoldersView = () => {
      selectedFileTab.value = filesTabs[0];
      selection.value = [];
    };

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
      dropdown,
      dropdownMaxHeight,
      fileManager,
      fileToManage,
      filesTabs,
      filesTable,
      filesToDelete,
      filesToUpload,
      foldersToUpload,
      folderToManage,
      importFromOtherProjectsActions,
      loadingFileIds,
      menuItems,
      searchText,
      selectedFileTab,
      selection,
      shouldSubscribe,
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
      hasAdminPerm,
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
      isMidXL,
      isXXXL,
    };
  },
};
</script>

<style scoped lang="scss" src="./FilesManager.scss"></style>
