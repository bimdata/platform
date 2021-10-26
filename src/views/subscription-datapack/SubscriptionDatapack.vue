<template>
  <div class="subscription-datapack">
    <ViewHeader>
      <template #left>
        <GoBackButton />
      </template>
      <template #center>
        <h1 class="subscription-datapack__title">
          {{ $t("SubscriptionDatapack.title") }}
        </h1>
      </template>
    </ViewHeader>
    <div class="subscription-datapack__content">
      <div class="subscription-datapack__content__head">
        <OrgaSpaceSelectors
          :organizations="organizations"
          :spaces="spacesPaid"
          :selectedOrga="selectedOrga"
          :selectedSpace="selectedSpace"
          @orgaClick="onOrganizationClick"
          @spaceClick="onSpaceClick"
        />
      </div>
      <div class="subscription-datapack__content__body">
        <div class="subscription-datapack__content__body__left">
          <DatapackSubInfo :spaceInfo="spaceInfo" />
        </div>
        <div class="subscription-datapack__content__body__center">
          <DatapackSubForm
            :space="selectedSpace"
            @quantity-updated="onQuantityUpdate"
            @datapack-created="() => {}"
          />
        </div>
        <div class="subscription-datapack__content__body__right">
          <SpaceSizePreview
            :spaceInfo="spaceInfo"
            :newSizeAvailable="newSizeAvailable"
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
import DatapackSubForm from "@/components/specific/payment/datapack-sub-form/DatapackSubForm.vue";
import DatapackSubInfo from "@/components/specific/payment/datapack-sub-info/DatapackSubInfo.vue";
import SpaceSizePreview from "@/components/specific/payment/space-size-preview/SpaceSizePreview.vue";
import OrgaSpaceSelectors from "@/components/specific/payment/orga-space-selectors/OrgaSpaceSelectors.vue";

const OneGB = Math.pow(1024, 3);

export default {
  components: {
    DatapackSubForm,
    DatapackSubInfo,
    GoBackButton,
    OrgaSpaceSelectors,
    SpaceSizePreview,
    ViewHeader
  },
  setup() {
    // const space = ref({
    //   id: 558,
    //   name: "My New Space",
    //   organization: {
    //     id: 1935
    //   }
    // });
    // const spaceInfo = ref({
    //   smartDataSize: 29255230,
    //   smartDataSizeAvailable: 536870912000,
    //   remainingSmartDataPize: 536841656770,
    //   remainingSmartDataSizePercent: 99.99455078877509,
    //   usedSizePercent: 0.005449211224913597,
    //   isPlatformSubscription: true,
    //   isOrganizationMember: true,
    //   isPlatformPaid: true
    // });

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
    const onSpaceClick = space => {
      selectedSpace.value = space;
    };

    const newSizeAvailable = ref(
      spaceInfo.value.smartDataSizeAvailable + OneGB
    );

    const onQuantityUpdate = quantity => {
      newSizeAvailable.value =
        spaceInfo.value.smartDataSizeAvailable + quantity * OneGB;
    };

    return {
      // References
      newSizeAvailable,
      organizations: filterUserOrga,
      selectedOrga,
      selectedSpace,
      spaceInfo,
      spaces,
      spacesPaid,
      // Methods
      onOrganizationClick,
      onQuantityUpdate,
      onSpaceClick
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionDatapack.scss"></style>
