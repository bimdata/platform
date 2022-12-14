<template>
  <BIMDataCard
    ref="fileManager"
    class="files-manager"
    :titleHeader="$t('FilesManager.title')"
  >
    <template #content>
      <AppModal v-if="projectsToUpload">
        <FileTreePreviewModal
          :projectsToUpload="projectsToUpload"
          :loadingData="loadingData"
        />
      </AppModal>
      <template v-if="fileStructure.children.length > 0">
        <div class="files-manager__actions start">
          <template v-if="menuItems.length > 0">
            <BIMDataDropdownMenu
              ref="dropdown"
              class="files-manager__actions__dropdown"
              v-click-away="close"
              width="20%"
              height="32px"
              :menuItems="menuItems"
              :subListMaxHeight="dropdownMaxHeight"
              @click="toggleTree"
            >
              <template #header>
                <BIMDataIcon name="burgerMenu" fill color="primary" size="m" />
                <BIMDataIcon
                  :name="isOpen ? 'deploy' : 'chevron'"
                  size="xxs"
                  fill
                  color="primary"
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
            :disabled="!hasAdminPerm(project, currentFolder)"
          >
            <BIMDataIcon name="addFolder" size="xs" />
            <span
              v-if="
                (project.isAdmin && !isXXXL) || (!project.isAdmin && !isMidXL)
              "
              style="margin-left: 6px"
            >
              {{ $t("FolderCreationButton.buttonText") }}
            </span>
            <span
              v-else-if="
                (project.isAdmin && !isXL && isXXXL) ||
                (!project.isAdmin && !isMD && isMidXL)
              "
              style="margin-left: 6px"
            >
              {{ $t("FolderCreationButton.shortButtonText") }}
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
                `SubscriptionModal.uploadDisableMessage.${
                  isFullTotal(spaceSubInfo) ? 'size' : 'permission'
                }`
              )
            "
          >
            <template v-if="isAbleToSub">
              <BIMDataButton
                width="100%"
                height="32px"
                color="primary"
                fill
                radius
                @click="
                  {
                    openModal();
                    $emit('switch-sub-modal', true);
                  }
                "
              >
                <BIMDataIcon name="addFile" size="xs" />
                <span
                  v-if="
                    (project.isAdmin && !isXXXL) ||
                    (!project.isAdmin && !isMidXL)
                  "
                  style="margin-left: 6px"
                >
                  {{ $t("FileUploadButton.addFileButtonText") }}
                </span>
                <span
                  v-else-if="
                    (project.isAdmin && !isXL && isXXXL) ||
                    (!project.isAdmin && !isMD && isMidXL)
                  "
                  style="margin-left: 6px"
                >
                  {{ $t("FileUploadButton.shortAddFileButtonText") }}
                </span>
              </BIMDataButton>
            </template>
            <template v-else>
              <BIMDataButton
                :disabled="
                  !currentSpace.isUserOrga && isFullTotal(spaceSubInfo)
                "
                fill
                radius
                icon
                color="primary"
                width="100%"
                @click="
                  fileUploadInput('file', event => uploadFiles(event), {
                    multiple: true
                  })
                "
              >
                <BIMDataIcon name="addFile" size="xs" />
                <span
                  v-if="
                    (project.isAdmin && !isXXXL) ||
                    (!project.isAdmin && !isMidXL)
                  "
                  style="margin-left: 6px"
                >
                  {{ $t("FileUploadButton.addFileButtonText") }}
                </span>
                <span
                  v-else-if="
                    (project.isAdmin && !isXL && isXXXL) ||
                    (!project.isAdmin && !isMD && isMidXL)
                  "
                  style="margin-left: 6px"
                >
                  {{ $t("FileUploadButton.shortAddFileButtonText") }}
                </span>
              </BIMDataButton>
            </template>
          </BIMDataTooltip>
        </div>
        <div class="files-manager__actions end">
          <BIMDataSearch
            class="files-manager__actions__input-search"
            :width="isMD ? '200px' : isLG ? '300px' : '400px'"
            :placeholder="$t('FilesManager.searchInputPlaceholder')"
            v-model="searchText"
            clear
          />
          <BIMDataTooltip
            class="files-manager__actions__visa-tooltip"
            position="left"
            color="high"
            :disabled="visasCounter !== 0"
            :text="$t('Visa.noVisa')"
          >
            <BIMDataButton
              :disabled="!visasCounter"
              class="files-manager__actions__visa"
              color="primary"
              fill
              radius
              @click="openVisaManager"
            >
              <span class="files-manager__actions__visa__content">
                <template v-if="visasCounter > 0">
                  <div class="files-manager__actions__visa__content__counter">
                    <span>{{ visasCounter }}</span>
                  </div>
                </template>
                {{ $t("Visa.button") }}
              </span>
            </BIMDataButton>
          </BIMDataTooltip>
        </div>
        <FileTree
          data-guide="file-tree"
          class="files-manager__tree"
          :project="project"
          :fileStructure="fileStructure"
          :selectedFile="currentFolder"
          @file-selected="onFileSelected"
        />

        <div class="files-manager__files">
          <transition name="fade">
            <FilesActionBar
              class="files-manager__files__action-bar"
              v-show="selection.length > 0"
              :project="project"
              :fileStructure="fileStructure"
              :files="selection"
              :initialFolder="currentFolder"
              @delete="openDeleteModal"
              @download="downloadFiles"
              @move="moveFiles"
            />
          </transition>
          <FilesTable
            data-test-id="files-table"
            class="files-manager__files__table"
            :project="project"
            :folder="currentFolder"
            :files="displayedFiles"
            :filesToUpload="filesToUpload"
            @back-parent-folder="backToParent"
            @create-model="createModelFromFile"
            @delete="openDeleteModal([$event])"
            @download="downloadFiles([$event])"
            @file-clicked="onFileSelected"
            @file-uploaded="$emit('file-uploaded')"
            @manage-access="openAccessManager($event)"
            @remove-model="removeModel"
            @selection-changed="setSelection"
            @open-visa-manager="openVisaManager"
            @open-tag-manager="openTagManager"
            @open-versioning-manager="openVersioningManager"
            @dragover.prevent="() => {}"
            @drop.prevent="event => uploadFiles(event)"
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
            <VisaMain
              v-if="showVisaManager"
              :project="project"
              :document="fileToManage"
              :toValidateVisas="toValidateVisas"
              :createdVisas="createdVisas"
              :visasLoading="visasLoading"
              @fetch-visas="fetchVisas"
              @close="closeVisaManager"
              @reach-file="backToParent"
            />
            <TagsMain
              v-if="showTagManager"
              :project="project"
              :document="fileToManage"
              :allTags="allTags"
              @close="closeTagManager"
              @fetch-tags="fetchTags"
              @file-updated="$emit('file-updated')"
            />
            <VersioningMain
              v-if="showVersioningManager"
              :project="project"
              :document="fileToManage"
              :currentFolder="currentFolder"
              :spaceSubInfo="spaceSubInfo"
              @file-uploaded="$emit('file-uploaded')"
              @close="closeVersioningManager"
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
          :projectsTree="projectsTree"
          @file-uploaded="$emit('file-uploaded')"
        />
      </template>
    </template>
  </BIMDataCard>
</template>

<script>
import { computed, onMounted, ref, watch, inject } from "vue";
import async from "async";
import { useI18n } from "vue-i18n";
import { useListFilter } from "../../../../composables/list-filter.js";
import {
  useStandardBreakpoints,
  useCustomBreakpoints
} from "../../../../composables/responsive.js";
import { useAppModal } from "../../app/app-modal/app-modal.js";
import { useAppNotification } from "../../app/app-notification/app-notification.js";
import { useToggle } from "../../../../composables/toggle.js";
import { VISA_STATUS } from "../../../../config/visa.js";
import FileService from "../../../../services/FileService.js";
import TagService from "../../../../services/TagService";
import { useFiles } from "../../../../state/files.js";
import { useModels } from "../../../../state/models.js";
import { useProjects } from "../../../../state/projects.js";
import { useSpaces } from "../../../../state/spaces.js";
import { useVisa } from "../../../../state/visa.js";
import { hasAdminPerm, isFolder } from "../../../../utils/file-structure.js";
import { treeIdGenerator, getFileFormat } from "../../../../utils/files.js";
import { isFullTotal } from "../../../../utils/spaces.js";
import { fileUploadInput } from "../../../../utils/upload.js";

// Components
import AppModal from "../../app/app-modal/AppModal.vue";
import FilesActionBar from "./files-action-bar/FilesActionBar.vue";
import FilesDeleteModal from "./files-delete-modal/FilesDeleteModal.vue";
import FilesManagerOnboarding from "./files-manager-onboarding/FilesManagerOnboarding.vue";
import FilesTable from "../files-table/FilesTable.vue";
import FileTree from "../file-tree/FileTree.vue";
import FileTreePreviewModal from "../file-tree-preview-modal/FileTreePreviewModal.vue";
import FolderAccessManager from "../folder-access-manager/FolderAccessManager.vue";
import FolderCreationButton from "../folder-creation-button/FolderCreationButton.vue";
import TagsMain from "../../tags/tags-main/TagsMain.vue";
import VersioningMain from "../../versioning/versioning-main/VersioningMain.vue";
import VisaMain from "../../visa/visa-main/VisaMain.vue";

export default {
  components: {
    AppModal,
    FilesActionBar,
    FilesDeleteModal,
    FilesManagerOnboarding,
    FilesTable,
    FileTree,
    FileTreePreviewModal,
    FolderAccessManager,
    FolderCreationButton,
    TagsMain,
    VersioningMain,
    VisaMain
  },
  props: {
    spaceSubInfo: {
      type: Object,
      required: true
    },
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
    },
    loadingData: {
      type: Boolean,
      required: true
    }
  },
  emits: [
    "file-uploaded",
    "file-updated",
    "folder-permission-updated",
    "group-permission-updated",
    "model-created",
    "switch-sub-modal"
  ],
  setup(props, { emit }) {
    const { t } = useI18n();
    const { pushNotification } = useAppNotification();
    const { currentSpace } = useSpaces();
    const { openModal, closeModal } = useAppModal();
    const { isOpen, toggle, close } = useToggle();

    const { fetchProjectFolderTreeSerializers } = useProjects();

    const { isXXXL, isMidXL } = useCustomBreakpoints({
      isXXXL: ({ width }) => width <= 1521 - 0.02,
      isMidXL: ({ width }) => width <= 1277 - 0.02
    });

    const {
      fileStructureHandler: handler,
      moveFiles: move,
      downloadFiles: download,
      projectFileStructure
    } = useFiles();
    const { createModel, deleteModels } = useModels();

    const { fetchToValidateVisas, fetchCreatedVisas } = useVisa();

    const currentFolder = ref(null);
    const currentFiles = ref([]);
    const toValidateVisas = ref([]);
    const createdVisas = ref([]);
    const visasLoading = ref(false);
    const allTags = ref([]);

    watch(
      () => props.fileStructure,
      struct => {
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
      folder => {
        const childrenFolders = folder.children
          .filter(child => isFolder(child))
          .sort((a, b) =>
            a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
          );
        const childrenFiles = folder.children
          .filter(child => !isFolder(child))
          .sort((a, b) =>
            a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
          );
        currentFiles.value = childrenFolders.concat(childrenFiles);
      },
      { immediate: true }
    );

    const onFileSelected = file => {
      if (isFolder(file)) {
        currentFolder.value = handler.deserialize(file);
      }
    };

    const backToParent = file => {
      const parentFolder = handler.parent(file);
      currentFolder.value = handler.deserialize(parentFolder);
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

    const uploadFiles = async event => {
      if (event.dataTransfer) {
        // Files from drag & drop
        let docsUpload = [];
        await Promise.all(
          Array.from(event.dataTransfer.items).map(async file => {
            const fileEntry = file.webkitGetAsEntry();

            if (fileEntry.isDirectory) {
              filesToUpload.value = await FileService.createFolderStructure(
                props.project,
                currentFolder.value,
                fileEntry
              );
            } else {
              docsUpload.push(await getFileFormat(fileEntry));
            }
          })
        );
        filesToUpload.value = docsUpload;
      } else {
        // Files from input
        const fileList = Array.from(event.target.files);

        if (fileList[0].webkitRelativePath) {
          filesToUpload.value = await FileService.createFolderStructure(
            props.project,
            currentFolder.value,
            fileList
          );
        } else {
          filesToUpload.value = fileList;
        }
      }

      setTimeout(() => (filesToUpload.value = []), 100);
    };

    const createModelFromFile = async file => {
      const model = await createModel(props.project, file);
      emit("model-created", model);
      pushNotification({
        type: "success",
        title: t("Success"),
        message: t("FilesManager.createModelNotification")
      });
    };

    const removeModel = async file => {
      await deleteModels(props.project, [
        { id: file.model_id, type: file.model_type }
      ]);
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
    const showVersioningManager = ref(false);
    const showAccessManager = ref(false);
    const showVisaManager = ref(false);
    const showTagManager = ref(false);
    const folderToManage = ref(null);
    const fileToManage = ref(null);

    let stopCurrentFilesWatcher;
    const openAccessManager = folder => {
      folderToManage.value = folder;
      showAccessManager.value = true;
      showVersioningManager.value = false;
      showVisaManager.value = false;
      showTagManager.value = false;
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

    const openVisaManager = file => {
      if (file.file_name) {
        fileToManage.value = file;
      } else {
        fileToManage.value = { id: null };
      }
      showVisaManager.value = true;
      showVersioningManager.value = false;
      showAccessManager.value = false;
      showTagManager.value = false;
      showSidePanel.value = true;
    };

    const closeVisaManager = () => {
      showSidePanel.value = false;
      setTimeout(() => {
        showVisaManager.value = false;
        fileToManage.value = null;
      }, 100);
    };

    const openTagManager = file => {
      if (file.file_name) {
        fileToManage.value = file;
        showSidePanel.value = true;
        showTagManager.value = true;
      }
    };

    const closeTagManager = () => {
      showSidePanel.value = false;
      setTimeout(() => {
        showTagManager.value = false;
      }, 100);
    };

    const openVersioningManager = file => {
      if (file.file_name) {
        fileToManage.value = file;
        showVersioningManager.value = true;
        showAccessManager.value = false;
        showVisaManager.value = false;
        showSidePanel.value = true;
      }
    };

    const closeVersioningManager = () => {
      showSidePanel.value = false;
      setTimeout(() => {
        showVersioningManager.value = false;
        fileToManage.value = null;
      }, 100);
    };

    const fetchVisas = async () => {
      try {
        visasLoading.value = true;

        const [toValidateResponse, createdResponse] = await Promise.all([
          fetchToValidateVisas(props.project),
          fetchCreatedVisas(props.project)
        ]);

        toValidateVisas.value = toValidateResponse;
        createdVisas.value = createdResponse;
      } finally {
        visasLoading.value = false;
      }
    };

    const visasCounter = computed(
      () =>
        toValidateVisas.value.filter(v => v.status !== VISA_STATUS.CLOSE)
          .length +
        createdVisas.value.filter(v => v.status !== VISA_STATUS.CLOSE).length
    );

    const fetchTags = async () => {
      allTags.value = await TagService.fetchAllTags(props.project);
    };

    const projectsTree = ref([]);
    const fetchProjectsTree = async () => {
      projectsTree.value = (
        await fetchProjectFolderTreeSerializers(props.project)
      ).map(p => ({
        name: p.name,
        action: () => {
          openModal();
          projectsToUpload.value = {
            ...p,
            folders: treeIdGenerator(p),
            upload: () => {
              FileService.createFileStructure(props.project, p.folders);
              emit("file-updated");
            }
          };
        }
      }));

      // projectsTree.value = spaceProjects.value
      //   .filter(({ isAdmin }) => isAdmin)
      //   .map(p => ({
      //     name: p.name,
      //     action: () => {
      //       openModal();
      //       projectsToUpload.value = {
      //         ...p,
      //         folders: treeIdGenerator(p),
      //         upload: () => {
      //           FileService.createFileStructure(props.project, p.folders);
      //           emit("file-updated");
      //         }
      //       };
      //     }
      //   }));
    };

    const toggleTree = async () => {
      projectsTree.value = (
        await fetchProjectFolderTreeSerializers(props.project)
      ).map(p => ({
        name: p.name,
        action: () => {
          openModal();
          projectsToUpload.value = {
            ...p,
            folders: treeIdGenerator(p),
            upload: () => {
              FileService.createFileStructure(props.project, p.folders);
              emit("file-updated");
            }
          };
        }
      }));
      toggle();
    };

    watch(
      () => props.loadingData,
      () => {
        if (!props.loadingData) {
          closeModal();
        }
      }
    );

    const projectsToUpload = ref(null);
    const menuItems = computed(() => {
      const items = [];

      if (props.project.isAdmin) {
        items.push(
          {
            name: t("FilesManager.structureImport"),
            children: { list: projectsTree.value }
          },
          {
            name: t("FilesManager.gedDownload"),
            action: () => downloadFiles([projectFileStructure.value])
          }
        );
      }

      if (!props.project.isGuest) {
        items.splice(1, 0, {
          name: t("FilesManager.folderImport"),
          action: () => {
            fileUploadInput("folder", event => uploadFiles(event));
          }
        });
      }

      return items;
    });

    onMounted(() => {
      fetchVisas();
      fetchTags();
      // fetchProjectsTree();
    });

    const fileManager = ref(null);
    const dropdown = ref(null);
    const dropdownMaxHeight = computed(() => {
      if (!fileManager.value || !dropdown.value) return;
      const { y, height: H } = dropdown.value.$el.getBoundingClientRect();
      return `${
        fileManager.value?.$el?.getBoundingClientRect().height - H - y
      }px`;
    });

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
      showVisaManager,
      showDeleteModal,
      showSidePanel,
      fileToManage,
      toValidateVisas,
      createdVisas,
      visasLoading,
      visasCounter,
      showTagManager,
      allTags,
      showVersioningManager,
      isAbleToSub: inject("isAbleToSub"),
      currentSpace,
      projectsTree,
      projectsToUpload,
      dropdownMaxHeight,
      fileManager,
      dropdown,
      isOpen,
      menuItems,
      // Methods
      // toggle,
      toggleTree,
      close,
      closeAccessManager,
      closeDeleteModal,
      createModelFromFile,
      removeModel,
      downloadFiles,
      moveFiles,
      openAccessManager,
      onFileSelected,
      openDeleteModal,
      setSelection,
      uploadFiles,
      backToParent,
      closeVisaManager,
      openVisaManager,
      fetchVisas,
      openTagManager,
      closeTagManager,
      fetchTags,
      openVersioningManager,
      closeVersioningManager,
      hasAdminPerm,
      isFullTotal,
      openModal,
      fileUploadInput,
      // Responsive breakpoints
      ...useStandardBreakpoints(),
      isMidXL,
      isXXXL
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesManager.scss"></style>
