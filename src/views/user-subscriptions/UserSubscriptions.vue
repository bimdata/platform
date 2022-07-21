<template>
  <div class="user-subscriptions">
    <ViewHeader>
      <template #left>
        <GoBackButton />
      </template>
    </ViewHeader>
    <div class="user-subscriptions__header">
      <div class="user-subscriptions__header__start">
        <h1>
          {{ $t("UserSubscriptions.title") }}
        </h1>
        <p>
          {{ $t("UserSubscriptions.text") }}
        </p>
        <div>
          <div class="primary-font-bold">
            {{ $t("UserSubscriptions.list") }}
          </div>
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
                  class="flex items-center justify-center m-r-12 organization-count"
                >
                  {{ organizations.length }}
                </span>
                <BIMDataTextbox
                  maxWidth="240px"
                  :text="selectedOrga.name"
                  :tooltip="false"
                />
              </div>
            </template>
            <template #element="{ element }">
              <BIMDataTextbox
                maxWidth="280px"
                :text="element.name"
                :tooltip="false"
              />
            </template>
          </BIMDataDropdownList>
        </div>
      </div>
      <div class="user-subscriptions__header__end">
        <SubscribeCard />
      </div>
    </div>
    <div class="user-subscriptions__content">
      <BillingsTable :subscriptions="subscriptions" />
      <InvoicesTable :subscriptions="subscriptions" :payments="payments" />
    </div>
  </div>
</template>

<script>
import mapLimit from "async/mapLimit";
import { onMounted, ref, watch } from "vue";
import { useOrganizations } from "@/state/organizations.js";
import { useSubscriptions } from "@/state/subscriptions.js";
// Components
import ViewHeader from "@/components/specific/app/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import BillingsTable from "@/components/specific/subscriptions/billings-table/BillingsTable.vue";
import InvoicesTable from "@/components/specific/subscriptions/invoices-table/InvoicesTable.vue";
import SubscribeCard from "@/components/specific/subscriptions/subscribe-card/SubscribeCard.vue";

export default {
  components: {
    BillingsTable,
    GoBackButton,
    InvoicesTable,
    SubscribeCard,
    ViewHeader
  },
  setup() {
    const { userOrganizations } = useOrganizations();
    const {
      currentOrga,
      loadOrganizationSubscriptions,
      loadSubscriptionPayments
    } = useSubscriptions();

    const subscriptions = ref([]);
    const payments = ref([]);

    const selectedOrga = ref({});

    onMounted(() => {
      selectedOrga.value = currentOrga.value || userOrganizations.value[0];

      watch(
        selectedOrga,
        async () => {
          subscriptions.value = await loadOrganizationSubscriptions(
            selectedOrga.value
          );

          // When a cloud is deleted, the subscription history stays
          // We don't show custom subscriptions
          const validSubscriptions = subscriptions.value.filter(
            sub => sub.cloud && !sub.is_custom
          );
          const allPayments = await mapLimit(
            validSubscriptions,
            10,
            async sub =>
              await loadSubscriptionPayments(selectedOrga.value, sub.cloud, sub)
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
            .sort(
              (a, b) =>
                new Date(b.payout_date).getTime() -
                new Date(a.payout_date).getTime()
            );
        },
        { immediate: true }
      );
    });

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
