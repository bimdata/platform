<template>
  <BIMDataCard class="files-manager" :titleHeader="$t('FilesManager.title')">
    <template #left>
      <FilesManagerBreadcrumb :file="currentFolder" />
    </template>
    <template #content>
      <div class="files-manager__actions">
        <BIMDataButton
          class="files-manager__actions__btn-new-folder"
          width="194px"
          color="primary"
          fill
          radius
          @click="() => {}"
        >
          <BIMDataIcon name="addFolder" size="xs" />
          <span>{{ $t("FilesManager.addFolderButtonText") }}</span>
        </BIMDataButton>
        <BIMDataButton
          class="files-manager__actions__btn-new-file"
          width="194px"
          color="primary"
          fill
          radius
          @click="() => {}"
        >
          <BIMDataIcon name="addFile" size="xs" />
          <span>{{ $t("FilesManager.addFileButtonText") }}</span>
        </BIMDataButton>
        <BIMDataSearch
          class="files-manager__actions__input-search"
          width="400px"
          :placeholder="$t('FilesManager.searchInputPlaceholder')"
          v-model="searchText"
          clear
        />
      </div>
      <FileTree
        class="files-manager__tree"
        v-if="fileStructure"
        :project="project"
        :fileStructure="fileStructure"
        :selectedFile="currentFolder"
        @file-selected="onFileSelected"
      />
      <FilesTable
        class="files-manager__table"
        :project="project"
        :files="displayedFiles"
        @file-selected="onFileSelected"
      />

      <FilesManagerOnboarding v-if="false" :project="project" />
    </template>
  </BIMDataCard>
</template>

<script>
import { ref, watch, watchEffect } from "vue";
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";
import FileTree from "@/components/specific/files/file-tree/FileTree";
import FilesTable from "@/components/specific/files/files-table/FilesTable";
import FilesManagerBreadcrumb from "./files-manager-breadcrumb/FilesManagerBreadcrumb";
import FilesManagerOnboarding from "./files-manager-onboarding/FilesManagerOnboarding";

export default {
  components: {
    BIMDataCard,
    BIMDataButton,
    BIMDataIcon,
    BIMDataSearch,
    FileTree,
    FilesTable,
    FilesManagerBreadcrumb,
    FilesManagerOnboarding
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    fileStructure: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const currentFolder = ref(null);
    const currentFiles = ref([]);
    watch(
      () => props.fileStructure,
      () => (currentFolder.value = props.fileStructure),
      { immediate: true }
    );
    watch(
      () => currentFolder.value,
      folder => {
        const childrenFolders = folder.children
          .filter(child => child.type === "Folder")
          .sort((a, b) => (a.name < b.name ? -1 : 1));
        const childrenFiles = folder.children
          .filter(child => child.type !== "Folder")
          .sort((a, b) => (a.name < b.name ? -1 : 1));
        currentFiles.value = childrenFolders.concat(childrenFiles);
      },
      { immediate: true }
    );
    const onFileSelected = file => {
      if (file.type === "Folder") {
        currentFolder.value = file;
      }
    };

    const displayedFiles = ref([]);
    watch(
      () => currentFiles.value,
      () => (displayedFiles.value = currentFiles.value),
      { immediate: true }
    );

    const searchText = ref("");
    const filterFiles = value => {
      const text = value.trim().toLowerCase();
      if (text) {
        displayedFiles.value = currentFiles.value.filter(a =>
          a.name.toLowerCase().includes(text)
        );
      } else {
        displayedFiles.value = currentFiles.value;
      }
    };
    watchEffect(() => filterFiles(searchText.value));

    return {
      // References
      currentFolder,
      displayedFiles,
      searchText,
      // Methods
      onFileSelected
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesManager.scss"></style>
