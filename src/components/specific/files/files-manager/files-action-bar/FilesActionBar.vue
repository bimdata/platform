<template>
  <div class="files-action-bar">
    <BIMDataButton
      :disabled="!project.isAdmin && files.some(f => f.user_permission < 100)"
      width="120px"
      color="high"
      ghost
      squared
      @click="$emit('delete', files)"
    >
      <BIMDataIconDelete size="xs" margin="0 6px 0 0" />
      <span>{{ $t("FilesActionBar.deleteButtonText") }}</span>
    </BIMDataButton>
    <BIMDataButton
      :disabled="!project.isAdmin && files.some(f => f.user_permission < 100)"
      width="120px"
      color="secondary"
      ghost
      squared
      @click="toggleFolderSelector"
    >
      <BIMDataIconFolderMove size="s" margin="0 6px 0 0" />
      <span>{{ $t("FilesActionBar.moveButtonText") }}</span>
    </BIMDataButton>
    <BIMDataButton
      :disabled="!project.isAdmin && files.some(f => f.user_permission < 100)"
      width="120px"
      ghost
      squared
      @click="$emit('download', files)"
    >
      <BIMDataIconDownload size="s" margin="0 6px 0 0" />
      <span>{{ $t("FilesActionBar.downloadButtonText") }}</span>
    </BIMDataButton>

    <transition name="fade">
      <FolderSelector
        v-show="showFolderSelector"
        class="files-action-bar__folder-selector"
        :project="project"
        :fileStructure="fileStructure"
        :files="files"
        :initialFolder="initialFolder"
        @folder-selected="$emit('move', { files, dest: $event })"
        @close="closeFolderSelector"
      />
    </transition>
  </div>
</template>

<script>
import { useToggle } from "../../../../../composables/toggle.js";
// Components
import FolderSelector from "../../folder-selector/FolderSelector.vue";

export default {
  components: {
    FolderSelector
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
    files: {
      type: Array,
      default: () => []
    },
    initialFolder: {
      type: Object,
      required: true
    }
  },
  emits: ["delete", "download", "move"],
  setup() {
    const {
      isOpen: showFolderSelector,
      close: closeFolderSelector,
      toggle: toggleFolderSelector
    } = useToggle();

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
