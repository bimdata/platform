<template>
  <BIMDataTable
    class="models-table"
    data-test-id="models-table"
    tableLayout="fixed"
    :columns="columns"
    :rows="models"
    rowKey="id"
    :paginated="true"
    :perPage="7"
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
import { computed, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import columnsDef from "./columns.js";
import { useStandardBreakpoints } from "../../../../composables/responsive.js";
// Components
import FileUploadCard from "../../files/file-upload-card/FileUploadCard.js";
import ModelActionsCell from "./model-actions-cell/ModelActionsCell.vue";
import ModelNameCell from "./model-name-cell/ModelNameCell.vue";
import ModelStatusCell from "./model-status-cell/ModelStatusCell.vue";

export default {
  components: {
    ModelActionsCell,
    ModelNameCell,
    ModelStatusCell,
    FileUploadCard
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    models: {
      type: Array,
      required: true
    },
    fileUploads: {
      type: Array,
      default: () => [],
    }
  },
  emits: [
    "archive",
    "delete",
    "download",
    "edit-metaBuilding",
    "file-uploaded",
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

    const columns = computed(() => {
      let filteredColumns = columnsDef;
      if (isLG.value) {
        filteredColumns = filteredColumns.filter(col =>
          ["name", "status", "actions"].includes(col.id)
        );
      } else if (isXL.value) {
        filteredColumns = filteredColumns.filter(col =>
          ["name", "creator", "lastupdate", "status", "actions"].includes(
            col.id
          )
        );
      }
      return filteredColumns.map(col => ({
        ...col,
        label: col.label ?? t(col.text)
      }));
    });

    let nameEditMode;
    watch(
      () => props.models,
      () => {
        nameEditMode = reactive({});
        props.models.forEach(model => (nameEditMode[model.id] = false));
      },
      { immediate: true }
    );

    return {
      // References
      columns,
      nameEditMode,
    };
  }
};
</script>

<style scoped>
.models-table {
  .file-uploads {
    position: absolute;
    z-index: 1;
    width: 100%;
    background-color: var(--color-white);
    box-shadow: var(--box-shadow);
  }
}
</style>
