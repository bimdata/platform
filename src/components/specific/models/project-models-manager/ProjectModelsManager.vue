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
        :tabs="tabs"
        selected="ifc"
        @tab-click="selectTab"
      />

      <ModelsActionBar
        class="project-models-manager__action-bar"
        :style="{ visibility: selection.length > 0 ? 'visible' : 'hidden' }"
        :project="project"
        :models="selection"
        @delete-clicked="() => {}"
        @archive-clicked="() => {}"
        @download-clicked="() => {}"
        @merge-clicked="() => {}"
      />

      <GenericTable
        :columns="columns"
        :rows="rows"
        :paginated="true"
        :perPage="6"
        :selectable="true"
        @selection-changed="setSelection"
        :placeholder="$t('ProjectBoard.ProjectModelsManager.tablePlaceholder')"
      >
        <template #cell-name="{ row: model }">
          <ModelNameCell
            :project="project"
            :model="model"
            :editMode="nameEditMode[model.id]"
            @close="nameEditMode[model.id] = false"
          />
        </template>
        <template #cell-version>?</template>
        <template #cell-creator="{ row: { creator } }">
          {{ creator ? `${creator.firstname} ${creator.lastname[0]}.` : "?" }}
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
        <template #cell-status="{ row: model }">
          <ModelStatusBadge :model="model" />
        </template>
        <template #cell-actions="{ row: model }">
          <ModelActionMenu
            :project="project"
            :model="model"
            @download-clicked="() => {}"
            @update-clicked="nameEditMode[model.id] = true"
            @archive-clicked="() => {}"
            @delete-clicked="() => {}"
          />
        </template>
      </GenericTable>
    </template>
  </BIMDataCard>
</template>

<script>
import { reactive, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { MODEL_SOURCE } from "@/utils/models";
// Components
import BIMDataCard from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js";
import BIMDataTabs from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataTabs.js";
import GenericTable from "@/components/generic/generic-table/GenericTable";
import ModelActionMenu from "@/components/specific/models/model-action-menu/ModelActionMenu";
import ModelNameCell from "@/components/specific/models/model-name-cell/ModelNameCell";
import ModelStatusBadge from "@/components/specific/models/model-status-badge/ModelStatusBadge";
import ModelsActionBar from "@/components/specific/models/models-action-bar/ModelsActionBar";

export default {
  components: {
    BIMDataCard,
    BIMDataTabs,
    GenericTable,
    ModelActionMenu,
    ModelNameCell,
    ModelStatusBadge,
    ModelsActionBar
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
    const currentTab = ref("ifc");
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
    const selectTab = tab => {
      currentTab.value = tab.id;
    };

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
          width: "100px",
          align: "center"
        },
        {
          id: "creator",
          label: t("ProjectBoard.ProjectModelsManager.table.creator"),
          width: "200px",
          align: "center"
        },
        {
          id: "lastupdate",
          label: t("ProjectBoard.ProjectModelsManager.table.lastupdate"),
          width: "200px",
          align: "center"
        },
        {
          id: "status",
          label: t("ProjectBoard.ProjectModelsManager.table.status"),
          width: "100px",
          align: "center"
        },
        {
          id: "actions",
          label: " ",
          width: "500px"
        }
      ];
    });

    const models = reactive({
      ifc: [],
      merge: [],
      split: [],
      archive: []
    });
    watch(
      () => props.models,
      () => {
        models.ifc = props.models.filter(model =>
          [MODEL_SOURCE.UPLOAD, MODEL_SOURCE.OPTIMIZED].includes(model.source)
        );
        models.merge = props.models.filter(
          model => model.source === MODEL_SOURCE.MERGE
        );
        models.split = props.models.filter(model =>
          [MODEL_SOURCE.SPLIT, MODEL_SOURCE.EXPORT].includes(model.source)
        );
        models.archive = props.models.filter(model => model.archived);
      },
      { immediate: true }
    );

    const rows = ref([]);
    watchEffect(() => {
      rows.value = models[currentTab.value];
    });

    const selection = ref([]);
    const setSelection = models => {
      selection.value = models;
    };

    let nameEditMode;
    watch(
      rows,
      () => {
        nameEditMode = reactive({});
        rows.value.forEach(row => (nameEditMode[row.id] = false));
      },
      { immediate: true }
    );

    return {
      // References
      columns,
      nameEditMode,
      rows,
      selection,
      tabs,
      // Methods
      selectTab,
      setSelection
    };
  }
};
</script>

<style scoped lang="scss" src="./ProjectModelsManager.scss"></style>
