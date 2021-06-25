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
    <template #sub-header>
      <transition-group name="list">
        <FileUploadCard
          v-for="file of fileUploads"
          :key="file.key"
          condensed
          :project="project"
          :folder="folder"
          :file="file"
          @upload-completed="onUploadCompleted(file.key, $event)"
          @upload-canceled="cleanUpload(file.key, 6000)"
          @upload-failed="cleanUpload(file.key, 12000)"
        />
      </transition-group>
    </template>
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
        :project="project"
        :file="file"
        @delete="$emit('delete', $event)"
        @download="$emit('download', $event)"
        @manage-access="$emit('manage-access', $event)"
        @update="nameEditMode[file.id] = true"
      />
    </template>
  </GenericTable>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { formatBytes, generateFileKey } from "@/utils/files";
import columnsDef from "./columns";
// Components
import GenericTable from "@/components/generic/generic-table/GenericTable";
import FileUploadCard from "@/components/specific/files/file-upload-card/FileUploadCard";
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
    FileTypeCell,
    FileUploadCard
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    folder: {
      type: Object,
      required: true
    },
    files: {
      type: Array,
      required: true
    },
    filesToUpload: {
      type: Array,
      default: () => []
    }
  },
  emits: [
    "delete",
    "download",
    "file-clicked",
    "file-uploaded",
    "manage-access",
    "selection-changed"
  ],
  setup(props, { emit }) {
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

    const fileUploads = ref([]);
    watch(
      () => props.filesToUpload,
      () => {
        fileUploads.value = fileUploads.value.concat(
          props.filesToUpload.map(file =>
            Object.assign(file, { key: generateFileKey(file.name, file.size) })
          )
        );
      },
      { immediate: true }
    );

    const onUploadCompleted = (key, file) => {
      cleanUpload(key, 500);
      emit("file-uploaded", file);
    };

    const cleanUpload = (key, delay = 100) => {
      setTimeout(() => {
        const index = fileUploads.value.findIndex(f => f.key === key);
        fileUploads.value.splice(index, 1);
      }, delay);
    };

    return {
      // References
      columns,
      fileUploads,
      nameEditMode,
      // Methods
      cleanUpload,
      formatBytes,
      onUploadCompleted
    };
  }
};
</script>
