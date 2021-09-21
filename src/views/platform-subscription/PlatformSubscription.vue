<template>
  <div class="platform-subscription">
    <header>
      <h1>Platform subscription</h1>
      <p>
        Texte expliquant que l’on doit choisir son organisation pour voir les informations de
        paiement et les factures associés
      </p>
      <BIMDataDropdownList
        :list="list"
        :perPage="6"
        elementKey="dropdown"
        :disabled="false"
        :closeOnElementClick="false"
      >
        <template #header> dropdown list example </template>
      </BIMDataDropdownList>
    </header>
    <aside class="platform-subscription__content m-t-18">
      <div class="flex">
        <BillingDetails :billing="displayedBilling" :empty="empty" />
        <Invoices v-if="!empty" :invoices="displayedInvoices" />
        <OurPlans v-else />
      </div>
    </aside>
  </div>
</template>

<script>
import { ref } from "vue";
// Components
import BillingDetails from "@/components/specific/subscription/subscription-billing-details/BillingDetails";
import Invoices from "@/components/specific/subscription/invoices/Invoices";
import OurPlans from "@/components/specific/subscription/plans/OurPlans";

export default {
  components: {
    BillingDetails,
    Invoices,
    OurPlans,
  },
  setup() {
    const displayedBilling = ref([]);
    const displayedInvoices = ref([]);
    const empty = ref(false);

    return {
      displayedBilling,
      displayedInvoices,
      empty,
    };
  },
};
</script>

<style scoped lang="scss" src="./PlatformSubscription.scss"></style>
