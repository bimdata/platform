<template>
  <div class="file-name-cell">
    <BIMDataIcon v-if="file.type === 'Folder'" name="folder" size="s" />
    <FileIcon v-else-if="file.type === 'Ifc'" name="ifc" size="20" />
    <FileIcon v-else :name="fileExtension(file.name)" size="20" />
    <span>{{ file.name }}</span>
  </div>
</template>

<script>
import { fileExtension } from "@/utils/files";
// Components
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import FileIcon from "@/components/generic/file-icon/FileIcon";

export default {
  components: {
    BIMDataIcon,
    FileIcon
  },
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

<style scoped lang="scss" src="./FileNameCell.scss"></style>
