<template>
  <BIMDataCard class="files-manager" :titleHeader="$t('FilesManager.title')">
    <template #left>
      <div>( Files breadcrumb )</div>
    </template>
    <template #content>
      <div class="files-manager__actions">
        <BIMDataSearch
          class="files-manager__actions__input-search"
          width="400px"
          :placeholder="$t('FilesManager.searchInputPlaceholder')"
        />
        <BIMDataButton
          class="files-manager__actions__btn-new-folder"
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
          color="primary"
          fill
          radius
          @click="() => {}"
        >
          <BIMDataIcon name="addFile" size="xs" />
          <span>{{ $t("FilesManager.addFileButtonText") }}</span>
        </BIMDataButton>
      </div>
      <FileTree
        class="files-manager__tree"
        :project="project"
        :fileStructure="fileStructure"
        @file-selected="onFileSelected"
      />
      <FilesTable
        class="files-manager__table"
        :project="project"
        :files="files"
      />

      <FilesManagerOnboarding v-if="false" :project="project" />
    </template>
  </BIMDataCard>
</template>

<script>
import { onMounted, ref } from "@vue/runtime-core";
import { useFiles } from "@/state/files";
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";
import FileTree from "@/components/specific/files/file-tree/FileTree";
import FilesTable from "@/components/specific/files/files-table/FilesTable";
import FilesManagerOnboarding from "./files-manager-onboarding/FilesManagerOnboarding";

const testFileStructure = {
  id: 0,
  name: "root",
  children: [
    {
      id: 11,
      name: "model-1",
      type: "Ifc"
    },
    {
      id: 12,
      name: "Dossier de Toto",
      type: "Folder",
      children: [
        {
          id: 21,
          name: "Doc 1",
          type: "Document"
        },
        {
          id: 22,
          name: "document important",
          type: "Document"
        },
        {
          id: 23,
          name: "Sub Folder",
          type: "Folder",
          children: [
            {
              id: 31,
              name: "model-2",
              type: "Ifc"
            }
          ]
        }
      ]
    },
    {
      id: 13,
      name: "Another Folder",
      type: "Folder",
      children: [
        {
          id: 24,
          name: "Model 1234",
          type: "Ifc"
        }
      ]
    }
  ]
};

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
    }
  },
  setup(props) {
    const { loadProjectFileStructure } = useFiles();

    const files = ref([]);
    const fileStructure = ref(null);

    onMounted(async () => {
      // fileStructure.value = await loadProjectFileStructure(props.project);
      fileStructure.value = testFileStructure;
    });

    const onFileSelected = file => {
      // TODO
    };

    return {
      files,
      fileStructure,
      onFileSelected
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesManager.scss"></style>
