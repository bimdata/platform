<template>
  <GenericTable
    ref="filesTable"
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
      <div
        :style="{
          display: folder.parentId ? 'flex' : 'none',
          alignItems: 'center'
        }"
      >
        <BIMDataButton
          ghost
          rounded
          icon
          style="margin: 5px 14px"
          @click="$emit('back-parent-folder', folder)"
        >
          <BIMDataIcon name="arrow" size="xxs" style="cursor: pointer" />
        </BIMDataButton>
        <FilesManagerBreadcrumb
          :file="folder"
          @file-clicked="$emit('file-clicked', $event)"
        />
      </div>
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
      {{ $d(file.updatedAt, "long") }}
    </template>
    <template #cell-size="{ row: file }">
      {{ !isFolder(file) && file.size ? formatBytes(file.size) : "-" }}
    </template>
    <template #cell-actions="{ row: file }">
      <FileActionsCell
        :filesTable="filesTable"
        :project="project"
        :file="file"
        @create-model="$emit('create-model', $event)"
        @delete="$emit('delete', $event)"
        @download="$emit('download', $event)"
        @manage-access="$emit('manage-access', $event)"
        @open-versioning-manager="$emit('open-versioning-manager', $event)"
        @open-visa-manager="$emit('open-visa-manager', $event)"
        @remove-model="$emit('remove-model', $event)"
        @update="nameEditMode[file.id] = true"
      />
    </template>
  </GenericTable>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { isFolder } from "@/utils/file-structure.js";
import { formatBytes, generateFileKey } from "@/utils/files.js";
import columnsDef from "./columns.js";
// Components
import GenericTable from "@/components/generic/generic-table/GenericTable.vue";
import FileUploadCard from "@/components/specific/files/file-upload-card/FileUploadCard.vue";
import FilesManagerBreadcrumb from "@/components/specific/files/files-manager/files-manager-breadcrumb/FilesManagerBreadcrumb.vue";
import FileActionsCell from "./file-actions-cell/FileActionsCell.vue";
import FileNameCell from "./file-name-cell/FileNameCell.vue";
import FileTagsCell from "./file-tags-cell/FileTagsCell.vue";
import FileTypeCell from "./file-type-cell/FileTypeCell.vue";

export default {
  components: {
    GenericTable,
    FileActionsCell,
    FileNameCell,
    FileTagsCell,
    FileTypeCell,
    FileUploadCard,
    FilesManagerBreadcrumb
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
    "back-parent-folder",
    "create-model",
    "delete",
    "download",
    "file-clicked",
    "file-uploaded",
    "manage-access",
    "open-versioning-manager",
    "open-visa-manager",
    "remove-model",
    "selection-changed"
  ],
  setup(props, { emit }) {
    const { locale, t } = useI18n();

    const filesTable = ref(null);

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
            Object.assign(file, { key: generateFileKey(file) })
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
      filesTable,
      fileUploads,
      nameEditMode,
      // Methods
      cleanUpload,
      formatBytes,
      isFolder,
      onUploadCompleted
    };
  }
};
</script>
