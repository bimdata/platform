<template>
  <div class="user-subscriptions">
    <header>
      <h1>{{ $t("UserSubscriptions.title") }}</h1>
      <p>
        {{ $t("UserSubscriptions.text") }}
      </p>
      <BIMDataDropdownList
        :list="organizationsList"
        :perPage="6"
        elementKey="dropdown"
        :closeOnElementClick="true"
        @element-click="onOrganizationClick($event)"
      >
        <template #header>
          <div class="flex items-center">
            <span class="number-organizations flex items-center justify-center">
              {{ organizationsList.length }}
            </span>
            <span class="m-l-12">
              {{ selectedOrganization.name }}
            </span>
          </div>
        </template>
        <template #element="{ element }">
          {{ element.name }}
        </template>
      </BIMDataDropdownList>
    </header>
    <aside class="user-subscriptions__content m-t-18">
      <div class="flex">
        <BillingDetails
          :billings="organizationPlaformSubscriptions"
          :empty="!organizationPlaformSubscriptions.length"
        />
        <Invoices
          v-if="organizationPlaformSubscriptions.length"
          :invoices="platformSubscriptionPayments"
          :subscriptions="organizationPlaformSubscriptions"
        />
        <OurPlans v-else />
      </div>
    </aside>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { useOrganizations } from "@/state/organizations.js";
import { useSubscriptions } from "@/state/subscriptions.js";

// Components
import BillingDetails from "@/components/specific/subscriptions/subscription-billing-details/BillingDetails.vue";
import Invoices from "@/components/specific/subscriptions/invoices/Invoices.vue";
import OurPlans from "@/components/specific/subscriptions/plans/OurPlans.vue";

export default {
  components: {
    BillingDetails,
    Invoices,
    OurPlans
  },
  setup() {
    const { retrieveUserOrganizations } = useOrganizations();
    const { retrieveOrganizationSubscriptions, retrieveSubscriptionPayments } =
      useSubscriptions();

    const organizationsList = ref([]);
    const organizationPlaformSubscriptions = ref([]);
    const platformSubscriptionPayments = ref([]);
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
        await retrieveOrganizationSubscriptions(selectedOrganization.value);

      let payments = await Promise.all(
        organizationPlaformSubscriptions.value.map(sub => {
          return retrieveSubscriptionPayments(
            selectedOrganization.value,
            sub.cloud,
            sub
          );
        })
      );
      payments = payments.flat();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      platformSubscriptionPayments.value = payments
        // so as not to have future payments in the "invoice" part
        .filter(
          payment =>
            new Date(payment.payout_date).getTime() < tomorrow.getTime()
        )
        .sort((a, b) =>
          new Date(a.payout_date).getTime() > new Date(b.payout_date).getTime()
            ? -1
            : 1
        );
    });

    return {
      // References
      organizationsList,
      organizationPlaformSubscriptions,
      platformSubscriptionPayments,
      selectedOrganization,
      // Methods
      onOrganizationClick
    };
  }
};
</script>

<style scoped lang="scss" src="./UserSubscriptions.scss"></style>
