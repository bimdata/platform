<template>
  <div class="user-subscriptions">
    <div class="user-subscriptions__header">
      <div class="user-subscriptions__header__left">
        <h1>
          {{ $t("UserSubscriptions.title") }}
        </h1>
        <p>
          {{ $t("UserSubscriptions.text") }}
        </p>
        <BIMDataDropdownList
          :list="organizations"
          :perPage="6"
          elementKey="dropdown"
          :closeOnElementClick="true"
          @element-click="selectedOrga = $event"
        >
          <template #header>
            <div class="flex items-center">
              <span
                class="number-organizations flex items-center justify-center"
              >
                {{ organizations.length }}
              </span>
              <span class="m-l-12">
                {{ selectedOrga.name }}
              </span>
            </div>
          </template>
          <template #element="{ element }">
            {{ element.name }}
          </template>
        </BIMDataDropdownList>
      </div>
      <div class="user-subscriptions__header__right">
        <SubscribeCard />
      </div>
    </div>
    <div class="user-subscriptions__content m-t-18">
      <div class="flex">
        <BillingsTable :subscriptions="subscriptions" />
        <InvoicesTable :subscriptions="subscriptions" :payments="payments" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useOrganizations } from "@/state/organizations.js";
import { useSubscriptions } from "@/state/subscriptions.js";

// Components
import BillingsTable from "@/components/specific/subscriptions/billings-table/BillingsTable.vue";
import InvoicesTable from "@/components/specific/subscriptions/invoices-table/InvoicesTable.vue";
import SubscribeCard from "@/components/specific/subscriptions/subscribe-card/SubscribeCard.vue";

export default {
  components: {
    BillingsTable,
    InvoicesTable,
    SubscribeCard
  },
  setup() {
    const { userOrganizations } = useOrganizations();
    const { loadOrganizationSubscriptions, loadSubscriptionPayments } =
      useSubscriptions();

    const subscriptions = ref([]);
    const payments = ref([]);

    const selectedOrga = ref({});

    watch(
      userOrganizations,
      () => (selectedOrga.value = userOrganizations.value[0]),
      { immediate: true }
    );

    watch(
      selectedOrga,
      async () => {
        subscriptions.value = await loadOrganizationSubscriptions(
          selectedOrga.value
        );

        let allPayments = await Promise.all(
          subscriptions.value.map(sub => {
            return loadSubscriptionPayments(selectedOrga.value, sub.cloud, sub);
          })
        );

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        payments.value = allPayments
          .flat()
          .filter(
            payment =>
              // Do not show future payments in the invoices table
              new Date(payment.payout_date).getTime() < tomorrow.getTime()
          )
          .sort((a, b) =>
            new Date(a.payout_date).getTime() >
            new Date(b.payout_date).getTime()
              ? -1
              : 1
          );
      },
      { immediate: true }
    );

    return {
      // References
      organizations: userOrganizations,
      payments,
      selectedOrga,
      subscriptions
    };
  }
};
</script>

<style scoped lang="scss" src="./UserSubscriptions.scss"></style>
