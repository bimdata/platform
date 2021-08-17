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
      <div>
        <TextBox
          class="folder-selector__head__path"
          :text="folderPath.map(f => f.name).join(' > ')"
          :maxLength="42"
          cutOn="start"
        />
        <TextBox
          class="folder-selector__head__name"
          :text="currentFolder.name"
          :maxLength="32"
        />
      </div>
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
        v-for="folder of folders"
        :key="folder.id"
        :class="{
          selected: selectedFolder && selectedFolder.id === folder.id
        }"
        @click="selectFolder(folder)"
        @dblclick="enterFolder(folder)"
      >
        <BIMDataIcon name="folder" size="xs" />
        <TextBox
          class="folder-selector__body__item__name"
          :text="folder.name"
          :maxLength="32"
        />
        <BIMDataIcon
          name="chevron"
          size="xxs"
          @click.stop="enterFolder(folder)"
        />
      </div>
      <div
        v-show="folders.length === 0"
        class="folder-selector__body__placeholder"
      >
        <BIMDataIcon
          class="folder-selector__body__placeholder__icon"
          name="folderOpen"
          size="xxxl"
        />
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
import { FILE_PERMISSION, FILE_TYPE } from "@/utils/file-structure";

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
    }
  },
  emits: ["close", "folder-selected"],
  setup(props, { emit }) {
    const folderPath = ref([]);
    const currentFolder = ref(null);
    const selectedFolder = ref(null);

    /* eslint-disable */
    const folders = computed(() =>
      currentFolder.value.children.filter(
        child =>
          child.type === FILE_TYPE.FOLDER
          && !props.files.some(f => child.id === f.id)
          && (props.project.isAdmin || child.userPermission === FILE_PERMISSION.READ_WRITE)
      )
    );
    /* eslint-enable */

    const reset = () => {
      folderPath.value = [];
      currentFolder.value = props.fileStructure;
      selectedFolder.value = null;
    };

    const close = () => {
      reset();
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
      folderPath.value.push(currentFolder.value);
      currentFolder.value = folder;
      selectedFolder.value = null;
    };

    const exitFolder = () => {
      currentFolder.value = folderPath.value.pop();
    };

    const selectFolder = folder => {
      if (selectedFolder.value && selectedFolder.value.id === folder.id) {
        selectedFolder.value = null;
      } else {
        selectedFolder.value = folder;
      }
    };

    watch(
      () => props.fileStructure,
      () => reset(),
      { immediate: true }
    );

    return {
      // References
      folderPath,
      folders,
      currentFolder,
      selectedFolder,
      // Methods
      close,
      enterFolder,
      exitFolder,
      selectFolder,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./FolderSelector.scss"></style>
