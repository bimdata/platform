<template>
  <BIMDataCard class="files-manager" :titleHeader="$t('FilesManager.title')">
    <template #content>
      <template v-if="fileStructure.children.length > 0">
        <div class="files-manager__actions">
          <FolderCreationButton
            data-guide="btn-new-folder"
            :disabled="!project.isAdmin && currentFolder.userPermission < 100"
            class="files-manager__actions__btn-new-folder"
            width="194px"
            :project="project"
            :folder="currentFolder"
          />
          <BIMDataTooltip
            data-guide="btn-upload-file"
            class="files-manager__actions__btn-new-file"
            color="high"
            :disabled="
              (project.isAdmin || currentFolder.userPermission === 100) &&
              spaceSubInfo.remainingTotalSize > 0
            "
            :text="
              $t(
                `FilesManager.uploadDisableMessage.${
                  spaceSubInfo.remainingTotalSize <= 0 ? 'size' : 'permission'
                }`
              )
            "
          >
            <FileUploadButton
              :disabled="
                (!project.isAdmin && currentFolder.userPermission < 100) ||
                spaceSubInfo.remainingTotalSize <= 0
              "
              width="194px"
              multiple
              @upload="uploadFiles"
            />
          </BIMDataTooltip>
          <BIMDataSearch
            class="files-manager__actions__input-search"
            width="400px"
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
            @selection-changed="setSelection"
            @open-visa-manager="openVisaManager"
            @open-versioning-manager="openVersioningManager"
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
            <VersioningMain
              v-if="showVersioningManager"
              :project="project"
              :headDocument="fileToManage"
              :currentFolder="currentFolder"
              :spaceSubInfo="spaceSubInfo"
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
          @file-uploaded="$emit('file-uploaded')"
        />
      </template>
    </template>
  </BIMDataCard>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useListFilter } from "@/composables/list-filter.js";
import { useAppNotification } from "@/components/specific/app/app-notification/app-notification.js";
import { useFiles } from "@/state/files.js";
import { useModels } from "@/state/models.js";
import { useVisa } from "@/state/visa.js";
import { isFolder } from "@/utils/file-structure.js";
import { VISA_STATUS } from "@/config/visa.js";
// Components
import FileTree from "@/components/specific/files/file-tree/FileTree.vue";
import FileUploadButton from "@/components/specific/files/file-upload-button/FileUploadButton.vue";
import FilesTable from "@/components/specific/files/files-table/FilesTable.vue";
import FolderAccessManager from "@/components/specific/files/folder-access-manager/FolderAccessManager.vue";
import FolderCreationButton from "@/components/specific/files/folder-creation-button/FolderCreationButton.vue";
import VisaMain from "@/components/specific/visa/visa-main/VisaMain.vue";
import FilesActionBar from "./files-action-bar/FilesActionBar.vue";
import FilesDeleteModal from "./files-delete-modal/FilesDeleteModal.vue";
import FilesManagerOnboarding from "./files-manager-onboarding/FilesManagerOnboarding.vue";
import VersioningMain from "@/components/specific/versioning/versioning-main/VersioningMain.vue";

export default {
  components: {
    FileTree,
    FileUploadButton,
    FilesTable,
    FolderAccessManager,
    FolderCreationButton,
    FilesActionBar,
    FilesDeleteModal,
    FilesManagerOnboarding,
    VisaMain,
    VersioningMain
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
    }
  },
  emits: [
    "file-uploaded",
    "folder-permission-updated",
    "group-permission-updated",
    "model-created"
  ],
  setup(props, { emit }) {
    const { t } = useI18n();
    const { pushNotification } = useAppNotification();

    const {
      fileStructureHandler: handler,
      moveFiles: move,
      downloadFiles: download
    } = useFiles();
    const { createModel } = useModels();

    const { fetchToValidateVisas, fetchCreatedVisas } = useVisa();

    const currentFolder = ref(null);
    const currentFiles = ref([]);
    const toValidateVisas = ref([]);
    const createdVisas = ref([]);
    const visasLoading = ref(false);

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
    const uploadFiles = files => {
      filesToUpload.value = files;
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
    const folderToManage = ref(null);
    const fileToManage = ref(null);

    let stopCurrentFilesWatcher;
    const openAccessManager = folder => {
      folderToManage.value = folder;
      showAccessManager.value = true;
      showVersioningManager.value = false;
      showVisaManager.value = false;
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

    const openVisaManager = event => {
      if (event.fileName) {
        fileToManage.value = event;
      } else {
        fileToManage.value = { id: null };
      }
      showVisaManager.value = true;
      showVersioningManager.value = false;
      showAccessManager.value = false;
      showSidePanel.value = true;
    };

    const closeVisaManager = () => {
      showSidePanel.value = false;
      setTimeout(() => {
        showVisaManager.value = false;
        fileToManage.value = null;
      }, 100);
    };

    const openVersioningManager = event => {
      if (event.fileName) {
        fileToManage.value = event;
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

    onMounted(() => fetchVisas());

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
      showVersioningManager,
      // Methods
      closeAccessManager,
      closeDeleteModal,
      createModelFromFile,
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
      openVersioningManager,
      closeVersioningManager,
      fetchVisas
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesManager.scss"></style>
