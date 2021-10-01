<template>
  <div class="platform-subscription">
    <header>
      <h1>{{ $t("PlatformSubscription.platformSubscriptionTitle") }}</h1>
      <p>
        {{ $t("PlatformSubscription.platformSubscriptionText") }}
      </p>
      {{ organizationPlaformSubscriptions }}
      <BIMDataDropdownList
        :list="organizationsList"
        :perPage="6"
        elementKey="dropdown"
        :closeOnElementClick="true"
        @element-click="onOrganizationClick($event)"
      >
        <template #header>
          <div class="flex items-center">
            <span
              class="number-organizations flex items-center justify-center"
              >{{ organizationsList.length }}</span
            >
            <span class="m-l-12">{{ selectedOrganization.name }}</span>
          </div>
        </template>
        <template #element="{ element }">
          {{ element.name }}
        </template>
      </BIMDataDropdownList>
    </header>
    <aside class="platform-subscription__content m-t-18">
      <div class="flex">
        <BillingDetails
          :billing="displayedBilling"
          :empty="!!organizationPlaformSubscriptions"
        />
        <Invoices
          v-if="!organizationPlaformSubscriptions"
          :invoices="displayedInvoices"
        />
        <OurPlans v-else />
      </div>
    </aside>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { useOrganizations } from "@/state/organizations.js";
import { usePayment } from "@/state/payment.js";

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

    const { retrieveUserOrganizations } = useOrganizations();
    const { retrieveOrganizationPlaformSubscriptions } = usePayment();

    const organizationsList = ref([]);
    const organizationPlaformSubscriptions = ref([]);
    const selectedOrganization = ref("");

    const onOrganizationClick = organization =>
      (selectedOrganization.value = organization);

    onMounted(async () => {
      organizationsList.value = await retrieveUserOrganizations();
      organizationsList.value.sort((a, b) =>
        a.created_at > b.created_at ? -1 : 1
      );
      selectedOrganization.value = organizationsList.value[0];
    });

    watch(selectedOrganization, async () => {
      organizationPlaformSubscriptions.value =
        await retrieveOrganizationPlaformSubscriptions(
          selectedOrganization.value
        );
    });

    return {
      // References
      displayedBilling,
      displayedInvoices,
      organizationsList,
      organizationPlaformSubscriptions,
      selectedOrganization,
      // Methods
      onOrganizationClick
    };
  }
};
</script>

<style scoped lang="scss" src="./PlatformSubscription.scss"></style>
