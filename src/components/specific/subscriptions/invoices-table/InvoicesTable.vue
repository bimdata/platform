<template>
  <div class="invoices-table">
    <h2>
      {{ $t("InvoicesTable.title") }}
    </h2>

    <BIMDataCard v-if="subscriptions.length > 0">
      <template #content>
        <GenericTable
          :columns="columns"
          :rows="payments"
          :paginated="true"
          :perPage="7"
          :placeholder="$t('InvoicesTable.tablePlaceholder')"
        >
          <template #cell-space="{ row: payment }">
            {{ (subscriptionsMap[payment.subscription_id].cloud || {}).name }}
          </template>
          <template #cell-date="{ row: payment }">
            {{ $d(payment.payout_date, "short") }}
          </template>
          <template #cell-status="{ row: payment }">
            <InvoiceStatusCell :invoice="payment" />
          </template>
          <template #cell-amount="{ row: payment }">
            {{ payment.amount }}
            <span> {{ payment.currency === "EUR" ? "€" : "£" }} </span>
          </template>
          <template #cell-actions="{ row: payment }">
            <InvoiceActionsCell :invoice="payment" />
          </template>
        </GenericTable>
      </template>
    </BIMDataCard>

    <BIMDataCard v-else class="invoices-table__empty">
      <template #content>
        <InvoicesTableEmptyImage class="m-b-24" />
        <p>
          {{ $t("InvoicesTable.emptyTableText") }}
        </p>
        <BIMDataButton
          class="m-t-18"
          color="primary"
          fill
          radius
          @click="goToSubscriptionPro"
        >
          {{ $t("InvoicesTable.subscribeButton") }}
        </BIMDataButton>
      </template>
    </BIMDataCard>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import routeNames from "@/router/route-names.js";
import columnsDef from "./columns.js";
// Components
import GenericTable from "@/components/generic/generic-table/GenericTable.vue";
import InvoiceActionsCell from "./invoice-actions-cell/InvoiceActionsCell.vue";
import InvoiceStatusCell from "./invoice-status-cell/InvoiceStatusCell.vue";

export default {
  components: {
    GenericTable,
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
    const router = useRouter();
    const { locale, t } = useI18n();
    const columns = ref([]);

    const subscriptionsMap = ref({});

    watch(
      () => locale.value,
      () => {
        columns.value = columnsDef.map(col => ({
          ...col,
          label: col.label || t(`InvoicesTable.headers.${col.id}`)
        }));
      },
      { immediate: true }
    );

    watch(
      () => props.subscriptions,
      subscriptions => {
        subscriptionsMap.value = subscriptions.reduce((acc, sub) => {
          acc[sub.subscription_id] = sub;
          return acc;
        }, {});
      },
      { immediate: true }
    );

    const goToSubscriptionPro = () => {
      router.push({ name: routeNames.subscriptionPro });
    };

    return {
      // References
      columns,
      subscriptionsMap,
      // Methods
      goToSubscriptionPro
    };
  }
};
</script>

<style scoped lang="scss" src="./InvoicesTable.scss"></style>
