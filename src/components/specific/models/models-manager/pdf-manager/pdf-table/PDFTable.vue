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
      <PDFNameCell
        :project="project"
        :model="model"
        :editMode="nameEditMode[model.id]"
        @close="nameEditMode[model.id] = false"
      />
    </template>
  </GenericTable>
</template>

<script>
import { computed, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import columnsDef from "./columns.js";
// Components
import GenericTable from "@/components/generic/generic-table/GenericTable.vue";
import PDFNameCell from "./pdf-name-cell/PDFNameCell.vue";

export default {
  components: {
    GenericTable,
    PDFNameCell
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
  emits: ["archive", "delete", "download", "selection-changed", "unarchive"],
  setup(props) {
    const { t } = useI18n();

    const columns = computed(() => {
      return columnsDef.map(col => ({
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
