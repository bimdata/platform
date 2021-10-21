<template>
  <div class="view payment">
    <ViewHeader>
      <template #left>
        <GoBackButton />
      </template>
      <template #center>
        <h1 class="payment__title">
          {{ $t("Payment.title") }}
        </h1>
      </template>
    </ViewHeader>
    <div class="payment__content">
      <div class="payment__content__left">
        <SubscriptionInfo />
      </div>
      <div class="payment__content__center">
        <SubscriptionForm :space="selectedSpace" />
      </div>
      <div class="payment__content__right">
        <StoragePreview :space="selectedSpace" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useOrganizations } from "@/state/organizations.js";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import StoragePreview from "@/components/specific/payment/storage-preview/StoragePreview.vue";
import SubscriptionForm from "@/components/specific/payment/subscription-form/SubscriptionForm.vue";
import SubscriptionInfo from "@/components/specific/payment/subscription-info/SubscriptionInfo.vue";

export default {
  components: {
    GoBackButton,
    StoragePreview,
    SubscriptionForm,
    SubscriptionInfo,
    ViewHeader
  },
  setup() {
    const { userOrganizations } = useOrganizations();

    const selectedOrganization = ref(null);
    const selectedSpace = ref(null);

    const onOrganizationClick = orga => {
      selectedOrganization.value = orga;
    };

    onMounted(() => {
      selectedOrganization.value = userOrganizations.value[0];
      selectedSpace.value = {};
    });

    return {
      // References
      organizations: userOrganizations,
      selectedOrganization,
      selectedSpace,
      // Methods
      onOrganizationClick
    };
  }
};
</script>

<style scoped lang="scss" src="./Payment.scss"></style>
