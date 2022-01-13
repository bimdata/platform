<template>
  <div>
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
        <BIMDataButton
          color="primary"
          outline
          radius
          @click="openBcfTopic(bcfTopic.guid)"
        >
          Ouvrir
        </BIMDataButton>
        <SidePanel :title="bcfTopic.title">
          <OpenTopicIssue :bcfTopic="bcfTopic" />
        </SidePanel>
      </template>
    </GenericTable>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useSidePanel } from "@/composables/side-panel.js";

import columnsDef from "./columns";
import OpenTopicIssue from "./open-topic-issue/OpenTopicIssue.vue";

import SidePanel from "@/components/generic/side-panel/SidePanel.vue";
import GenericTable from "@/components/generic/generic-table/GenericTable.vue";

import BcfPriorityCell from "./bcf-priority-cell/BcfPriorityCell.vue";

export default {
  components: {
    GenericTable,
    BcfPriorityCell,
    SidePanel,
    OpenTopicIssue
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
    const { openSidePanel } = useSidePanel();
    return {
      columns,
      // Methods
      openBcfTopic: openSidePanel
    };
  }
};
</script>

<style scoped lang="scss" src="./BcfTopicsList.scss"></style>
