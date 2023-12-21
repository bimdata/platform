<template>
  <div class="file-tree-preview-modal" v-click-away="closeModal">
    <template v-if="loadingData">
      <div class="file-tree-preview-modal__loader">
        <BIMDataSpinner style="transform: scale(2)" />
      </div>
    </template>
    <BIMDataButton
      class="file-tree-preview-modal__btn-close"
      ghost
      rounded
      icon
      @click="closeModal"
    >
      <BIMDataIconClose size="xxs" />
    </BIMDataButton>
    <span class="file-tree-preview-modal__title">
      {{ $t("FileTreePreviewModal.title") }}
      <span class="file-tree-preview-modal__title__project">
        {{ sourceProject.name }}
      </span>
    </span>
    <div v-if="folders[0].children.length > 0" class="file-tree-preview-modal__content" >
      <template v-for="folder of folders" :key="folder.id">
        <FileTree
          :fileStructure="folder"
          :selectedFile="folder"
          :project="{}"
        />
      </template>
    </div>
    <div v-else class="file-tree-preview-modal__empty_content">
      <img src="/static/dms/empty-dms-import.svg" />
      <span>
        {{ $t("FileTreePreviewModal.emptySource") }}
      </span>
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
        :disabled="folders[0].children.length === 0"
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
    }
  },
  setup(props) {
    const folders = ref([]);
    const loadingData = ref(true);

    onMounted(async () => {
      const folderResponse = [{
        name: props.sourceProject.name,
        children: await ProjectService.getProjectFolderTree(
          props.sourceProject
        ),
      }];
      setFolderType(folderResponse);
      folders.value = folderResponse;
      loadingData.value = false;
    });

    const onValidate = async () => {
      loadingData.value = true;
      await FileService.createFileStructure(
        props.currentProject,
        folders.value[0].children // We don't want to import the project root folder
      );
      loadingData.value = false;
      props.onSuccess();
      useAppModal().closeModal();
    };

    return {
      folders,
      loadingData,
      closeModal: useAppModal().closeModal,
      onValidate
    };
  }
};
</script>

<style scoped lang="scss" src="./FileTreePreviewModal.scss"></style>
