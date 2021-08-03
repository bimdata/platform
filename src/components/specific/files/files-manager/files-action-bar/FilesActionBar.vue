<template>
  <div class="files-action-bar">
    <BIMDataButton
      width="120px"
      color="high"
      ghost
      squared
      @click="$emit('delete', files)"
    >
      <BIMDataIcon name="delete" size="xs" margin="0 6px 0 0" />
      <span>{{ $t("FilesActionBar.deleteButtonText") }}</span>
    </BIMDataButton>
    <BIMDataButton
      width="120px"
      color="secondary"
      ghost
      squared
      @click="toggleFolderSelector"
    >
      <BIMDataIcon name="folderMove" size="s" margin="0 6px 0 0" />
      <span>{{ $t("FilesActionBar.moveButtonText") }}</span>
    </BIMDataButton>
    <BIMDataButton
      width="120px"
      ghost
      squared
      @click="$emit('download', files)"
    >
      <BIMDataIcon name="download" size="s" margin="0 6px 0 0" />
      <span>{{ $t("FilesActionBar.downloadButtonText") }}</span>
    </BIMDataButton>

    <transition name="fade">
      <FolderSelector
        v-show="showFolderSelector"
        class="files-action-bar__folder-selector"
        :fileStructure="fileStructure"
        :files="files"
        @folder-selected="$emit('move', { files, dest: $event })"
        @close="closeFolderSelector"
      />
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";
// Components
import FolderSelector from "@/components/specific/files/folder-selector/FolderSelector";

export default {
  components: {
    FolderSelector
  },
  props: {
    fileStructure: {
      type: Object,
      required: true
    },
    files: {
      type: Array,
      default: () => []
    }
  },
  emits: ["delete", "download", "move"],
  setup() {
    const showFolderSelector = ref(false);
    const closeFolderSelector = () => {
      showFolderSelector.value = false;
    };
    const toggleFolderSelector = () => {
      showFolderSelector.value = !showFolderSelector.value;
    };

    return {
      // References
      showFolderSelector,
      // Methods
      closeFolderSelector,
      toggleFolderSelector
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesActionBar.scss"></style>
