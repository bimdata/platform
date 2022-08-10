<template>
  <div ref="onboarding" class="files-manager-onboarding">
    <AppModal v-if="projectToUpload">
      <FileTreePreviewModal :projectToUpload="projectToUpload" />
    </AppModal>
    <FilesManagerOnboardingImage />
    <div>
      {{ $t("FilesManagerOnboarding.text") }}
    </div>
    <div class="files-manager-onboarding__actions">
      <FileUploadButton width="120px" multiple @upload="uploadFile">
        {{ $t("FilesManagerOnboarding.uploadFileButtonText") }}
      </FileUploadButton>
      <BIMDataButton
        width="120px"
        color="primary"
        fill
        radius
        @click="createFolder"
      >
        {{ $t("FilesManagerOnboarding.createFolderButtonText") }}
      </BIMDataButton>
      <BIMDataDropdownMenu
        class="files-manager-onboarding__actions__dropdown"
        ref="dropdown"
        width="20%"
        height="32px"
        directionClass="up"
      >
        <template #header>
          <span> {{ $t("FilesManagerOnboarding.GEDStructureImport") }}</span>
          <BIMDataIcon
            name="deploy"
            fill
            size="xxs"
            color="primary"
            :rotate="180"
          />
        </template>
        <template #element>
          <ul
            class="bimdata-list"
            :style="{ maxHeight: dropdownMaxHeight + 'px' }"
          >
            <li
              v-for="project in userProjects"
              :key="project.name"
              @click="project.action"
            >
              <BIMDataTextbox :text="project.name" />
            </li>
          </ul>
        </template>
      </BIMDataDropdownMenu>
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
import { ref, onMounted, computed } from "vue";
import { useProjects } from "@/state/projects.js";
import { useAppModal } from "@/components/specific/app/app-modal/app-modal.js";
import { treeIdGenerator } from "@/utils/projects.js";
import FileService from "@/services/FileService.js";

// Components
import FileUploadButton from "@/components/specific/files/file-upload-button/FileUploadButton";
import FileUploadCard from "@/components/specific/files/file-upload-card/FileUploadCard";
import FolderCreationForm from "@/components/specific/files/folder-creation-form/FolderCreationForm";
import FilesManagerOnboardingImage from "./FilesManagerOnboardingImage.vue";
import FileTreePreviewModal from "@/components/specific/files/file-tree-preview-modal/FileTreePreviewModal.vue";
import AppModal from "@/components/specific/app/app-modal/AppModal.vue";

export default {
  components: {
    FilesManagerOnboardingImage,
    FileUploadButton,
    FileUploadCard,
    FolderCreationForm,
    FileTreePreviewModal,
    AppModal
  },
  props: {
    project: {
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
    const { fetchProjectFolderTreeSerializers } = useProjects();
    const { openModal, closeModal } = useAppModal();

    let uploadCount = 0;
    const fileUploads = ref([]);
    const uploadFile = files => {
      uploadCount = 0;
      fileUploads.value = files;
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

    const projectsTree = ref([]);
    const projectToUpload = ref(null);

    const fetchProjectsTree = async () => {
      projectsTree.value = await fetchProjectFolderTreeSerializers(
        props.project
      );
    };

    const userProjects = computed(() =>
      projectsTree.value.map(p => ({
        name: p.name,
        action: () => {
          openModal();
          projectToUpload.value = {
            ...p,
            folders: treeIdGenerator(p.folders),
            upload: () => {
              closeModal();
              FileService.createFileStructure(props.project, p.folders);
              emit("file-uploaded");
            }
          };
        }
      }))
    );

    onMounted(() => {
      fetchProjectsTree();
    });

    const onboarding = ref(null);
    const dropdown = ref(null);
    const dropdownMaxHeight = computed(
      () =>
        dropdown.value?.$el?.getBoundingClientRect().y -
        onboarding.value?.getBoundingClientRect().y
    );

    return {
      // References
      fileUploads,
      showFolderForm,
      userProjects,
      projectToUpload,
      dropdownMaxHeight,
      onboarding,
      dropdown,
      // Methods
      createFolder,
      updateUploadCount,
      uploadFile
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesManagerOnboarding.scss"></style>
