<template>
  <GenericTable
    class="files-table"
    :columns="columns"
    :rows="files"
    rowKey="id"
    :rowHeight="44"
    :selectable="true"
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
    <template #cell-creator="{ row: { creator } }">
      {{ creator ? `${creator.firstname} ${creator.lastname[0]}.` : "?" }}
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
        @update-clicked="nameEditMode[file.id] = true"
      />
    </template>
  </GenericTable>
</template>

<script>
import { reactive, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { formatBytes } from "@/utils/files";
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
  emits: ["file-clicked"],
  setup(props) {
    const { t } = useI18n();

    const columns = ref([]);
    watchEffect(() => {
      columns.value = [
        {
          id: "name",
          label: t("FilesTable.headers.name")
        },
        {
          id: "type",
          label: t("FilesTable.headers.type"),
          width: "100px",
          align: "center"
        },
        {
          id: "creator",
          label: t("FilesTable.headers.creator"),
          width: "200px",
          align: "center"
        },
        {
          id: "tags",
          label: t("FilesTable.headers.tags"),
          width: "200px"
        },
        {
          id: "lastupdate",
          label: t("FilesTable.headers.lastupdate"),
          width: "150px",
          align: "center"
        },
        {
          id: "size",
          label: t("FilesTable.headers.size"),
          width: "100px",
          align: "center"
        },
        {
          id: "actions",
          label: " ",
          width: "50px",
          align: "center"
        }
      ];
    });

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
