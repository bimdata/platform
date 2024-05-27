<template>
  <div class="files-table-manager">
    <BIMDataTabs
      :tabs="filesTabs"
      width="100%"
      height="40px"
      tabSize="160"
      :selected="selectedFileTab.id"
      @tab-selected="$emit('tab-selected', $event)"
    >
    <template #tab="{ tab }">
        <span class="files-table-manager__tab-label">
          {{ tab.text }}
        </span>
        <span v-if="tab.id !== 'folders'" class="files-table-manager__tab-count m-l-6">
          {{ tab.data.length }}
        </span>
      </template>
    </BIMDataTabs>
    <transition name="fade">
      <BIMDataTable
        v-if="selectedFileTab.id === 'folders'"
        ref="filesTable"
        class="files-table"
        data-test-id="files-table"
        tableLayout="fixed"
        :columns="columns"
        :rows="displayedFiles"
        rowKey="id"
        :rowHeight="48"
        :selectable="true"
        @selection-changed="$emit('selection-changed', $event)"
        :canDragOverRow="isFolder"
        @row-drop="onRowDrop"
        :placeholder="$t('t.emptyFolder')"
      >
        <template #sub-header>
          <div
            :style="{
              display: folder.parent_id ? 'flex' : 'none',
              alignItems: 'center',
            }"
          >
            <BIMDataButton
              ghost
              rounded
              icon
              style="margin: 5px 14px"
              @click="$emit('back-parent-folder', folder)"
            >
              <BIMDataIconArrow size="xxs" style="cursor: pointer" />
            </BIMDataButton>
            <FilesManagerBreadcrumb :file="folder" @file-clicked="$emit('file-clicked', $event)" />
          </div>
          <transition-group name="list">
            <FileUploadCard
              v-for="file of fileUploads"
              :key="file.key"
              condensed
              :project="project"
              :folder="file.folder"
              :file="file"
              @upload-completed="onUploadCompleted(file.key, $event)"
              @upload-canceled="cleanUpload(file.key, 6000)"
              @upload-failed="cleanUpload(file.key, 12000)"
            />
            <FolderUploadCard
              v-for="folder of folderUploads"
              :key="folder.key"
              condensed
              :project="project"
              :folder="folder"
              @upload-completed="onUploadCompleted(folder.key, $event)"
              @upload-canceled="cleanUpload(folder.key, 6000)"
              @upload-failed="cleanUpload(folder.key, 12000)"
            />
          </transition-group>
        </template>
        <template #cell-type="{ row: file }">
          <FileTypeCell :project="project" :file="file" />
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
        <template #column-filter-empty>
          <span class="color-granite" style="font-weight: 400">{{ $t("Tag.emptyTag") }}</span>
        </template>
        <template #cell-created_by="{ row: { created_by } }">
          {{ created_by ? `${created_by.firstname} ${created_by.lastname[0]}.` : "?" }}
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
            :loading="loadingFileIds.includes(file.id)"
            @create-model="$emit('create-model', file)"
            @delete="$emit('delete', file)"
            @download="$emit('download', file)"
            @file-clicked="$emit('file-clicked', file)"
            @manage-access="$emit('manage-access', file)"
            @open-versioning-manager="$emit('open-versioning-manager', file)"
            @open-visa-manager="$emit('open-visa-manager', file)"
            @open-tag-manager="$emit('open-tag-manager', file)"
            @remove-model="$emit('remove-model', file)"
            @update="nameEditMode[file.id] = true"
          />
        </template>
      </BIMDataTable>
      <div v-else class="files-list" >
        <div class="files-list__header">
          <div class="files-list__header__select">
            <BIMDataCheckbox :modelValue="mainSelectionCheckboxValue" @update:modelValue="onMainSelectionCheckboxClick"/>
          </div>
          <div class="files-list__header__type">
            {{ $t("t.type") }}
          </div>
          <div class="files-list__header__name">
            {{ $t("t.name") }}
          </div>
          <div class="files-list__header__created-by">
            {{ $t("t.createdBy") }}
          </div>
          <div class="files-list__header__last-update">
            {{ $t("t.modifiedOn") }}
          </div>
          <div class="files-list__header__size">
            {{ $t("t.size") }}
          </div>
          <div class="files-list__header__tags">
            {{ $t("FilesTable.headers.tags") }}
          </div>
          <div class="files-list__header__actions">
            <!-- empty -->
          </div>
        </div>
        <BIMDataList :items="displayedFiles" :itemHeight="48" class="files-list__content">
          <template #default="{ item: file, index }">
            <div class="files-list__element" :class="{ 'files-list__element--even': index % 2 === 0 }">
              <div class="files-list__element__select">
                <BIMDataCheckbox :modelValue="selection.includes(file)" @update:modelValue="onFileSelectionChange(file)"/>
              </div>
              <div class="files-list__element__type">
                <FileTypeCell :project="project" :file="file" />
              </div>
              <div class="files-list__element__name">
                <FileNameCell
                  :project="project"
                  :file="file"
                  @file-clicked="$emit('file-clicked', $event)"
                  @open-versioning-manager="$emit('open-versioning-manager', $event)"
                  :editMode="nameEditMode[file.id]"
                  @close="nameEditMode[file.id] = false"
                />
              </div>
              <div class="files-list__element__created-by">
                {{ file.created_by ? `${file.created_by.firstname} ${file.created_by.lastname[0]}.` : "?" }}
              </div>
              <div class="files-list__element__last-update">
                {{ $d(file.updated_at, "long") }}
              </div>
              <div class="files-list__element__size">
                {{ !isFolder(file) && file.size ? formatBytes(file.size) : "-" }}
              </div>
              <div class="files-list__element__tags">
                <FileTagsCell :file="file" :filesTable="filesTable" />
              </div>
              <FileActionsCell
                class="files-list__element__actions"
                :filesTable="filesTable"
                :project="project"
                :file="file"
                :loading="loadingFileIds.includes(file.id)"
                @create-model="$emit('create-model', file)"
                @delete="$emit('delete', file)"
                @download="$emit('download', file)"
                @file-clicked="$emit('file-clicked', file)"
                @manage-access="$emit('manage-access', file)"
                @open-versioning-manager="$emit('open-versioning-manager', file)"
                @open-visa-manager="$emit('open-visa-manager', file)"
                @open-tag-manager="$emit('open-tag-manager', file)"
                @remove-model="$emit('remove-model', file)"
                @update="nameEditMode[file.id] = true"
              />
            </div>
          </template>
        </BIMDataList>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import columnsDef, { columnsLG, columnsXL } from "./columns.js";
import { useStandardBreakpoints } from "../../../../composables/responsive.js";
import { isFolder } from "../../../../utils/file-structure.js";
import { formatBytes, generateFileKey } from "../../../../utils/files.js";

// Components
import FilesManagerBreadcrumb from "../files-manager/files-manager-breadcrumb/FilesManagerBreadcrumb.vue";
import FileUploadCard from "../file-upload-card/FileUploadCard.js";
import FolderUploadCard from "../file-upload-card/FolderUploadCard.js";
import FileActionsCell from "./file-actions-cell/FileActionsCell.vue";
import FileNameCell from "./file-name-cell/FileNameCell.vue";
import FileTagsCell from "./file-tags-cell/FileTagsCell.vue";
import FileTypeCell from "./file-type-cell/FileTypeCell.vue";

export default {
  components: {
    FileActionsCell,
    FileNameCell,
    FilesManagerBreadcrumb,
    FileTagsCell,
    FileTypeCell,
    FileUploadCard,
    FolderUploadCard,
  },
  props: {
    loadingFileIds: {
      type: Array,
      required: true,
    },
    project: {
      type: Object,
      required: true,
    },
    folder: {
      type: Object,
      required: true,
    },
    files: {
      type: Array,
      required: true,
    },
    filesToUpload: {
      type: Array,
    },
    foldersToUpload: {
      type: Array,
    },
    allTags: {
      type: Array,
    },
    allFiles: {
      type: Array,
    },
    filesTabs: {
      type: Array,
    },
    selectedFileTab: {
      type: Object,
    },
    selection: {
      type: Array,
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
    "open-tag-manager",
    "remove-model",
    "row-drop",
    "selection-changed",
    "tab-selected"
  ],
  setup(props, { emit }) {
    const { t } = useI18n();
    const { isLG, isXL } = useStandardBreakpoints();

    const filesTable = ref(null);

    const columns = computed(() => {
      let filteredColumns = columnsDef;
      if (isLG.value) {
        filteredColumns = columnsLG.map((id) => filteredColumns.find((col) => col.id === id));
      } else if (isXL.value) {
        filteredColumns = columnsXL.map((id) => filteredColumns.find((col) => col.id === id));
      }
      return filteredColumns.map((col) => ({
        ...col,
        label: col.label || t(col.text),
      }));
    });

    const onRowDrop = ({ event, data }) => {
      event.preventDefault();
      event.stopPropagation();
      emit("row-drop", { event, data });
    };

    let nameEditMode;
    watch(
      () => props.files,
      (files) => {
        nameEditMode = reactive({});
        files.forEach((row) => (nameEditMode[row.id] = false));
      },
      { immediate: true }
    );

    const fileUploads = ref([]);
    watch(
      () => props.filesToUpload,
      (files) => {
        fileUploads.value = fileUploads.value.concat(
          files.map((f) => Object.assign(f, { key: generateFileKey(f) }))
        );
      }
    );

    const folderUploads = ref([]);
    watch(
      () => props.foldersToUpload,
      (folders) => {
        folderUploads.value = folderUploads.value.concat(
          folders.map((f) => Object.assign(f, { key: generateFileKey(f) }))
        );
      }
    );

    const onUploadCompleted = (key, file) => {
      cleanUpload(key, 500);
      emit("file-uploaded", file);
    };

    const cleanUpload = (key, delay = 100) => {
      setTimeout(() => {
        let index = fileUploads.value.findIndex((f) => f.key === key);
        if (index >= 0) {
          fileUploads.value.splice(index, 1);
          return;
        }

        index = folderUploads.value.findIndex((f) => f.key === key);
        if (index >= 0) {
          folderUploads.value.splice(index, 1);
        }
      }, delay);
    };

    const updateFilters = (columnFilter) => {
      filters.value = filters.value.filter((filter) => filter.columnKey !== columnFilter.columnKey);
      if (columnFilter.columnFilters.length > 0) {
        filters.value.push(columnFilter);
      }
    };

    const displayedFiles = computed(() => {
      if(props.selectedFileTab.id === "folders") {
        return props.files;
      } else {
        return props.allFiles;
      }
    });

    const onFileSelectionChange = (file) => {
      let newSelection = null;
      if (props.selection.some((f) => f.id === file.id)) {
        newSelection = props.selection.filter((f) => f.id !== file.id);
      } else {
        newSelection = [...props.selection, file];
      }

      emit("selection-changed", newSelection);
    };

    const mainSelectionCheckboxValue = computed(() => {
      if (props.selection.length === 0) {
        return false;
      } else if (props.selection.length === displayedFiles.value.length) {
        return true;
      } else {
        return null;
      }
    })

    const onMainSelectionCheckboxClick = (value) => {
      let newSelection = null;
      if (value) {
        newSelection = displayedFiles.value;
      } else {
        newSelection = [];
      }

      emit("selection-changed", newSelection);
    };

    return {
      // References
      columns,
      filesTable,
      fileUploads,
      folderUploads,
      nameEditMode,
      displayedFiles,
      mainSelectionCheckboxValue,
      onMainSelectionCheckboxClick,
      // Methods
      cleanUpload,
      formatBytes,
      isFolder,
      onRowDrop,
      onUploadCompleted,
      updateFilters,
      onFileSelectionChange,
      // Responsive breakpoints
      isXL,
    };
  },
};
</script>

<style scoped lang="scss" src="./FilesTable.scss"></style>
