<template>
  <div class="file-type-cell">
    <BIMDataIcon
      v-if="isFolder(file)"
      :name="!project.isAdmin && file.user_permission < 100 ? 'readonlyFolder' : 'folder'"
      size="m"
      fill
      color="primary"
    />
    <BIMDataFileIcon v-else :fileName="file.file_name" :size="20" />
    <div v-if="isFolder(file)">
      <span v-if="file.children.length === 0" class="file-type-cell__folder-icon empty">0</span>
      <span v-else class="file-type-cell__folder-icon not-empty">{{file.children.length}}</span>
    </div>
  </div>
</template>

<script>
import { isFolder } from "../../../../../utils/file-structure.js";

export default {
  props: {
    file: {
      type: Object,
      required: true,
    },
    project: {
      type: Object,
      required: true
    },
  },
  setup() {
    return {
      isFolder,
    };
  },
};
</script>

<style lang="scss" src="./FileTypeCell.scss"></style>