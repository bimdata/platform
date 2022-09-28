<template>
  <div class="invoices-table">
    <h2>
      {{ $t("InvoicesTable.title") }}
    </h2>

    <BIMDataCard class="invoices-table__table" v-if="payments.length > 0">
      <template #content>
        <GenericTable
          :columns="columns"
          :rows="displayedPayments"
          :paginated="true"
          :perPage="7"
        >
          <template #cell-space="{ row: payment }">
            <AppLink
              v-if="payment.subscription.cloud"
              :to="{
                name: routeNames.spaceBoard,
                params: {
                  spaceID: payment.subscription.cloud.id
                }
              }"
            >
              <BIMDataTextbox
                maxWidth="300px"
                :text="payment.subscription.cloud.name"
              />
            </AppLink>
          </template>
          <template #cell-date="{ row: payment }">
            {{ $d(payment.payout_date, "short") }}
          </template>
          <template #cell-status="{ row: payment }">
            <InvoiceStatusCell :invoice="payment" />
          </template>
          <template #cell-amount="{ row: payment }">
            {{ payment.amount }}
            {{ payment.currency === "EUR" ? "€" : "£" }}
          </template>
          <template #cell-actions="{ row: payment }">
            <InvoiceActionsCell :payment="payment" />
          </template>
        </GenericTable>
      </template>
    </BIMDataCard>

    <BIMDataCard class="invoices-table__empty" v-else>
      <template #content>
        <InvoicesTableEmptyImage class="m-b-24" />
        <p>
          {{ $t("InvoicesTable.emptyTableText") }}
        </p>
        <AppLink :to="{ name: routeNames.subscriptionPro }">
          <BIMDataButton class="m-t-18" color="primary" fill radius>
            {{ $t("InvoicesTable.subscribeButton") }}
          </BIMDataButton>
        </AppLink>
      </template>
    </BIMDataCard>
  </div>
</template>

<script>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import routeNames from "../../../../router/route-names.js";
import columnsDef from "./columns.js";
// Components
import GenericTable from "../../../generic/generic-table/GenericTable.vue";
import AppLink from "../../app/app-link/AppLink.vue";
import InvoiceActionsCell from "./invoice-actions-cell/InvoiceActionsCell.vue";
import InvoiceStatusCell from "./invoice-status-cell/InvoiceStatusCell.vue";

export default {
  components: {
    GenericTable,
    AppLink,
    InvoiceActionsCell,
    InvoiceStatusCell
  },
  props: {
    subscriptions: {
      type: Array,
      required: true
    },
    payments: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n();

    const columns = computed(() => {
      return columnsDef.map(col => ({
        ...col,
        label: col.label || t(`InvoicesTable.headers.${col.id}`)
      }));
    });

    const displayedPayments = computed(() => {
      const subscriptionsMap = props.subscriptions.reduce(
        (map, sub) => ({ ...map, [sub.subscription_id]: sub }),
        {}
      );
      return props.payments.map(payment => ({
        ...payment,
        subscription: subscriptionsMap[payment.subscription_id]
      }));
    });

    return {
      // References
      columns,
      displayedPayments,
      routeNames
    };
  }
};
</script>

<style scoped lang="scss" src="./InvoicesTable.scss"></style>
