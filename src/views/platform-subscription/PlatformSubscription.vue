<template>
  <div class="platform-subscription">
    <header>
      <h1>{{ $t("PlatformSubscription.platformSubscriptionTitle") }}</h1>
      <p>
        {{ $t("PlatformSubscription.platformSubscriptionText") }}
      </p>
      <BIMDataDropdownList
        :list="organizations"
        :perPage="6"
        elementKey="dropdown"
        :disabled="false"
        :closeOnElementClick="true"
      >
        <template #header> dropdown list example </template>
        <template #element="{ element }">
          {{ element.name }}
        </template>
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
import { onMounted, ref } from "vue";
import { useOrganizations } from "@/state/organizations.js";
// Components
import BillingDetails from "@/components/specific/subscription/subscription-billing-details/BillingDetails.vue";
import Invoices from "@/components/specific/subscription/invoices/Invoices.vue";
import OurPlans from "@/components/specific/subscription/plans/OurPlans.vue";

export default {
  components: {
    BillingDetails,
    Invoices,
    OurPlans
  },
  setup() {
    const displayedBilling = ref([]);
    const displayedInvoices = ref([]);
    const empty = ref(false);

    const { retrieveOrganizations } = useOrganizations();

    const organizations = ref([]);
    onMounted(async () => {
      organizations.value = await retrieveOrganizations();
    });

    return {
      displayedBilling,
      displayedInvoices,
      empty,
      organizations
    };
  }
};
</script>

<style scoped lang="scss" src="./PlatformSubscription.scss"></style>
