<template>
  <div class="file-tree">
    <FileTreeNode :file="fileStructure" />
  </div>
</template>

<script>
import { provide, ref } from "@vue/runtime-core";
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
    }
  },
  emits: ["file-selected"],
  setup(props, { emit }) {
    const selectedFileID = ref(props.fileStructure.id);

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
