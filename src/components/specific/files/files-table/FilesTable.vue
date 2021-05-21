<template>
  <GenericTable
    class="files-table"
    :columns="columns"
    :rows="files"
    :selectable="true"
    :placeholder="$t('FilesTable.emptyTablePlaceholder')"
  >
    <!-- TODO -->
  </GenericTable>
</template>

<script>
import { ref } from "@vue/reactivity";
import { watchEffect } from "@vue/runtime-core";
import { useI18n } from "vue-i18n";
// Components
import GenericTable from "@/components/generic/generic-table/GenericTable";

export default {
  components: {
    GenericTable
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    files: {
      type: Array,
      required: true
    }
  },
  setup() {
    const { t } = useI18n();

    const columns = ref([]);
    watchEffect(() => {
      columns.value = [
        {
          id: "name",
          label: t("FilesTable.headers.name")
        },
        {
          id: "type",
          label: t("FilesTable.headers.type"),
          width: "100px",
          align: "center"
        },
        {
          id: "creator",
          label: t("FilesTable.headers.creator"),
          width: "200px",
          align: "center"
        },
        {
          id: "tags",
          label: t("FilesTable.headers.tags"),
          width: "200px"
        },
        {
          id: "lastupdate",
          label: t("FilesTable.headers.lastupdate"),
          width: "200px",
          align: "center"
        },
        {
          id: "size",
          label: t("FilesTable.headers.size"),
          width: "100px",
          align: "center"
        },
        {
          id: "actions",
          label: " ",
          width: "100px",
          align: "center"
        }
      ];
    });

    return {
      columns
    };
  }
};
</script>
