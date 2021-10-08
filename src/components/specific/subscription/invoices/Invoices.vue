<template>
  <div class="platform-subscription__content__invoices">
    <h2>{{ $t("Invoices.invoicesTitle") }}</h2>
    <BIMDataCard>
      <template #content>
        <GenericTable
          class="invoice-table"
          :columns="columns"
          :rows="invoices"
          :paginated="true"
          :perPage="7"
          :placeholder="$t('Invoices.emptyTablePlaceholder')"
        >
          <template #cell-space="{ row: invoice }">
            {{ subscriptionsMap[invoice.subscription_id].cloud.name }}</template
          >
          <template #cell-date="{ row: invoice }">
            {{ formatDate(invoice.payout_date) }}
          </template>
          <template #cell-status="{ row: invoice }">
            <span :class="`invoice-status-cell--${invoice.is_paid}`">
              {{ invoice.is_paid === 1 ? "Completed" : "Pending" }}
            </span>
          </template>
          <template #cell-amount="{ row: invoice }">
            {{ invoice.amount }}
            <span> {{ invoice.currency === "EUR" ? "€" : "£" }} </span>
          </template>
          <template #cell-actions="{ row: invoice }">
            <a
              v-if="invoice.receipt_url"
              :href="invoice.receipt_url"
              target="_blank"
              class="
                bimdata-btn bimdata-btn__ghost bimdata-btn__ghost--default
                invoice-actions-cell__menu__btn
              "
            >
              {{ $t("Invoices.downloadInvoice") }}</a
            >
            <!-- <InvoiceDetailsActionsCell :invoice="invoice" /> -->
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
import { formatDate } from "@/utils/date.js";

// Components
import GenericTable from "@/components/generic/generic-table/GenericTable";
// import InvoiceDetailsActionsCell from "./InvoicesDetailsActionsCell.vue";
export default {
  components: {
    GenericTable
    // InvoiceDetailsActionsCell
  },
  props: {
    invoices: {
      type: Array,
      required: true
    },
    subscriptions: {
      type: Array,
      required: true
    }
  },
  setup(props) {
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

    const subscriptionsMap = props.subscriptions.reduce((acc, subscription) => {
      acc[subscription.subscription_id] = subscription;
      return acc;
    }, {});

    return {
      columns,
      formatDate,
      subscriptionsMap
    };
  }
};
</script>

<style scoped lang="scss" src="./Invoices.scss"></style>
