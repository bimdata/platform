<template>
  <div class="folder-selector">
    <div class="folder-selector__head">
      <BIMDataButton
        class="folder-selector__head__btn-back"
        ghost
        rounded
        icon
        :disabled="currentFolder.id === fileStructure.id"
        @click="exitFolder"
      >
        <BIMDataIcon name="arrow" size="xs" />
      </BIMDataButton>

      <BIMDataIcon name="folder" size="xs" />
      <TextBox
        class="folder-selector__head__name"
        :text="currentFolder.name"
        :maxLength="32"
      />
      <BIMDataButton
        class="folder-selector__head__btn-close"
        ghost
        rounded
        icon
        @click="close"
      >
        <BIMDataIcon name="close" size="xxs" />
      </BIMDataButton>
    </div>
    <div class="folder-selector__body">
      <div
        class="folder-selector__body__item"
        v-for="file of displayedFiles"
        :key="file.id"
        :class="{
          folder: file.type === 'Folder',
          selected: selectedFolder && selectedFolder.id === file.id
        }"
        @click="selectFolder(file)"
        @dblclick="enterFolder(file)"
      >
        <BIMDataIcon v-if="file.type === 'Folder'" name="folder" size="xs" />
        <FileIcon v-else-if="file.type === 'Ifc'" name="ifc" size="13" />
        <FileIcon v-else :name="fileExtension(file.name)" size="13" />
        <TextBox
          class="folder-selector__body__item__name"
          :text="file.name"
          :maxLength="32"
        />
        <BIMDataIcon
          v-if="file.type === 'Folder'"
          name="chevron"
          size="xxs"
          @click.stop="enterFolder(file)"
        />
      </div>
      <div
        v-show="displayedFiles.length === 0"
        class="folder-selector__body__placeholder"
      >
        <BIMDataIcon
          class="folder-selector__body__placeholder__icon"
          name="folderOpen"
          size="xxxl"
          margin="0 0 25px 0px"
        />
        <div>{{ $t("FolderSelector.emptyFolderPlaceholder") }}</div>
      </div>
    </div>
    <div class="folder-selector__footer">
      <div
        class="folder-selector__footer__text"
        :style="{ visibility: selectedFolder ? 'visible' : 'hidden' }"
      >
        {{ $t("FolderSelector.selectedFolder") }}:
        <TextBox
          style="font-weight: bold"
          :text="selectedFolder ? selectedFolder.name : ''"
          :maxLength="24"
        />
      </div>
      <BIMDataButton
        class="folder-selector__footer__btn-submit"
        width="100px"
        color="primary"
        fill
        radius
        @click="submit"
        :disabled="isAllowedToMoveFile"
      >
        {{
          $t(
            `FolderSelector.submitButtonText.${
              selectedFolder ? "moveTo" : "moveHere"
            }`
          )
        }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";

import { useFiles } from "@/state/files";
import { fileExtension } from "@/utils/files";
import FILE_PERMISSIONS from "@/config/file-permissions";
import FILE_TYPES from "@/config/file-types";

export default {
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
  emits: ["close", "folder-selected"],
  setup(props, { emit }) {
    const { fileStructureHandler: handler } = useFiles();

    const folderPath = ref([]);
    const currentFolder = ref(null);
    const selectedFolder = ref(null);

    const displayedFiles = computed(() =>
      handler
        .children(currentFolder.value)
        .filter(
          child =>
            !props.files.some(f => child.id === f.id) &&
            (props.project.isAdmin ||
              child.userPermission === FILE_PERMISSIONS.READ_WRITE)
        )
        .sort((a, b) => {
          if (a.type === "Folder" && b.type !== "Folder") return -1;
          return a.name < b.name ? -1 : 1;
        })
    );

    const isAllowedToMoveFile = computed(() => {
      const activeFolder = (selectedFolder.value || currentFolder.value).id;
      return props.files.some(f => activeFolder === f.parentId);
    });

    const set = () => {
      currentFolder.value = props.initialFolder;
      folderPath.value = handler.ancestors(currentFolder.value);
      selectedFolder.value = null;
    };

    const close = () => {
      set();
      emit("close");
    };

    const submit = () => {
      if (selectedFolder.value) {
        emit("folder-selected", selectedFolder.value);
      } else {
        emit("folder-selected", currentFolder.value);
      }
      close();
    };

    const enterFolder = folder => {
      if (folder.type !== FILE_TYPES.FOLDER) return;

      folderPath.value.push(currentFolder.value);
      currentFolder.value = folder;
      selectedFolder.value = null;
    };

    const exitFolder = () => {
      currentFolder.value = folderPath.value.pop();
    };

    const selectFolder = folder => {
      if (folder.type !== FILE_TYPES.FOLDER) return;

      if (selectedFolder.value && selectedFolder.value.id === folder.id) {
        selectedFolder.value = null;
      } else {
        selectedFolder.value = folder;
      }
    };

    watch(
      () => props.initialFolder,
      () => set(),
      { immediate: true }
    );

    return {
      // References
      folderPath,
      displayedFiles,
      currentFolder,
      selectedFolder,
      // Methods
      close,
      enterFolder,
      exitFolder,
      selectFolder,
      submit,
      isAllowedToMoveFile,
      fileExtension
    };
  }
};
</script>

<style scoped lang="scss" src="./FolderSelector.scss"></style>
