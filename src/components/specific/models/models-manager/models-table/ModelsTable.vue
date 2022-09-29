<template>
  <GenericTable
    class="models-table"
    data-test-id="models-table"
    :columns="columns"
    :rows="models"
    :paginated="true"
    :perPage="7"
    :selectable="true"
    @selection-changed="$emit('selection-changed', $event)"
  >
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
        @edit="$emit('edit', $event)"
      />
    </template>

    <template #placeholder>
      <slot name="placeholder">
        {{ $t("ModelsTable.emptyTablePlaceholder.text") }}
      </slot>
    </template>
  </GenericTable>
</template>

<script>
import { computed, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import columnsDef from "./columns.js";
import { useStandardBreakpoints } from "../../../../../composables/responsive.js";
// Components
import GenericTable from "../../../../generic/generic-table/GenericTable.vue";
import ModelActionsCell from "./model-actions-cell/ModelActionsCell.vue";
import ModelNameCell from "./model-name-cell/ModelNameCell.vue";
import ModelStatusCell from "./model-status-cell/ModelStatusCell.vue";

export default {
  components: {
    GenericTable,
    ModelActionsCell,
    ModelNameCell,
    ModelStatusCell
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    models: {
      type: Array,
      required: true
    }
  },
  emits: [
    "archive",
    "delete",
    "download",
    "selection-changed",
    "unarchive",
    "edit"
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
        label: col.label || t(`ModelsTable.headers.${col.id}`)
      }));
    });

    let nameEditMode;
    watch(
      () => props.models,
      () => {
        nameEditMode = reactive({});
        props.models.forEach(row => (nameEditMode[row.id] = false));
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
