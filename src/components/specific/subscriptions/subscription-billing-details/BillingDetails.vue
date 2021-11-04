<template>
  <div class="user-subscriptions__content__billing">
    <h2>
      {{ $t("BillingDetails.billingDetailsTitle") }}
    </h2>

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
            {{ $t("BillingDetails.nextPayment") }}
            {{ formatDate(billing.next_bill_date) }}
          </template>
          <template #cell-subscriptionplan="{ row: billing }">
            {{ $t("BillingDetails.professionalPlan") }}
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
            <BillingDetailsActionsCell
              :billing="billing"
              v-if="billing.status === 'active'"
            />
          </template>
        </GenericTable>
      </template>
    </BIMDataCard>

    <BIMDataCard class="bimdata-card__empty p-42" v-else>
      <template #content>
        <img class="m-b-24" src="/static/emptyBilling.svg" />
        <p>
          {{ $t("BillingDetails.emptyTablePlaceholder") }}
        </p>
        <BIMDataButton
          class="m-t-18"
          color="primary"
          fill
          radius
          @click="goToSubscriptionPro"
        >
          {{ $t("BillingDetails.updatePlatformPro") }}
        </BIMDataButton>
      </template>
    </BIMDataCard>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { formatDate } from "@/utils/date.js";
import routeNames from "@/router/route-names.js";
import columnsDef from "./columns.js";
// Components
import GenericTable from "@/components/generic/generic-table/GenericTable.vue";
import BillingDetailsActionsCell from "./BillingDetailsActionsCell.vue";

export default {
  components: {
    BillingDetailsActionsCell,
    GenericTable
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
    const router = useRouter();

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

    const goToSubscriptionPro = () => {
      router.push({ name: routeNames.subscriptionPro });
    };

    return {
      // References
      columns,
      formatDate,
      // Methods
      goToSubscriptionPro
    };
  }
};
</script>

<style scoped lang="scss" src="./BillingDetails.scss"></style>
