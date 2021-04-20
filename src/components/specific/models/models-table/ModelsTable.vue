<template>
  <GenericTable
    class="models-table"
    :columns="columns"
    :rows="models"
    :paginated="true"
    :perPage="6"
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
      {{ version ? version : "" }}
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
        @archive-clicked="$emit('archive-clicked', $event)"
        @delete-clicked="$emit('delete-clicked', $event)"
        @download-clicked="$emit('download-clicked', $event)"
        @update-clicked="nameEditMode[model.id] = true"
      />
    </template>
  </GenericTable>
</template>

<script>
import { reactive, ref, watch, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
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
    "archive-clicked",
    "delete-clicked",
    "download-clicked",
    "selection-changed"
  ],
  setup(props) {
    const { t } = useI18n();

    const columns = ref([]);
    watchEffect(() => {
      columns.value = [
        {
          id: "id",
          label: t("ModelsTable.headers.id"),
          width: "100px",
          align: "center"
        },
        {
          id: "name",
          label: t("ModelsTable.headers.name")
        },
        {
          id: "version",
          label: t("ModelsTable.headers.version"),
          width: "100px",
          align: "center"
        },
        {
          id: "creator",
          label: t("ModelsTable.headers.creator"),
          width: "200px",
          align: "center"
        },
        {
          id: "lastupdate",
          label: t("ModelsTable.headers.lastupdate"),
          width: "200px",
          align: "center"
        },
        {
          id: "status",
          label: t("ModelsTable.headers.status"),
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
