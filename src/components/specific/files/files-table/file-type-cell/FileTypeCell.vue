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
