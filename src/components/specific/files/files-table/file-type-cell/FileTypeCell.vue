<template>
  <div class="file-type-cell">
    <template v-if="isFolder(file)">
      {{ $t("FilesTable.folder") }}
    </template>
    <template v-else>
      {{ fileExtension(file.file_name).slice(0, 8) || "?" }}
    </template>
  </div>
</template>

<script>
import { isFolder } from "../../../../../utils/file-structure.js";
import { fileExtension } from "../../../../../utils/files.js";

export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {
      fileExtension,
      isFolder
    };
  }
};
</script>
