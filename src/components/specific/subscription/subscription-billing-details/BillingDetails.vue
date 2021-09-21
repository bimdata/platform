<template>
  <div class="platform-subscription__content__billing">
    <h2>Billing details</h2>
    <BIMDataCard v-if="!empty">
      <template #content>
        <GenericTable
          class="billing-table"
          :columns="columns"
          :rows="billing"
          :paginated="true"
          :perPage="7"
          :placeholder="$t('BillingDetails.emptyTablePlaceholder')"
        >
          <template #cell-version="{ row: { version } }">
            {{ version ? version : "-" }}
          </template>
        </GenericTable>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <BIMDataButton color="primary" fill radius class="m-r-6">
            Update credit card
          </BIMDataButton>
          <BIMDataButton color="high" ghost radius>
            Cancel subscription
          </BIMDataButton>
        </div>
      </template>
    </BIMDataCard>
    <BIMDataCard class="bimdata-card__empty p-24" v-else>
      <template #content>
        <img class="m-b-24" src="../../../../icons/emptyBilling.svg" />
        <p>Oh no. There is no active plan here.</p>
        <p>You have probably never tried our Pro version before ?</p>
        <BIMDataButton class="m-t-18" color="primary" fill radius
          >Upgrade to our Pro Platform
        </BIMDataButton>
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
    GenericTable,
  },
  props: {
    billing: {
      type: Array,
      required: true,
    },
    empty: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { locale, t } = useI18n();
    const columns = ref([]);
    watch(
      () => locale.value,
      () => {
        columns.value = columnsDef.map((col) => ({
          ...col,
          label: col.label || t(`BillingDetails.headers.${col.id}`),
        }));
      },
      { immediate: true }
    );
    return {
      columns,
    };
  },
};
</script>

<style scoped lang="scss" src="./BillingDetails.scss"></style>
