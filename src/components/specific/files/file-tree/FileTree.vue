<template>
  <div class="file-tree">
    <FileTreeNode :file="fileStructure" />
  </div>
</template>

<script>
import { provide, ref, watch } from "vue";
import { getDescendants } from "@/utils/file-structure";
// Components
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
      struct => {
        const files = getDescendants(struct);
        if (files.every(file => file.id !== selectedFileID.value)) {
          selectedFileID.value = struct.id;
        }
      },
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
