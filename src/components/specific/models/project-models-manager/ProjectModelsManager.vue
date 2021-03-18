<template>
  <BIMDataCard
    class="project-models-manager"
    :titleHeader="$t('ProjectBoard.ProjectModelsManager.title')"
  >
    <template #content>
      <BIMDataTabs
        width="100%"
        height="44px"
        tabSize="180px"
        selected="ifc"
        :tabs="tabs"
      />

      <GenericTable
        :columns="columns"
        :rows="rows"
        :selectable="true"
        @selection-change="() => {}"
      >
        <template #cell-version>0</template>
        <template #cell-creator="{ row: { creator } }">
          {{ creator ? `${creator.firstname} ${creator.lastname[0]}.` : "" }}
        </template>
        <template #cell-lastupdate="{ row: model }">
          {{ model.updatedAt.toISOString().slice(0, -5) }}
        </template>
        <template #cell-status="{ row: model }">
          {{ model.status }}
        </template>
      </GenericTable>
    </template>
  </BIMDataCard>
</template>

<script>
import { ref, watchEffect } from "vue";
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import BIMDataTabs from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTabs.js";
import GenericTable from "@/components/generic/generic-table/GenericTable";

export default {
  components: {
    BIMDataCard,
    // BIMDataTable,
    BIMDataTabs,
    GenericTable
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
  setup(props) {
    const tabs = [
      { id: "ifc", label: "IFC" },
      { id: "split", label: "Split / Export" },
      { id: "merge", label: "Merge" },
      { id: "archive", label: "Archives" }
    ];

    const columns = [
      { id: "id", label: "ID" },
      { id: "name", label: "Nom" },
      { id: "version", label: "Version" },
      { id: "creator", label: "Creator" },
      { id: "lastupdate", label: "Modifié le" },
      { id: "status", label: "Statut" }
    ];
    const rows = ref([]);
    watchEffect(() => {
      rows.value = props.models;
    });

    return {
      // References
      columns,
      rows,
      tabs
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectModelsManager.scss"></style>
