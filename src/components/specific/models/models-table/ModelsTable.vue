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
      <transition v-if="fileUpload" name="fade">
        <FileUploadCard
          class="m-b-6"
          condensed
          :project="project"
          :file="fileUpload"
          @upload-completed="$emit('file-uploaded', $event)"
        />
      </transition>
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
        @edit-metaBuilding="$emit('edit-metaBuilding', $event)"
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
    fileUpload: {
      type: Object
    }
  },
  emits: [
    "archive",
    "delete",
    "download",
    "edit-metaBuilding",
    "file-uploaded",
    "selection-changed",
    "unarchive"
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
        label: col.label || t(col.text)
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
      nameEditMode
    };
  }
};
</script>
