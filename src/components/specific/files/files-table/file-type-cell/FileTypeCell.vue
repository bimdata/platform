<template>
  <div class="file-type-cell">
    {{
      file.type === "Folder"
        ? $t("FilesTable.folder")
        : file.type === "Ifc"
        ? ".ifc"
        : fileExtension(file.name)
        ? "." + fileExtension(file.name)
        : "?"
    }}
  </div>
</template>

<script>
import { fileExtension } from "@/utils/files";

export default {
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {
      fileExtension
    };
  }
};
</script>
