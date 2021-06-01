<template>
  <GenericTable
    class="files-table"
    :columns="columns"
    :rows="files"
    rowKey="id"
    :rowHeight="44"
    :selectable="true"
    @selection-changed="$emit('selection-changed', $event)"
    :placeholder="$t('FilesTable.emptyTablePlaceholder')"
  >
    <template #cell-name="{ row: file }">
      <FileNameCell
        :project="project"
        :file="file"
        @file-clicked="$emit('file-clicked', $event)"
        :editMode="nameEditMode[file.id]"
        @close="nameEditMode[file.id] = false"
      />
    </template>
    <template #cell-type="{ row: file }">
      <FileTypeCell :file="file" />
    </template>
    <template #cell-creator="{ row: { createdBy } }">
      {{ createdBy ? `${createdBy.firstname} ${createdBy.lastname[0]}.` : "?" }}
    </template>
    <template #cell-tags="{ row: file }">
      <FileTagsCell :file="file" />
    </template>
    <template #cell-lastupdate="{ row: file }">
      <FileLastUpdateCell :file="file" />
    </template>
    <template #cell-size="{ row: file }">
      {{ file.type !== "Folder" && file.size ? formatBytes(file.size) : "-" }}
    </template>
    <template #cell-actions="{ row: file }">
      <FileActionsCell
        :file="file"
        @delete-clicked="$emit('delete-clicked', $event)"
        @download-clicked="$emit('download-clicked', $event)"
        @update-clicked="nameEditMode[file.id] = true"
      />
    </template>
  </GenericTable>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { formatBytes } from "@/utils/files";
import columnsDef from "./columns";
// Components
import GenericTable from "@/components/generic/generic-table/GenericTable";
import FileActionsCell from "./file-actions-cell/FileActionsCell";
import FileLastUpdateCell from "./file-last-update-cell/FileLastUpdateCell";
import FileNameCell from "./file-name-cell/FileNameCell";
import FileTagsCell from "./file-tags-cell/FileTagsCell";
import FileTypeCell from "./file-type-cell/FileTypeCell";

export default {
  components: {
    GenericTable,
    FileActionsCell,
    FileLastUpdateCell,
    FileNameCell,
    FileTagsCell,
    FileTypeCell
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    files: {
      type: Array,
      required: true
    }
  },
  emits: [
    "delete-clicked",
    "download-clicked",
    "file-clicked",
    "selection-changed"
  ],
  setup(props) {
    const { locale, t } = useI18n();

    const columns = ref([]);
    watch(
      () => locale.value,
      () => {
        columns.value = columnsDef.map(col => ({
          ...col,
          label: col.label || t(`FilesTable.headers.${col.id}`)
        }));
      },
      { immediate: true }
    );

    let nameEditMode;
    watch(
      () => props.files,
      () => {
        nameEditMode = reactive({});
        props.files.forEach(row => {
          nameEditMode[row.id] = false;
        });
      },
      { immediate: true }
    );

    return {
      // References
      columns,
      nameEditMode,
      // Methods
      formatBytes
    };
  }
};
</script>
