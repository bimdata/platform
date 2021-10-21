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
      <div class="payment__content--top">
        <div class="payment__content__block"></div>
        <div class="payment__content__block"></div>
      </div>
      <div class="payment__content__block payment__content--left">
        <PlatformSubInfo />
      </div>
      <div class="payment__content__block payment__content--center">
        <PlatformSubForm :space="selectedSpace" />
      </div>
      <div class="payment__content__block payment__content--right">
        <SpaceSizePreview :space="selectedSpace" />
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
import SpaceSizePreview from "@/components/specific/payment/space-size-preview/SpaceSizePreview.vue";
import PlatformSubForm from "@/components/specific/payment/platform-sub-form/PlatformSubForm.vue";
import PlatformSubInfo from "@/components/specific/payment/platform-sub-info/PlatformSubInfo.vue";

export default {
  components: {
    GoBackButton,
    PlatformSubForm,
    PlatformSubInfo,
    SpaceSizePreview,
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
