<template>
  <div class="files-action-bar">
    <BIMDataButton
      :disabled="
        project.isGuest ||
        (!project.isAdmin && files.some(f => f.user_permission < 100))
      "
      width="120px"
      color="high"
      ghost
      squared
      @click="onDeleteClick(files)"
    >
      <BIMDataIconDelete size="xs" margin="0 6px 0 0" />
      <span>{{ $t("t.delete") }}</span>
    </BIMDataButton>
    <BIMDataButton
      v-if="files.some(f => f.type === 'Document' || f.type === 'Folder')"
      :disabled="
        project.isGuest ||
        (!project.isAdmin && files.some(f => f.user_permission < 100))
      "
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
    v-if="files.some(f => f.type === 'Document' || f.type === 'Folder')"
      width="120px"
      ghost
      squared
      @click="$emit('download', files)"
    >
      <BIMDataIconDownload size="s" margin="0 6px 0 0" />
      <span>{{ $t("t.download") }}</span>
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
  emits: ["delete-files", "delete-visas", "download", "move"],
  setup(props, { emit }) {
    const {
      isOpen: showFolderSelector,
      close: closeFolderSelector,
      toggle: toggleFolderSelector
    } = useToggle();

    const onDeleteClick = files => {
      const isFilesOrFolder = files.some(f => f.type === 'Document' || f.type === 'Folder');
      if (isFilesOrFolder) {
        emit('delete-files', files)
      } else {
        emit('delete-visas', files)
      }
    }

    return {
      // References
      showFolderSelector,
      // Methods
      closeFolderSelector,
      onDeleteClick,
      toggleFolderSelector
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesActionBar.scss"></style>
