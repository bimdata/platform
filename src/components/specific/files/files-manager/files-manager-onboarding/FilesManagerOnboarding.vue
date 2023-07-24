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
            fileUploadInput('file', uploadFiles, {
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
        <template v-if="gedMenu.length > 0">
          <template v-if="!isGedMenuOpen">
            <BIMDataButton
              color="primary"
              outline
              radius
              icon
              @click="openGedMenu"
            >
              <BIMDataIconPlus size="s" />
            </BIMDataButton>
          </template>
          <template v-if="isGedMenuOpen">
            <BIMDataDropdownMenu
              class="files-manager-onboarding__actions__advanced__dropdown"
              v-click-away="closeGedMenu"
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
        v-show="
          showFolderForm ||
          filesToUpload.length > 0 ||
          foldersToUpload.length > 0
        "
        class="files-manager-onboarding__overlay"
      >
        <div class="files-manager-onboarding__overlay__uploads">
          <FileUploadCard
            v-for="(file, i) of filesToUpload"
            :key="'file-' + i"
            condensed
            :project="project"
            :folder="rootFolder"
            :file="file"
            @upload-completed="updateUploadCount"
            @upload-canceled="updateUploadCount"
            @upload-failed="updateUploadCount"
          />
          <FolderUploadCard
            v-for="(folder, i) of foldersToUpload"
            :key="'folder' + i"
            condensed
            :project="project"
            :folder="folder"
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
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToggle } from "../../../../../composables/toggle.js";
import FileService from "../../../../../services/FileService.js";
import { getFilesFromEvent } from "../../../../../utils/files.js";
import { fileUploadInput } from "../../../../../utils/upload.js";

// Components
import FilesManagerOnboardingImage from "./FilesManagerOnboardingImage.vue";
import FileUploadCard from "../../file-upload-card/FileUploadCard.js";
import FolderUploadCard from "../../file-upload-card/FolderUploadCard.js";
import FolderCreationForm from "../../folder-creation-form/FolderCreationForm.vue";
import FileDragAndDropModal from "../file-drag-and-drop-modal/FileDragAndDropModal.vue";
import { useAppModal } from "../../../app/app-modal/app-modal.js";

export default {
  components: {
    FilesManagerOnboardingImage,
    FileUploadCard,
    FolderCreationForm,
    FolderUploadCard
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

    const { openModal } = useAppModal();

    const {
      isOpen: isGedMenuOpen,
      open: openGedMenu,
      close: closeGedMenu
    } = useToggle();

    let uploadCount = 0;
    const filesToUpload = ref([]);
    const foldersToUpload = ref([]);
    const uploadFiles = async event => {
      uploadCount = 0;

      const { files, folders } = await getFilesFromEvent(event);

      filesToUpload.value = files;
      foldersToUpload.value = await Promise.all(
        folders.map(f =>
          FileService.createFolderStructure(props.project, props.rootFolder, f)
        )
      );
    };

    const updateUploadCount = () => {
      uploadCount++;
      if (
        uploadCount ===
        filesToUpload.value.length + foldersToUpload.value.length
      ) {
        uploadCount = 0;
        filesToUpload.value = [];
        foldersToUpload.value = [];
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
      const items = [];

      if (props.project.isAdmin) {
        items.push({
          name: t("FilesManagerOnboarding.GEDStructureImport"),
          children: {
            position: "up",
            list: props.projectsTree
          }
        });
      }

      if (!props.project.isGuest) {
        items.push({
          name: t("FilesManagerOnboarding.folderImport"),
          action: () => {
            openModal({
              component: FileDragAndDropModal,
              props: {
                onDrop: event => uploadFiles(event)
              }
            });
            dropdown.value.displayed = false;
          }
        });
      }

      return items;
    });

    return {
      // References
      filesToUpload,
      foldersToUpload,
      showFolderForm,
      dropdownMaxHeight,
      onboarding,
      dropdown,
      gedMenu,
      isGedMenuOpen,
      // Methods
      openGedMenu,
      closeGedMenu,
      createFolder,
      updateUploadCount,
      uploadFiles,
      fileUploadInput
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesManagerOnboarding.scss"></style>
