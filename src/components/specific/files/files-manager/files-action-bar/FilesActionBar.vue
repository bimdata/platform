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

    <template v-if="canConvertAllToModel || canConvertAllToPhotosphere">
      <BIMDataButton
        v-if="canConvertAllToModel"
        width="120px"
        ghost
        squared
        @click="handleCreateModels"
        :disabled="disabledModelsButton"
      >
        <BIMDataIconSetAsModel size="s" margin="0 6px 0 0" />
        <span>{{ $t("FileActionsCell.createModelButtonText") }}</span>
      </BIMDataButton>

      <BIMDataButton
        v-if="canConvertAllToPhotosphere"
        width="120px"
        ghost
        squared
        @click="handleCreatePhotospheres"
        :disabled="disabledModelsButton"
      >
        <BIMDataIconSetAsModel size="s" margin="0 6px 0 0" />
        <span>{{ $t("FileActionsCell.createPhotosphereButtonText") }}</span>
      </BIMDataButton>
    </template>

    <template v-else-if="canRemoveAllModels">
      <BIMDataButton
        width="120px"
        ghost
        squared
        @click="handleRemoveModels"
        :disabled="disabledModelsButton"
      >
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
import { computed } from "vue";
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
    isCreatingModels: {
      type: Boolean,
      default: false,
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

    const disabledModelsButton = computed(() => props.isCreatingModels);

    const isFilesOrFolder = (files) =>
      files.some(
        (file) => file.nature === "Document" || file.nature === "Model" || file.nature === "Folder",
      );

    const onDeleteClick = (files) => {
      emit(isFilesOrFolder(files) ? "delete-files" : "delete-visas", files);
    };

    const canConvertAllToModel = computed(
      () =>
        props.files.length > 0 &&
        props.files.every(
          (file) => !isFolder(file) && isConvertible(file) && file.nature === "Document",
        ),
    );
    const canConvertAllToPhotosphere = computed(
      () =>
        props.files.length > 0 &&
        props.files.every(
          (file) =>
            !isFolder(file) && isConvertibleToPhotosphere(file) && file.nature === "Document",
        ),
    );
    const canRemoveAllModels = computed(
      () =>
        props.files.length > 0 &&
        props.files.every(
          (file) => !isFolder(file) && isConvertible(file) && file.nature === "Model",
        ),
    );

    const handleCreateModels = () => emit("create-models");
    const handleCreatePhotospheres = () => emit("create-photospheres");
    const handleRemoveModels = () => emit("remove-models");

    return {
      // References
      showFolderSelector,
      disabledModelsButton,
      // Methods
      closeFolderSelector,
      hasAdminPerm,
      isFilesOrFolder,
      onDeleteClick,
      toggleFolderSelector,
      canConvertAllToModel,
      canConvertAllToPhotosphere,
      canRemoveAllModels,
      handleCreateModels,
      handleCreatePhotospheres,
      handleRemoveModels,
    };
  },
};
</script>

<style scoped lang="scss" src="./FilesActionBar.scss"></style>
