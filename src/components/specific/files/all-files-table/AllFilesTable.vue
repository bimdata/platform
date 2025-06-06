<template>
  <div class="files-table files-list">
    <div class="files-list__header">
      <div class="files-list__header__select">
        <BIMDataCheckbox
          :modelValue="mainSelectionCheckboxValue"
          @update:modelValue="onMainSelectionCheckboxClick"
        />
      </div>
      <div class="files-list__header__type" v-if="columns.some((column) => column.id === 'type')">
        {{ $t(columnsDef[0].text) }}
        <ColumnSorting
          :sortOrder="
            !sortObject.order || sortObject.column !== columnsDef[0] ? 'asc' : sortObject.order
          "
          :index="0"
          :active="activeHeadercolumnKey === 0"
          @click="toggleSorting(columnsDef[0])"
          @set-active="activeHeadercolumnKey = $event"
        />
      </div>
      <div class="files-list__header__name">
        {{ $t(columnsDef[1].text) }}
        <ColumnSorting
          :sortOrder="
            !sortObject.order || sortObject.column !== columnsDef[1] ? 'asc' : sortObject.order
          "
          :index="1"
          :active="activeHeadercolumnKey === 1"
          @click="toggleSorting(columnsDef[1])"
          @set-active="activeHeadercolumnKey = $event"
        />
      </div>
      <div
        class="files-list__header__created-by"
        v-if="columns.some((column) => column.id === 'created_by')"
      >
        {{ $t(columnsDef[2].text) }}
        <div v-if="columnsDef[2].filter" v-click-away="() => awayFromFilter(columnsDef[2])">
          <BIMDataButton
            color="primary"
            ghost
            rounded
            icon
            class="m-l-6"
            :class="{
              active: filters.some((filter) => filter.columnKey === columnsDef[2].id),
            }"
            @click="toggleFiltersMenu(columnsDef[2])"
          >
            <BIMDataIconCaret size="xxxs" fill color="default" />
          </BIMDataButton>
          <ColumnFilters
            v-if="displayedColumnFilterId === columnsDef[2].id"
            :column="columnsDef[2]"
            :columnData="allFiles.map((file) => file[columnsDef[2].id])"
            :filters="
              filters.find((filter) => filter.columnKey === columnsDef[2].id)?.columnFilters ?? []
            "
            @filter="updateFilters(columnsDef[2], $event)"
          >
            <template #column-filter-empty>
              <span class="color-granite" style="font-weight: 400">{{ $t("Tag.emptyTag") }}</span>
            </template>
          </ColumnFilters>
        </div>
      </div>
      <div
        class="files-list__header__last-update"
        v-if="columns.some((column) => column.id === 'lastupdate')"
      >
        {{ $t(columnsDef[3].text) }}
        <ColumnSorting
          :sortOrder="
            !sortObject.order || sortObject.column !== columnsDef[3] ? 'asc' : sortObject.order
          "
          :index="3"
          :active="activeHeadercolumnKey === 3"
          @click="toggleSorting(columnsDef[3])"
          @set-active="activeHeadercolumnKey = $event"
        />
      </div>
      <div
        class="files-list__header__location"
        v-if="columns.some((column) => column.id === 'location')"
      >
      {{ $t(columnsDef[4].text) }}
      </div>
      <div class="files-list__header__size" v-if="columns.some((column) => column.id === 'size')">
        {{ $t(columnsDef[5].text) }}
        <ColumnSorting
          :sortOrder="
            !sortObject.order || sortObject.column !== columnsDef[5] ? 'asc' : sortObject.order
          "
          :index="5"
          :active="activeHeadercolumnKey === 5"
          @click="toggleSorting(columnsDef[5])"
          @set-active="activeHeadercolumnKey = $event"
        />
      </div>
      <div class="files-list__header__tags" v-if="columns.some((column) => column.id === 'tags')">
        {{ $t(columnsDef[6].text) }}
        <div v-if="columnsDef[6].filter" v-click-away="() => awayFromFilter(columnsDef[6])">
          <BIMDataButton
            color="primary"
            ghost
            rounded
            icon
            class="m-l-6"
            :class="{
              active: filters.some((filter) => filter.columnKey === columnsDef[6].id),
            }"
            @click="toggleFiltersMenu(columnsDef[6])"
          >
            <BIMDataIconCaret size="xxxs" fill color="default" />
          </BIMDataButton>
          <ColumnFilters
            v-if="displayedColumnFilterId === columnsDef[6].id"
            :column="columnsDef[6]"
            :columnData="allFiles.map((file) => file[columnsDef[6].id])"
            :filters="
              filters.find((filter) => filter.columnKey === columnsDef[6].id)?.columnFilters ?? []
            "
            @filter="updateFilters(columnsDef[6], $event)"
          >
            <template #column-filter-empty>
              <span class="color-granite" style="font-weight: 400">{{ $t("Tag.emptyTag") }}</span>
            </template>
          </ColumnFilters>
        </div>
      </div>
      <div class="files-list__header__actions">
        <!-- empty -->
      </div>
    </div>
    <template v-if="displayedListFiles.length === 0">
      <div class="files-list__empty">
        {{ $t("t.emptyFile") }}
      </div>
    </template>

    <BIMDataList
      :items="displayedListFiles"
      :itemHeight="48"
      class="files-list__content"
      ref="filesList"
    >
      <template #default="{ item: file, index }">
        <div class="files-list__element" :class="{ 'files-list__element--even': index % 2 === 0 }">
          <div class="files-list__element__select">
            <BIMDataCheckbox
              :modelValue="selection.includes(file)"
              @update:modelValue="onFileSelectionChange(file)"
            />
          </div>
          <div
            class="files-list__element__type"
            v-if="columns.some((column) => column.id === 'type')"
          >
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
          <div
            class="files-list__element__created-by"
            v-if="columns.some((column) => column.id === 'created_by')"
          >
            {{
              file.created_by ? `${file.created_by.firstname} ${file.created_by.lastname[0]}.` : "?"
            }}
          </div>
          <div
            class="files-list__element__last-update"
            v-if="columns.some((column) => column.id === 'lastupdate')"
          >
            {{ $d(file.updated_at, "long") }}
          </div>
          <div
            class="files-list__element__location"
            v-if="columns.some((column) => column.id === 'location')"
          >
            <FilePathCell
              :file="file"
              :allFolders="allFolders"
              @go-folders-view="$emit('go-folders-view')"
              @file-clicked="$emit('file-clicked', $event)"
            />
          </div>
          <div
            class="files-list__element__size"
            v-if="columns.some((column) => column.id === 'size')"
          >
            {{ formatBytes(file.size) }}
          </div>
          <div
            class="files-list__element__tags"
            v-if="columns.some((column) => column.id === 'tags')"
          >
            <div>
              <FileTagsCell :file="file" :parent="filesList" />
            </div>
          </div>
          <div class="files-list__element__actions">
            <FileActionsCell
              :parent="filesList"
              :project="project"
              :file="file"
              :loading="loadingFileIds.includes(file.id)"
              @create-model="$emit('create-model', file)"
              @create-photosphere="$emit('create-photosphere', file)"
              @delete="$emit('delete', file)"
              @download="$emit('download', file)"
              @file-clicked="$emit('file-clicked', file)"
              @manage-access="$emit('manage-access', file)"
              @open-tag-manager="$emit('open-tag-manager', file)"
              @open-versioning-manager="$emit('open-versioning-manager', file)"
              @open-visa-manager="$emit('open-visa-manager', file)"
              @remove-model="$emit('remove-model', file)"
              @update="nameEditMode[file.id] = true"
            />
          </div>
        </div>
      </template>
    </BIMDataList>
  </div>
</template>
<script>
import { computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import columnsDef, { columnsMD, columnsLG, columnsXL, columnsXXL } from "./columns.js";
import { useStandardBreakpoints } from "../../../../composables/responsive.js";
import { formatBytes } from "../../../../utils/files.js";
import useSortAndFilter from "./sortAndFilter.js";

// Components
import ColumnSorting from "@bimdata/design-system/src/BIMDataComponents/BIMDataTable/column-sorting/ColumnSorting.vue";
import ColumnFilters from "@bimdata/design-system/src/BIMDataComponents/BIMDataTable/column-filters/ColumnFilters.vue";
import FileActionsCell from "../files-table/file-actions-cell/FileActionsCell.vue";
import FileNameCell from "../files-table/file-name-cell/FileNameCell.vue";
import FileTagsCell from "../files-table/file-tags-cell/FileTagsCell.vue";
import FileTypeCell from "../files-table/file-type-cell/FileTypeCell.vue";
import FilePathCell from "../files-table/file-path-cell/FilePathCell.vue";

export default {
  components: {
    FileActionsCell,
    FileNameCell,
    FileTagsCell,
    FileTypeCell,
    FilePathCell,
    ColumnSorting,
    ColumnFilters,
  },
  props: {
    selection: {
      type: Array,
    },
    files: {
      type: Array,
      required: true,
    },
    allFiles: {
      type: Array,
    },
    allFolders: {
      type: Array,
    },
    project: {
      type: Object,
      required: true,
    },
    loadingFileIds: {
      type: Array,
      required: true,
    },
  },
  emits: [
    "create-model",
    "create-photosphere",
    "delete",
    "download",
    "file-clicked",
    "go-folders-view",
    "manage-access",
    "open-tag-manager",
    "open-versioning-manager",
    "open-visa-manager",
    "remove-model",
    "selection-changed",
  ],
  setup(props, { emit }) {
    const { t } = useI18n();
    const { isMD, isLG, isXL, isXXL } = useStandardBreakpoints();

    const filesList = ref(null);

    const columns = computed(() => {
      let filteredColumns = columnsDef;
      if (isMD.value) {
        filteredColumns = columnsMD.map((id) => filteredColumns.find((col) => col.id === id));
      } else if (isLG.value) {
        filteredColumns = columnsLG.map((id) => filteredColumns.find((col) => col.id === id));
      } else if (isXL.value) {
        filteredColumns = columnsXL.map((id) => filteredColumns.find((col) => col.id === id));
      } else if (isXXL.value) {
        filteredColumns = columnsXXL.map((id) => filteredColumns.find((col) => col.id === id));
      }
      return filteredColumns.map((col) => ({
        ...col,
      }));
    });

    let nameEditMode;
    watch(
      () => props.files,
      (files) => {
        nameEditMode = reactive({});
        files.forEach((row) => (nameEditMode[row.id] = false));
      },
      { immediate: true }
    );

    const {
      sortObject,
      displayedColumnFilterId,
      toggleFiltersMenu,
      toggleSorting,
      awayFromFilter,
      displayedRows: displayedListFiles,
      updateFilters,
      activeHeadercolumnKey,
      filters,
    } = useSortAndFilter(computed(() => props.allFiles));

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
      } else if (props.selection.length === props.allFiles.length) {
        return true;
      } else {
        return null;
      }
    });
    const onMainSelectionCheckboxClick = (value) => {
      let newSelection = null;
      if (value) {
        newSelection = props.allFiles;
      } else {
        newSelection = [];
      }

      emit("selection-changed", newSelection);
    };

    return {
      // References
      columns,
      mainSelectionCheckboxValue,
      nameEditMode,
      // Methods
      formatBytes,
      updateFilters,
      onFileSelectionChange,
      // List
      filesList,
      sortObject,
      mainSelectionCheckboxValue,
      onMainSelectionCheckboxClick,
      activeHeadercolumnKey,
      toggleSorting,
      displayedListFiles,
      columnsDef,
      displayedColumnFilterId,
      toggleFiltersMenu,
      awayFromFilter,
      filters,
    };
  },
};
</script>

<style scoped lang="scss" src="./AllFilesTable.scss"></style>
