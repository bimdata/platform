<template>
  <div class="files-action-bar">
    <BIMDataButton
      :disabled="!hasAdminPerm(project, files)"
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
      v-if="isFilesOrFolder(files)"
      :disabled="!hasAdminPerm(project, files)"
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
      v-if="isFilesOrFolder(files)"
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
import { useUser } from "../../../../../state/user.js";
// Components
import FolderSelector from "../../folder-selector/FolderSelector.vue";

export default {
  components: {
    FolderSelector,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    fileStructure: {
      type: Object,
      required: true,
    },
    files: {
      type: Array,
      default: () => [],
    },
    initialFolder: {
      type: Object,
      required: true,
    },
  },
  emits: ["delete-files", "delete-visas", "download", "move"],
  setup(props, { emit }) {
    const { hasAdminPerm } = useUser();

    const {
      isOpen: showFolderSelector,
      close: closeFolderSelector,
      toggle: toggleFolderSelector,
    } = useToggle();

    const isFilesOrFolder = files => files.some(
      f => f.nature === "Document" || f.nature === "Model" || f.nature === "Folder"
    );

    const onDeleteClick = files => {
      emit(isFilesOrFolder(files) ? "delete-files" : "delete-visas", files);
    };

    return {
      // References
      showFolderSelector,
      // Methods
      closeFolderSelector,
      hasAdminPerm,
      isFilesOrFolder,
      onDeleteClick,
      toggleFolderSelector,
    };
  },
};
</script>

<style scoped lang="scss" src="./FilesActionBar.scss"></style>
