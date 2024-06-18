<template>
  <BIMDataTable
    tableLayout="fixed"
    :columns="columns"
    :rows="visas"
    rowKey="id"
    :rowHeight="48"
    :selectable="true"
  >
    <template #cell-validation="{ row: visa }">
      {{ visa.document.name }}
    </template>
    <template #cell-file="{ row: visa }">
      {{ visa.document.name }}
    </template>
    <template #cell-validator="{ row: visa }">
      <span v-for="validator in visa.validations.validator">
        {{ validator }}
        {{ validator.firstname }} {{ validator.lastname }}
      </span>
    </template>
    <template #cell-due_date="{ row: visa }">
      {{ visa.deadline }}
    </template>
    <template #cell-status="{ row: visa }">
      {{ visa.status }}
    </template>
    <template #cell-buttons="{ row: visa }">
      <button>ouvrir</button>
    </template>
  </BIMDataTable>
</template>

<script>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import columnsDef from "./columns.js";
export default {
  props: {
    visas: {
      type: Array,
      required: true
    }
  },
  setup() {
    const { t } = useI18n();

    const columns = computed(() => {
      return columnsDef.map(col => ({
        ...col,
        label: col.label || t(col.text)
      }));
    });
    return {
      columns
    };
  }
};
</script>