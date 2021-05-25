<template>
  <GenericTable
    class="files-table"
    :columns="columns"
    :rows="files"
    :rowHeight="44"
    :selectable="true"
    :placeholder="$t('FilesTable.emptyTablePlaceholder')"
  >
    <template #cell-name="{ row: file }">
      <FileNameCell :file="file" @click="$emit('file-selected', file)" />
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
      <FileActionsCell :file="file" />
    </template>
  </GenericTable>
</template>

<script>
import { ref } from "@vue/reactivity";
import { watchEffect } from "@vue/runtime-core";
import { useI18n } from "vue-i18n";
import { fileExtension, formatBytes } from "@/utils/files";
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
  emits: ["file-selected"],
  setup() {
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

    return {
      // References
      columns,
      // Methods
      fileExtension,
      formatBytes
    };
  }
};
</script>
