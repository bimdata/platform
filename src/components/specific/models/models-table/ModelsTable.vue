<template>
  <BIMDataTable
    ref="modelsTable"
    class="models-table"
    data-test-id="models-table"
    tableLayout="fixed"
    :columns="columns"
    :rows="modelsWithTags"
    rowKey="id"
    :selectable="true"
    @selection-changed="$emit('selection-changed', $event)"
  >
    <template #sub-header>
      <div class="file-uploads">
        <transition-group name="list">
          <FileUploadCard
            v-for="file in fileUploads"
            :key="file.key"
            condensed
            :project="project"
            :file="file"
            @upload-completed="$emit('file-uploaded', { key: file.key, file: $event })"
            @upload-canceled="$emit('upload-canceled', { key: file.key })"
            @upload-failed="$emit('upload-failed', { key: file.key })"
          />
        </transition-group>
      </div>
    </template>

    <template #cell-name="{ row: model }">
      <ModelNameCell
        :project="project"
        :model="model"
        :editMode="nameEditMode[model.id]"
        @close="nameEditMode[model.id] = false"
      />
    </template>
    <template #cell-tags="{ row: model }">
      <ModelTagsCell :model="model" :parent="modelsTable" />
    </template>
    <template #cell-version="{ row: { version } }">
      {{ version ?? "-" }}
    </template>
    <template #cell-creator="{ row: { creator } }">
      {{ creator ? `${creator.firstname} ${creator.lastname[0]}.` : "?" }}
    </template>
    <template #cell-lastupdate="{ row: model }">
      {{ $d(model.updated_at, "long") }}
    </template>
    <template #cell-status="{ row: model }">
      <ModelStatusCell :project="project" :model="model" />
    </template>
    <template #cell-actions="{ row: model }">
      <ModelActionsCell
        :project="project"
        :model="model"
        @archive="$emit('archive', $event)"
        @delete="$emit('delete', $event)"
        @download="$emit('download', $event)"
        @unarchive="$emit('unarchive', $event)"
        @update="nameEditMode[model.id] = true"
        @view-metaBuilding="$emit('view-metaBuilding', $event)"
        @edit-metaBuilding="$emit('edit-metaBuilding', $event)"
        @view-photosphereBuilding="$emit('view-photosphereBuilding', $event)"
        @edit-photosphereBuilding="$emit('edit-photosphereBuilding', $event)"
      />
    </template>

    <template #placeholder>
      <slot name="placeholder">
        {{ $t("ModelsTable.emptyTablePlaceholder.text") }}
      </slot>
    </template>
  </BIMDataTable>
</template>

<script>
import { ref, computed, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import columnsDef from "./columns.js";
import { useStandardBreakpoints } from "../../../../composables/responsive.js";
import { useFiles } from "../../../../state/files.js";
import { isFolder } from "../../../../utils/file-structure.js";
// Components
import FileUploadCard from "../../files/file-upload-card/FileUploadCard.js";
import ModelActionsCell from "./model-actions-cell/ModelActionsCell.vue";
import ModelNameCell from "./model-name-cell/ModelNameCell.vue";
import ModelStatusCell from "./model-status-cell/ModelStatusCell.vue";
import ModelTagsCell from "./model-tags-cell/ModelTagsCell.vue";

export default {
  components: {
    ModelActionsCell,
    ModelNameCell,
    ModelStatusCell,
    FileUploadCard,
    ModelTagsCell,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    models: {
      type: Array,
      required: true,
    },
    fileUploads: {
      type: Array,
      default: () => [],
    },
  },
  emits: [
    "archive",
    "delete",
    "download",
    "edit-metaBuilding",
    "edit-photosphereBuilding",
    "file-clicked",
    "file-uploaded",
    "go-folders-view",
    "selection-changed",
    "unarchive",
    "upload-canceled",
    "upload-failed",
    "view-metaBuilding",
    "view-photosphereBuilding",
  ],
  setup(props) {
    const { t } = useI18n();
    const { isLG, isXL } = useStandardBreakpoints();
    const { projectFileStructure } = useFiles();

    const modelsTable = ref(null);
    const columns = computed(() => {
      let filteredColumns = columnsDef;
      if (isLG.value) {
        filteredColumns = filteredColumns.filter((col) =>
          ["name", "status", "actions"].includes(col.id)
        );
      } else if (isXL.value) {
        filteredColumns = filteredColumns.filter((col) =>
          ["name", "creator", "lastupdate", "status", "actions"].includes(col.id)
        );
      }
      return filteredColumns.map((col) => ({
        ...col,
        label: col.label ?? t(col.text),
      }));
    });

    let nameEditMode;
    watch(
      () => props.models,
      () => {
        nameEditMode = reactive({});
        props.models.forEach((model) => (nameEditMode[model.id] = false));
      },
      { immediate: true }
    );

    const getFoldersInFolder = (folder) => {
      const folders = [];
      folder.children.forEach((child) => {
        if (isFolder(child)) {
          folders.push(child);
          folders.push(...getFoldersInFolder(child));
        }
      });
      return folders;
    };
    const getFilesInFolder = (folder) => {
      const files = [];
      folder.children.forEach((child) => {
        if (isFolder(child)) {
          files.push(...getFilesInFolder(child));
        } else {
          files.push(child);
        }
      });
      return files;
    };
    const allFolders = computed(() =>
      projectFileStructure.value.children.flatMap((file) => {
        if (isFolder(file)) {
          return [file, ...getFoldersInFolder(file)];
        } else {
          return [];
        }
      })
    );
    const allFiles = computed(() =>
      projectFileStructure.value.children.flatMap((file) => {
        if (isFolder(file)) {
          return getFilesInFolder(file);
        } else {
          return file;
        }
      })
    );

    const tagsByModelId = computed(() => {
      const map = {};

      allFiles.value.forEach((file) => {
        const modelId = file.model_id;
        if (!modelId || !file.tags) return;

        if (!map[modelId]) {
          map[modelId] = [];
        }

        Object.entries(file.tags).forEach(([key, value]) => {
          map[modelId].push({
            id: key,
            name: value.name,
            color: value.color,
          });
        });
      });

      return map;
    });

    const modelsWithTags = computed(() =>
      props.models.map((model) => ({
        ...model,
        tags: tagsByModelId.value[model.id] ?? {},
      }))
    );

    return {
      // References
      allFiles,
      allFolders,
      columns,
      modelsTable,
      modelsWithTags,
      nameEditMode,
      fileStructure: projectFileStructure,
    };
  },
};
</script>

<style scoped>
.models-table {
  max-height: 460px;
  overflow: auto;
  .file-uploads {
    position: absolute;
    z-index: 1;
    width: 100%;
    background-color: var(--color-white);
    box-shadow: var(--box-shadow);
  }
}
</style>
