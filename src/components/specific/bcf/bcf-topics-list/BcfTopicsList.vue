<template>
  <div>
    <GenericTable
      class="bcf-topics-list"
      :columns="columns"
      :rows="bcfTopics"
      rowKey="id"
      :paginated="true"
      :perPage="14"
      :rowHeight="44"
      @selection-changed="$emit('selection-changed', $event)"
    >
      <template #cell-index="{ row: bcfTopic }">
        {{ bcfTopic.index }}
      </template>
      <template #cell-priority="{ row: bcfTopic }">
        <BcfPriorityCell
          :bcfTopic="bcfTopic"
          :detailedExtensions="detailedExtensions"
        />
      </template>
      <template #cell-status="{ row: bcfTopic }">
        <BcfStatusCell
          v-if="bcfTopic.topicStatus"
          :bcfTopic="bcfTopic"
          :detailedExtensions="detailedExtensions"
        />
      </template>
      <template #cell-title="{ row: bcfTopic }">
        <BIMDataTextbox maxWidth="100%" :text="bcfTopic.title" />
      </template>
      <template #cell-creator="{ row: { creationAuthor } }">
        {{ creationAuthor }}
      </template>
      <template #cell-date="{ row: bcfTopic }">
        {{ $d(bcfTopic.creationDate, "long") }}
      </template>
      <template #cell-actions="{ row: bcfTopic }">
        <BcfActionsCell
          :bcfTopic="bcfTopic"
          :detailedExtensions="detailedExtensions"
        />
      </template>
    </GenericTable>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import columnsDef from "./columns";

import GenericTable from "@/components/generic/generic-table/GenericTable.vue";

import BcfPriorityCell from "./bcf-priority-cell/BcfPriorityCell.vue";
import BcfStatusCell from "./bcf-status-cell/BcfStatusCell.vue";
import BcfActionsCell from "./bcf-actions-cell/BcfActionsCell.vue";

export default {
  components: {
    GenericTable,
    BcfPriorityCell,
    BcfStatusCell,
    BcfActionsCell
  },
  props: {
    bcfTopics: {
      type: Array,
      required: true
    },
    detailedExtensions: {
      type: Object,
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
          label: col.label || t(`BcfTopicsList.headers.${col.id}`)
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
