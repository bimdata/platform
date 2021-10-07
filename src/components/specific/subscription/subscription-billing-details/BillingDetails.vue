<template>
  <div class="platform-subscription__content__billing">
    <h2>{{ $t("BillingDetails.billingDetailsTitle") }}</h2>
    <BIMDataCard v-if="!empty">
      <template #content>
        <GenericTable
          class="billing-table"
          :columns="columns"
          :rows="billings"
          :paginated="true"
          :perPage="7"
          :placeholder="$t('BillingDetails.emptyTablePlaceholder')"
        >
          <template #cell-space="{ row: billing }">
            {{ billing.cloud.name }}
          </template>
          <template #cell-nextpayment="{ row: billing }">
            on {{ formatDate(billing.next_bill_date) }}
          </template>
          <template #cell-subscriptionplan="{ row: billing }">
            Professionnal
            <span v-if="billing.data_packs.length">{{
              billing.data_packs
            }}</span>
          </template>
          <template #cell-status="{ row: billing }">
            <span :class="`billing-status-cell--${billing.status}`">{{
              billing.status
            }}</span>
          </template>
          <template #cell-amount="{ row: billing }">
            {{ billing.unit_price }}
            <span> {{ billing.currency === "EUR" ? "€" : "£" }} </span>
          </template>
          <template #cell-actions="{ row: billing }">
            <BillingDetailsActionsCell :billing="billing" />
          </template>
        </GenericTable>
      </template>
    </BIMDataCard>
    <BIMDataCard class="bimdata-card__empty p-42" v-else>
      <template #content>
        <img class="m-b-24" src="../../../../icons/emptyBilling.svg" />
        <p>{{ $t("BillingDetails.emptyTablePlaceholder") }}</p>
        <BIMDataButton class="m-t-18" color="primary" fill radius>
          {{ $t("BillingDetails.updatePlatformPro") }}
        </BIMDataButton>
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
import GenericTable from "@/components/generic/generic-table/GenericTable.vue";
import BillingDetailsActionsCell from "./BillingDetailsActionsCell.vue";

export default {
  components: {
    GenericTable,
    BillingDetailsActionsCell
  },
  props: {
    billings: {
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
          label: col.label || t(`BillingDetails.headers.${col.id}`)
        }));
      },
      { immediate: true }
    );
    return {
      columns,
      formatDate
    };
  }
};
</script>

<style scoped lang="scss" src="./BillingDetails.scss"></style>
