<template>
  <GenericTable
    class="models-table"
    :columns="columns"
    :rows="models"
    :paginated="true"
    :perPage="7"
    :selectable="true"
    @selection-changed="$emit('selection-changed', $event)"
    :placeholder="$t('ModelsTable.emptyTablePlaceholder')"
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
      {{ version ? version : "-" }}
    </template>
    <template #cell-creator="{ row: { creator } }">
      {{ creator ? `${creator.firstname} ${creator.lastname[0]}.` : "?" }}
    </template>
    <template #cell-lastupdate="{ row: model }">
      <ModelLastUpdateCell :model="model" />
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
        @update="nameEditMode[model.id] = true"
      />
    </template>
  </GenericTable>
</template>

<script>
import { reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import columnsDef from "./columns";
// Components
import GenericTable from "@/components/generic/generic-table/GenericTable";
import ModelActionsCell from "./model-actions-cell/ModelActionsCell";
import ModelLastUpdateCell from "./model-last-update-cell/ModelLastUpdateCell";
import ModelNameCell from "./model-name-cell/ModelNameCell";
import ModelStatusCell from "./model-status-cell/ModelStatusCell";

export default {
  components: {
    GenericTable,
    ModelActionsCell,
    ModelLastUpdateCell,
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
    "selection-changed"
  ],
  setup(props) {
    const { locale, t } = useI18n();

    const columns = ref([]);
    watch(
      () => locale.value,
      () => {
        columns.value = columnsDef.map(col => ({
          ...col,
          label: col.label || t(`ModelsTable.headers.${col.id}`)
        }));
      },
      { immediate: true }
    );

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
