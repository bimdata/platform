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
      <BIMDataTextBox
        class="folder-selector__head__name"
        maxWidth="120px"
        :text="currentFolder.name"
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
          folder: isFolder(file),
          selected: selectedFolder && selectedFolder.id === file.id
        }"
        @click="selectFolder(file)"
        @dblclick="enterFolder(file)"
      >
        <span class="folder-selector__body__item__icon">
          <BIMDataIcon v-if="isFolder(file)" name="folder" size="xs" />
          <BIMDataFileIcon
            v-else-if="file.type === 'Ifc'"
            name="ifc"
            size="13"
          />
          <BIMDataFileIcon v-else :name="fileExtension(file.name)" size="13" />
        </span>
        <BIMDataTextBox
          class="folder-selector__body__item__name"
          :text="file.name"
          :tooltip="false"
        />
        <BIMDataIcon
          v-if="isFolder(file)"
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
        :class="{ visibility: selectedFolder }"
      >
        {{ $t("FolderSelector.selectedFolder") }}:
        <BIMDataTextBox
          style="font-weight: bold"
          width="auto"
          maxWidth="100px"
          :text="selectedFolder ? selectedFolder.name : ''"
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
import { isFolder } from "@/utils/file-structure";
import FILE_PERMISSIONS from "@/config/file-permissions";

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
          if (isFolder(a) && !isFolder(b)) return -1;
          if (!isFolder(a) && isFolder(b)) return 1;

          return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
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
      if (!isFolder(folder)) return;

      folderPath.value.push(currentFolder.value);
      currentFolder.value = folder;
      selectedFolder.value = null;
    };

    const exitFolder = () => {
      currentFolder.value = folderPath.value.pop();
    };

    const selectFolder = folder => {
      if (!isFolder(folder)) return;

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
      fileExtension,
      isFolder
    };
  }
};
</script>

<style scoped lang="scss" src="./FolderSelector.scss"></style>
