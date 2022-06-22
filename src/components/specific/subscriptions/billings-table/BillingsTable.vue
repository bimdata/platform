<template>
  <div class="billings-table">
    <h2>
      {{ $t("BillingsTable.title") }}
    </h2>

    <BIMDataCard class="billings-table__table" v-if="subscriptions.length > 0">
      <template #content>
        <GenericTable
          :columns="columns"
          :rows="subscriptions"
          :paginated="true"
          :perPage="7"
        >
          <template #cell-space="{ row: sub }">
            <AppLink
              v-if="sub.cloud"
              :to="{
                name: routeNames.spaceBoard,
                params: {
                  spaceID: sub.cloud.id
                }
              }"
            >
              <BIMDataTextbox class="space-cell" :text="sub.cloud.name" />
            </AppLink>
          </template>
          <template #cell-nextpayment="{ row: sub }">
            <div v-if="!sub.is_custom">
              {{ $d(sub.next_bill_date, "short") }}
            </div>
          </template>
          <template #cell-subscriptionplan="{ row: sub }">
            {{ $t("BillingsTable.professionalPlan") }}
            <span v-if="sub.data_packs.length > 0">
              ({{ $t("BillingsTable.withDatapack") }})
            </span>
          </template>
          <template #cell-status="{ row: sub }">
            <span v-if="sub.is_custom" class="status-cell--custom">
              {{ $t("BillingsTable.status.custom") }}
            </span>
            <span v-else :class="`status-cell--${sub.status}`">
              {{ $t(`BillingsTable.status.${sub.status}`) }}
            </span>
          </template>
          <template #cell-amount="{ row: sub }">
            <div v-if="!sub.is_custom">
              {{
                +sub.unit_price +
                sub.data_packs
                  .map(d => +d.unit_price * d.quantity)
                  .reduce((a, b) => a + b, 0)
              }}
              <span> {{ sub.currency === "EUR" ? "€" : "£" }} </span>
            </div>
          </template>
          <template #cell-actions="{ row: sub }">
            <BillingActionsCell
              v-if="sub.status === 'active' && !sub.is_custom"
              :billing="sub"
            />
          </template>
        </GenericTable>
      </template>
    </BIMDataCard>

    <BIMDataCard class="billings-table__empty" v-else>
      <template #content>
        <BillingsTableEmptyImage class="m-b-24" />
        <p>
          {{ $t("BillingsTable.emptyTableText") }}
        </p>
        <AppLink :to="{ name: routeNames.subscriptionPro }">
          <BIMDataButton class="m-t-18" color="primary" fill radius>
            {{ $t("BillingsTable.subscribeButton") }}
          </BIMDataButton>
        </AppLink>
      </template>
    </BIMDataCard>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import routeNames from "@/router/route-names.js";
import columnsDef from "./columns.js";
// Components
import GenericTable from "@/components/generic/generic-table/GenericTable.vue";
import AppLink from "@/components/specific/app/app-link/AppLink.vue";
import BillingActionsCell from "./billing-actions-cell/BillingActionsCell.vue";

export default {
  components: {
    AppLink,
    BillingActionsCell,
    GenericTable
  },
  props: {
    subscriptions: {
      type: Array,
      required: true
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
          label: col.label || t(`BillingsTable.headers.${col.id}`)
        }));
      },
      { immediate: true }
    );

    return {
      // References
      columns,
      routeNames
    };
  }
};
</script>

<style scoped lang="scss" src="./BillingsTable.scss"></style>
