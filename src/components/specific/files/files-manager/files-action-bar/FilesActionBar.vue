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

    <template v-if="canConvertAllToModel(files) || canConvertAllToPhotosphere(files)">
      <BIMDataButton
        v-if="canConvertAllToModel(files)"
        width="120px"
        ghost
        squared
        @click="$emit('create-models', files)"
      >
        <BIMDataIconSetAsModel size="s" margin="0 6px 0 0" />
        <span>{{ $t("FileActionsCell.createModelButtonText") }}</span>
      </BIMDataButton>

      <BIMDataButton
        v-if="canConvertAllToPhotosphere(files)"
        width="120px"
        ghost
        squared
        @click="$emit('create-photospheres', files)"
      >
        <BIMDataIconSetAsModel size="s" margin="0 6px 0 0" />
        <span>{{ $t("FileActionsCell.createPhotosphereButtonText") }}</span>
      </BIMDataButton>
    </template>

    <template v-else-if="canRemoveAllModels(files)">
      <BIMDataButton width="120px" ghost squared @click="$emit('remove-models', files)">
        <BIMDataIconRemoveModel size="s" margin="0 6px 0 0" />
        <span>{{ $t("FileActionsCell.removeModelButtonText") }}</span>
      </BIMDataButton>
    </template>

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
import { isFolder } from "../../../../../utils/file-structure.js";
import { isConvertible, isConvertibleToPhotosphere, isModel } from "../../../../../utils/models.js";
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
  emits: [
    "delete-files",
    "delete-visas",
    "download",
    "move",
    "create-models",
    "create-photospheres",
    "remove-models",
  ],
  setup(props, { emit }) {
    const { hasAdminPerm } = useUser();

    const {
      isOpen: showFolderSelector,
      close: closeFolderSelector,
      toggle: toggleFolderSelector,
    } = useToggle();

    const isFilesOrFolder = (files) =>
      files.some((f) => f.nature === "Document" || f.nature === "Model" || f.nature === "Folder");

    const onDeleteClick = (files) => {
      emit(isFilesOrFolder(files) ? "delete-files" : "delete-visas", files);
    };

    const canConvertAllToModel = (files) =>
      files.every((file) => !isFolder(file) && isConvertible(file) && !isModel(file));

    const canConvertAllToPhotosphere = (files) =>
      files.every((file) => !isFolder(file) && isConvertibleToPhotosphere(file) && !isModel(file));

    const canRemoveAllModels = (files) =>
      files.length > 0 && files.every((file) => !isFolder(file) && isModel(file));

    return {
      // References
      showFolderSelector,
      // Methods
      closeFolderSelector,
      hasAdminPerm,
      isFilesOrFolder,
      onDeleteClick,
      toggleFolderSelector,
      canConvertAllToModel,
      canConvertAllToPhotosphere,
      canRemoveAllModels,
    };
  },
};
</script>

<style scoped lang="scss" src="./FilesActionBar.scss"></style>
