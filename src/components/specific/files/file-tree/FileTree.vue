<template>
  <div class="file-tree">
    <FileTreeNode v-if="fileStructure" :file="fileStructure" />
  </div>
</template>

<script>
import { provide } from "@vue/runtime-core";
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
    provide("selectFile", file => {
      emit("file-selected", file);
    });
  }
};
</script>

<style scoped lang="scss" src="./FileTree.scss"></style>
