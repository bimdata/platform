<template>
  <div class="file-tree-preview-modal">
    <span class="file-tree-preview-modal__title">
      {{ $t("FileTreePreview.title") }}
      <span class="file-tree-preview-modal__title__project">
        {{ projectToUpload.name }}</span
      ></span
    >
    <div class="file-tree-preview-modal__content">
      <template v-for="folder of projectToUpload.folders" :key="folder.id">
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
        @click="projectToUpload.upload"
      >
        {{ $t("FileTreePreview.validate") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import FileTree from "@/components/specific/files/file-tree/FileTree.vue";
import { useAppModal } from "@/components/specific/app/app-modal/app-modal.js";

export default {
  components: {
    FileTree
  },
  props: {
    projectToUpload: {
      type: Object,
      required: true
    }
  },
  setup() {
    return { closeModal: useAppModal().closeModal };
  }
};
</script>

<style scoped lang="scss" src="./FileTreePreviewModal.scss"></style>
