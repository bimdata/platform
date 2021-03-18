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

      <div class="project-models-manager__table-container">
        <GenericTable
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
                .replace(/-/g, "/")
                .replace("T", ` ${$t("Commons.at")} `)
            }}
          </template>
          <template #cell-status="{ row: { status } }">
            <ModelStatusBadge :status="status" />
          </template>
          <template #cell-actions="{ row: model }">
            <ModelActionMenu :model="model" />
          </template>
        </GenericTable>
      </div>
    </template>
  </BIMDataCard>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
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
    const { t } = useI18n();

    const tabs = ref([]);
    watchEffect(() => {
      tabs.value = [
        {
          id: "ifc",
          label: t("ProjectBoard.ProjectModelsManager.tabs.ifc")
        },
        {
          id: "split",
          label: t("ProjectBoard.ProjectModelsManager.tabs.split")
        },
        {
          id: "merge",
          label: t("ProjectBoard.ProjectModelsManager.tabs.merge")
        },
        {
          id: "archive",
          label: t("ProjectBoard.ProjectModelsManager.tabs.archive")
        }
      ];
    });

    const columns = ref([]);
    watchEffect(() => {
      columns.value = [
        {
          id: "id",
          label: t("ProjectBoard.ProjectModelsManager.table.id"),
          width: "100px",
          align: "center"
        },
        {
          id: "name",
          label: t("ProjectBoard.ProjectModelsManager.table.name")
        },
        {
          id: "version",
          label: t("ProjectBoard.ProjectModelsManager.table.version"),
          align: "center"
        },
        {
          id: "creator",
          label: t("ProjectBoard.ProjectModelsManager.table.creator"),
          align: "center"
        },
        {
          id: "lastupdate",
          label: t("ProjectBoard.ProjectModelsManager.table.lastupdate"),
          align: "center"
        },
        {
          id: "status",
          label: t("ProjectBoard.ProjectModelsManager.table.status"),
          align: "center"
        },
        {
          id: "actions",
          label: " ",
          width: "300px"
        }
      ];
    });

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
