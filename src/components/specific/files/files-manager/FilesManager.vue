<template>
  <BIMDataCard class="files-manager" :titleHeader="$t('FilesManager.title')">
    <template #left>
      <div>( Files breadcrumb )</div>
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
        />
      </div>
      <FileTree
        class="files-manager__tree"
        v-if="fileStructure"
        :project="project"
        :fileStructure="fileStructure"
        @file-selected="onFileSelected"
      />
      <FilesTable
        class="files-manager__table"
        :project="project"
        :files="currentFiles"
        @file-selected="onFileSelected"
      />

      <FilesManagerOnboarding v-if="false" :project="project" />
    </template>
  </BIMDataCard>
</template>

<script>
import { ref, watch } from "@vue/runtime-core";
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";
import FileTree from "@/components/specific/files/file-tree/FileTree";
import FilesTable from "@/components/specific/files/files-table/FilesTable";
import FilesManagerOnboarding from "./files-manager-onboarding/FilesManagerOnboarding";

export default {
  components: {
    BIMDataCard,
    BIMDataButton,
    BIMDataIcon,
    BIMDataSearch,
    FileTree,
    FilesTable,
    FilesManagerOnboarding
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    files: {
      type: Array,
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
    watch(currentFolder, folder => (currentFiles.value = folder.children), {
      immediate: true
    });

    const onFileSelected = file => {
      if (file.type === "Folder") {
        currentFolder.value = file;
      }
    };

    return {
      currentFiles,
      onFileSelected
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesManager.scss"></style>
