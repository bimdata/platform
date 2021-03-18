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
        class="project-models-manager__table"
        :columns="columns"
        :rows="rows"
        :selectable="true"
        @selection-change="() => {}"
      >
        <template #cell-version>?</template>
        <template #cell-creator="{ row: { creator } }">
          {{ creator ? `${creator.firstname} ${creator.lastname[0]}.` : "" }}
        </template>
        <template #cell-lastupdate="{ row: { updatedAt } }">
          {{
            updatedAt
              .toISOString()
              .slice(0, -5)
              .replace("T", " at ")
          }}
        </template>
        <template #cell-status="{ row: { status } }">
          <ModelStatusBadge :status="status" />
        </template>
        <template #cell-actions="{ row: model }">
          <ModelActionMenu :model="model" />
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
import ModelActionMenu from "@/components/specific/models/model-action-menu/ModelActionMenu";
import ModelStatusBadge from "@/components/specific/models/model-status-badge/ModelStatusBadge";

export default {
  components: {
    BIMDataCard,
    BIMDataTabs,
    GenericTable,
    ModelActionMenu,
    ModelStatusBadge
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
      { id: "id", label: "ID", width: "100px", align: "center" },
      { id: "name", label: "Nom" },
      { id: "version", label: "Version", align: "center" },
      { id: "creator", label: "Creator", align: "center" },
      { id: "lastupdate", label: "Modifié le", align: "center" },
      { id: "status", label: "Statut", align: "center" },
      { id: "actions", label: " ", width: "300px" }
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
