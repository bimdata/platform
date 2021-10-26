<template>
  <div class="subscription-platform">
    <ViewHeader>
      <template #left>
        <GoBackButton />
      </template>
      <template #center>
        <h1 class="subscription-platform__title">
          {{ $t("SubscriptionPlatform.title") }}
        </h1>
      </template>
    </ViewHeader>
    <div class="subscription-platform__content">
      <div class="subscription-platform__content__head">
        <OrgaSpaceCards
          :organizations="organizations"
          :spaces="spaces"
          :selectedOrga="selectedOrga"
          @orgaClick="onOrganizationClick"
          @spaceCreated="onSpaceCreated"
        />
      </div>
      <div class="subscription-platform__content__body">
        <div class="subscription-platform__content__body__left">
          <PlatformSubInfo />
        </div>
        <div class="subscription-platform__content__body__center">
          <PlatformSubForm :space="selectedSpace" />
        </div>
        <div class="subscription-platform__content__body__right">
          <SpaceSizePreview
            :spaceInfo="spaceInfo"
            :newSizeAvailable="10 * Math.pow(1024, 3)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import { useOrganizations } from "@/state/organizations.js";
import { usePayment } from "@/state/payment.js";
import { useSpaces } from "@/state/spaces.js";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import PlatformSubForm from "@/components/specific/payment/platform-sub-form/PlatformSubForm.vue";
import PlatformSubInfo from "@/components/specific/payment/platform-sub-info/PlatformSubInfo.vue";
import SpaceSizePreview from "@/components/specific/payment/space-size-preview/SpaceSizePreview.vue";
import OrgaSpaceCards from "@/components/specific/payment/orga-space-cards/OrgaSpaceCards.vue";

export default {
  components: {
    GoBackButton,
    OrgaSpaceCards,
    PlatformSubForm,
    PlatformSubInfo,
    SpaceSizePreview,
    ViewHeader
  },
  setup() {
    const { userOrganizations, organizationsSpaces } = useOrganizations();
    const { currentSpace } = useSpaces();
    const {
      retrieveSpaceInformation,
      retrieveOrganizationPlaformSubscriptions
    } = usePayment();

    const selectedOrga = ref({});
    const selectedSpace = ref({});
    const spaceInfo = ref({});
    const spaces = ref([]);
    const spacesPaid = ref([]);

    const filterUserOrga = ref([]);

    filterUserOrga.value = userOrganizations.value.filter(
      userOrganization => userOrganization.is_personnal === false
    );

    onMounted(() => {
      selectedOrga.value = filterUserOrga.value[0];
      if (currentSpace.value) {
        selectedSpace.value = currentSpace.value;
      }
    });

    watch(
      () => selectedOrga.value,
      async () => {
        spaces.value = organizationsSpaces.value[selectedOrga.value.id];
        selectedSpace.value = spaces.value[0];
        spacesPaid.value = await retrieveOrganizationPlaformSubscriptions(
          selectedOrga.value
        );
      }
    );

    watch(
      () => selectedSpace.value,
      async space => {
        if (space && space.id) {
          spaceInfo.value = await retrieveSpaceInformation(space);
        }
      }
    );

    const onOrganizationClick = organization => {
      selectedOrga.value = organization;
    };
    const onSpaceCreated = space => {
      selectedSpace.value = space;
    };

    return {
      // References
      organizations: filterUserOrga,
      selectedOrga,
      selectedSpace,
      spaces,
      spaceInfo,
      spacesPaid,
      // Methods
      onOrganizationClick,
      onSpaceCreated
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionPlatform.scss"></style>
