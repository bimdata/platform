<template>
  <div class="file-tree-preview-modal" v-click-away="closeModal">
    <template v-if="loadingData">
      <div class="file-tree-preview-modal__loader">
        <BIMDataSpinner />
      </div>
    </template>
    <span class="file-tree-preview-modal__title">
      {{ $t("FileTreePreview.title") }}
      <span class="file-tree-preview-modal__title__project">
        {{ projectsToUpload.name }}</span
      ></span
    >
    <div class="file-tree-preview-modal__content">
      <template v-for="folder of projectsToUpload.folders" :key="folder.id">
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
        {{ $t("FileTreePreview.cancel") }}
      </BIMDataButton>
      <BIMDataButton
        color="primary"
        fill
        radius
        width="45%"
        @click="projectsToUpload.upload"
      >
        {{ $t("FileTreePreview.validate") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { useAppModal } from "../../app/app-modal/app-modal.js";
// Components
import FileTree from "../file-tree/FileTree.vue";

export default {
  components: {
    FileTree
  },
  props: {
    projectsToUpload: {
      type: Object,
      required: true
    },
    loadingData: {
      type: Boolean,
      required: true
    }
  },
  setup() {
    return { closeModal: useAppModal().closeModal };
  }
};
</script>

<style scoped lang="scss" src="./FileTreePreviewModal.scss"></style>
