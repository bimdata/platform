<template>
  <GenericTable
    ref="filesTable"
    class="files-table"
    :columns="columns"
    :rows="files"
    rowKey="id"
    :rowHeight="54"
    :selectable="true"
    @selection-changed="$emit('selection-changed', $event)"
    :placeholder="$t('FilesTable.emptyTablePlaceholder')"
  >
    <template #sub-header>
      <div
        :style="{
          display: folder.parent_id ? 'flex' : 'none',
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
        <template
          v-if="fileUploads.type && fileUploads.type === FILE_TYPE.DOCUMENT"
        >
          <FileUploadCard
            v-for="file of fileUploads.files"
            :key="file.key"
            condensed
            :project="project"
            :folder="folder"
            :file="file"
            @upload-completed="onUploadCompleted(file.key, $event)"
            @upload-canceled="cleanUpload(file.key, 6000)"
            @upload-failed="cleanUpload(file.key, 12000)"
          />
        </template>
        <template
          v-if="fileUploads.type && fileUploads.type === FILE_TYPE.FOLDER"
        >
          <FolderUploadCard
            condensed
            :project="project"
            :folder="fileUploads"
            @upload-completed="$emit('file-uploaded')"
          />
        </template>
      </transition-group>
    </template>
    <template #cell-name="{ row: file }">
      <FileNameCell
        :project="project"
        :file="file"
        @file-clicked="$emit('file-clicked', $event)"
        @open-versioning-manager="$emit('open-versioning-manager', $event)"
        :editMode="nameEditMode[file.id]"
        @close="nameEditMode[file.id] = false"
      />
    </template>
    <template #cell-type="{ row: file }">
      <FileTypeCell :file="file" />
    </template>
    <template #cell-creator="{ row: { created_by } }">
      {{
        created_by ? `${created_by.firstname} ${created_by.lastname[0]}.` : "?"
      }}
    </template>
    <template #cell-tags="{ row: file }">
      <FileTagsCell :file="file" :filesTable="filesTable" />
    </template>
    <template #cell-lastupdate="{ row: file }">
      {{ $d(file.updated_at, "long") }}
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
        @open-tag-manager="$emit('open-tag-manager', $event)"
        @remove-model="$emit('remove-model', $event)"
        @update="nameEditMode[file.id] = true"
      />
    </template>
  </GenericTable>
</template>

<script>
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useStandardBreakpoints } from "@/composables/responsive.js";
import { isFolder } from "@/utils/file-structure.js";
import { formatBytes, generateFileKey } from "@/utils/files.js";
import { FILE_TYPE } from "@/config/files.js";

import columnsDef from "./columns.js";
// Components
import GenericTable from "@/components/generic/generic-table/GenericTable.vue";
import FileUploadCard from "@/components/specific/files/file-upload-card/FileUploadCard.vue";
import FolderUploadCard from "@/components/specific/files/folder-upload-card/FolderUploadCard.vue";

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
    FolderUploadCard,
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
      type: Object
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
    "selection-changed",
    "open-tag-manager",
    "remove-model"
  ],
  setup(props, { emit }) {
    const { t } = useI18n();
    const { isLG, isXL } = useStandardBreakpoints();

    const filesTable = ref(null);

    const columns = computed(() => {
      let filteredColumns = columnsDef;
      if (isLG.value) {
        filteredColumns = filteredColumns.filter(col =>
          ["name", "size", "actions"].includes(col.id)
        );
      } else if (isXL.value) {
        filteredColumns = filteredColumns.filter(col =>
          ["name", "lastupdate", "size", "actions"].includes(col.id)
        );
      }
      return filteredColumns.map(col => ({
        ...col,
        label: col.label || t(`FilesTable.headers.${col.id}`)
      }));
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

    const fileUploads = ref({});
    watch(
      () => props.filesToUpload,
      () => {
        if (!props.filesToUpload.type) return;
        fileUploads.value = Object.assign(props.filesToUpload, {
          files: Array.from(props.filesToUpload.files).map(file =>
            Object.assign(file, { key: generateFileKey(file) })
          )
        });
      }
    );

    const onUploadCompleted = (key, file) => {
      cleanUpload(key, 500);
      emit("file-uploaded", file);
    };

    const cleanUpload = (key, delay = 100) => {
      setTimeout(() => {
        const index = fileUploads.value.files.findIndex(f => f.key === key);
        fileUploads.value.files.splice(index, 1);
      }, delay);
    };

    return {
      // References
      columns,
      filesTable,
      fileUploads,
      nameEditMode,
      FILE_TYPE,
      // Methods
      cleanUpload,
      formatBytes,
      isFolder,
      onUploadCompleted,
      // Responsive breakpoints
      isXL
    };
  }
};
</script>
