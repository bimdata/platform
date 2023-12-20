<template>
  <div class="file-tree-preview-modal" v-click-away="closeModal">
    <template v-if="loadingData">
      <div class="file-tree-preview-modal__loader">
        <BIMDataSpinner />
      </div>
    </template>
    <span class="file-tree-preview-modal__title">
      {{ $t("FileTreePreviewModal.title") }}
      <span class="file-tree-preview-modal__title__project">
        {{ currentProject.name }}
      </span>
    </span>
    <div class="file-tree-preview-modal__content">
      <template v-for="folder of folders" :key="folder.id">
        <FileTree
          :fileStructure="folder"
          :selectedFile="folder"
          :project="{}"
        />
      </template>
    </div>
    <div class="file-tree-preview-modal__action">
      <BIMDataButton
        color="high"
        outline
        radius
        width="45%"
        @click="closeModal"
      >
        {{ $t("t.cancel") }}
      </BIMDataButton>
      <BIMDataButton
        color="primary"
        fill
        radius
        width="45%"
        @click="onValidate"
      >
        {{ $t("t.validate") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useAppModal } from "../../app/app-modal/app-modal.js";
import FileService from "../../../../services/FileService.js";
import ProjectService from "../../../../services/ProjectService.js";

// Components
import FileTree from "../file-tree/FileTree.vue";
import { setFolderType } from "../../../../utils/files.js";

export default {
  components: {
    FileTree
  },
  props: {
    currentProject: {
      type: Object,
      required: true
    },
    sourceProject: {
      type: Object,
      required: true
    },
    onSuccess: {
      type: Function,
      required: true
    },
  },
  setup(props) {
    const folders = ref([]);
    const loadingData = ref(true);

    onMounted(async () => {
      const folderResponse = await ProjectService.getProjectFolderTree(props.sourceProject);
      setFolderType(folderResponse)
      folders.value = folderResponse;
      loadingData.value = false;
    });

    const onValidate = async () => {
      loadingData.value = true;
      await FileService.createFileStructure(props.currentProject, folders.value);
      loadingData.value = false;
      props.onSuccess();
      useAppModal().closeModal();
    };

    return { 
      closeModal: useAppModal().closeModal,
      loadingData,
      folders,
      onValidate,
    };
  }
};
</script>

<style scoped lang="scss" src="./FileTreePreviewModal.scss"></style>
