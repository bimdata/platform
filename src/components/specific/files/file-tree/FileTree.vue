<template>
  <div class="file-tree">
    <FileTreeNode :file="fileStructure" />
  </div>
</template>

<script>
import { provide, ref, watch } from "vue";
import FileTreeNode from "./file-tree-node/FileTreeNode";

export default {
  components: {
    FileTreeNode
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    fileStructure: {
      type: Object,
      required: true
    },
    selectedFile: {
      type: Object
    }
  },
  emits: ["file-selected"],
  setup(props, { emit }) {
    const selectedFileID = ref(null);

    watch(
      () => props.fileStructure,
      () => (selectedFileID.value = props.fileStructure.id),
      { immediate: true }
    );
    watch(
      () => props.selectedFile,
      () => {
        if (props.selectedFile) {
          selectedFileID.value = props.selectedFile.id;
        }
      }
    );

    const selectFile = file => {
      selectedFileID.value = file.id;
      emit("file-selected", file);
    };

    provide("selectedFileID", selectedFileID);
    provide("selectFile", selectFile);
  }
};
</script>

<style scoped lang="scss" src="./FileTree.scss"></style>
