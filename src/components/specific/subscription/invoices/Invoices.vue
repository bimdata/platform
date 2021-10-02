<template>
  <div class="platform-subscription__content__invoices">
    <h2>{{ $t("Invoices.invoicesTitle") }}</h2>
    <BIMDataCard>
      <template #content>
        <GenericTable
          class="billing-table"
          :columns="columns"
          :rows="invoices"
          :paginated="true"
          :perPage="7"
          :placeholder="$t('Invoices.emptyTablePlaceholder')"
        >
          <template #cell-version="{ row: { version } }">
            {{ version ? version : "-" }}
          </template>
        </GenericTable>
      </template>
    </BIMDataCard>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import columnsDef from "./columns";
// Components
import GenericTable from "@/components/generic/generic-table/GenericTable";
export default {
  components: {
    GenericTable
  },
  props: {
    invoices: {
      type: Array,
      required: true
    },
    empty: {
      type: Boolean,
      default: false
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
          label: col.label || t(`Invoices.headers.${col.id}`)
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
