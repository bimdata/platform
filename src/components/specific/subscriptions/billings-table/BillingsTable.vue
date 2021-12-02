<template>
  <div class="billings-table">
    <h2>
      {{ $t("BillingsTable.title") }}
    </h2>

    <BIMDataCard v-if="subscriptions.length > 0">
      <template #content>
        <GenericTable
          :columns="columns"
          :rows="subscriptions"
          :paginated="true"
          :perPage="7"
        >
          <template #cell-space="{ row: sub }">
            <span class="space-cell" @click="goToSpaceBoard(sub.cloud)">
              {{ (sub.cloud || {}).name }}
            </span>
          </template>
          <template #cell-nextpayment="{ row: sub }">
            {{ $d(sub.next_bill_date, "short") }}
          </template>
          <template #cell-subscriptionplan="{ row: sub }">
            {{ $t("BillingsTable.professionalPlan") }}
            <span v-if="sub.data_packs.length > 0">
              ({{ $t("BillingsTable.withDatapack") }})
            </span>
          </template>
          <template #cell-status="{ row: sub }">
            <span :class="`status-cell--${sub.status}`">
              {{ sub.status }}
            </span>
          </template>
          <template #cell-amount="{ row: sub }">
            {{
              +sub.unit_price +
              sub.data_packs
                .map(d => +d.unit_price * d.quantity)
                .reduce((a, b) => a + b, 0)
            }}
            <span> {{ sub.currency === "EUR" ? "€" : "£" }} </span>
          </template>
          <template #cell-actions="{ row: sub }">
            <BillingActionsCell v-if="sub.status === 'active'" :billing="sub" />
          </template>
        </GenericTable>
      </template>
    </BIMDataCard>

    <BIMDataCard class="billings-table__empty" v-else>
      <template #content>
        <img class="m-b-24" src="/static/billings-table-empty-image.svg" />
        <p>
          {{ $t("BillingsTable.emptyTableText") }}
        </p>
        <BIMDataButton
          class="m-t-18"
          color="primary"
          fill
          radius
          @click="goToSubscriptionPro"
        >
          {{ $t("BillingsTable.subscribeButton") }}
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
import BillingActionsCell from "./billing-actions-cell/BillingActionsCell.vue";

export default {
  components: {
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
    const router = useRouter();
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

    const goToSubscriptionPro = () => {
      router.push({ name: routeNames.subscriptionPro });
    };

    const goToSpaceBoard = space => {
      if (space) {
        router.push({
          name: routeNames.spaceBoard,
          params: {
            spaceID: space.id
          }
        });
      }
    };

    return {
      // References
      columns,
      // Methods
      goToSpaceBoard,
      goToSubscriptionPro
    };
  }
};
</script>

<style scoped lang="scss" src="./BillingsTable.scss"></style>
