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
      <div class="payment__content__head"></div>
      <PlatformSubscription />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useOrganizations } from "@/state/organizations.js";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import PlatformSubscription from "./platform-subscription/PlatformSubscription.vue";

export default {
  components: {
    GoBackButton,
    PlatformSubscription,
    ViewHeader
  },
  setup() {
    const { userOrganizations } = useOrganizations();

    const selectedOrganization = ref({});
    const selectedSpace = ref({});

    const onOrganizationClick = orga => {
      selectedOrganization.value = orga;
    };

    onMounted(() => {
      selectedOrganization.value = userOrganizations.value[0];
      selectedSpace.value = {
        id: 0,
        organization: {
          id: 0
        }
      };
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
