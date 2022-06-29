<template>
  <GenericTable
    class="models-table"
    :columns="columns"
    :rows="models"
    :paginated="true"
    :perPage="7"
    :selectable="true"
    @selection-changed="$emit('selection-changed', $event)"
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
      {{ version ? version : "-" }}
    </template>
    <template #cell-creator="{ row: { creator } }">
      {{ creator ? `${creator.firstname} ${creator.lastname[0]}.` : "?" }}
    </template>
    <template #cell-lastupdate="{ row: model }">
      {{ $d(model.updatedAt, "long") }}
    </template>
    <template #cell-status="{ row: model }">
      <ModelStatusCell :project="project" :model="model" />
    </template>
    <template #cell-actions="{ row: model }">
      <ModelActionsCell
        :project="project"
        :model="model"
        @archive="$emit('archive', $event)"
        @delete="$emit('delete', $event)"
        @download="$emit('download', $event)"
        @unarchive="$emit('unarchive', $event)"
        @update="nameEditMode[model.id] = true"
      />
    </template>
    <template #placeholderSlot>
      <template v-if="modelType === MODEL_TYPE.PDF && !allModelsCounter">
        <div class="models-table__pdf-placeholder">
          <div
            class="models-table__pdf-placeholder__circle"
            :style="`background: ${background}`"
          >
            <BIMDataFileIcon
              class="models-table__pdf-placeholder__circle__file-icon"
              fileName=".pdf"
              :size="20"
            />
          </div>
          <div class="models-table__pdf-placeholder__content">
            {{ $t("ModelsTable.emptyTablePlaceholder.textPdf") }}
          </div>
        </div>
      </template>
      <template v-else>
        {{ $t("ModelsTable.emptyTablePlaceholder.text") }}
      </template>
    </template>
  </GenericTable>
</template>

<script>
import { computed, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import columnsDef from "./columns.js";
import { MODEL_TYPE } from "@/config/models.js";
// Components
import GenericTable from "@/components/generic/generic-table/GenericTable.vue";
import ModelActionsCell from "./model-actions-cell/ModelActionsCell.vue";
import ModelNameCell from "./model-name-cell/ModelNameCell.vue";
import ModelStatusCell from "./model-status-cell/ModelStatusCell.vue";

export default {
  components: {
    GenericTable,
    ModelActionsCell,
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
    },
    allModelsCounter: {
      type: Number,
      required: true
    },
    modelType: {
      type: String,
      required: false
    }
  },
  emits: ["archive", "delete", "download", "selection-changed", "unarchive"],
  setup(props) {
    const { locale, t } = useI18n();

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

    const background = computed(
      () =>
        `var(--color-silver-light) url("/static/modelsManager/menuAnimation/${
          ["fr", "en", "de", "es", "it"].find(lang => lang === locale.value) ||
          "en"
        }.gif") no-repeat 11% 143% / 79%`
    );

    return {
      // References
      columns,
      background,
      MODEL_TYPE,
      nameEditMode
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsTable.scss"></style>
