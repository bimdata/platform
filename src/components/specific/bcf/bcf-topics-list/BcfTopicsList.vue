<template>
  <GenericTable
    class="bcf-topics-list"
    :columns="columns"
    :rows="bcfTopics"
    rowKey="id"
    :paginated="true"
    :perPage="13"
    :rowHeight="44"
    @selection-changed="$emit('selection-changed', $event)"
    :placeholder="$t('FilesTable.emptyTablePlaceholder')"
  >
    <template #cell-priority="{ row: bcfTopic }">
      <BcfPriorityCell :bcfTopic="bcfTopic" />
    </template>
    <template #cell-title="{ row: bcfTopic }">
      <BIMDataTextBox maxWidth="500px" :text="bcfTopic.title" />
    </template>
    <template #cell-creator="{ row: { creationAuthor } }">
      {{ creationAuthor }}
    </template>
    <template #cell-date="{ row: bcfTopic }">
      {{ $d(bcfTopic.creationDate, "long") }}
    </template>
    <template #cell-actions="{ row: bcfTopic }">
      <BIMDataButton color="primary" outline radius> Ouvrir </BIMDataButton>
    </template>
  </GenericTable>
</template>

<script>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import columnsDef from "./columns";
import GenericTable from "@/components/generic/generic-table/GenericTable";

import BcfPriorityCell from "./bcf-priority-cell/BcfPriorityCell.vue";

export default {
  components: {
    GenericTable,
    BcfPriorityCell
  },
  props: {
    bcfTopics: {
      type: Array,
      required: true
    }
  },
  setup() {
    const { locale, t } = useI18n();

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
    return {
      columns
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicsList.scss"></style>
