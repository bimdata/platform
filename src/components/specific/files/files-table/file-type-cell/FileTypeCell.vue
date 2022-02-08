<template>
  <div class="file-type-cell">
    {{
      isFolder(file)
        ? $t("FilesTable.folder")
        : fileExtension(file.fileName) || "?"
    }}
  </div>
</template>

<script>
import { isFolder } from "@/utils/file-structure.js";
import { fileExtension } from "@/utils/files.js";

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
