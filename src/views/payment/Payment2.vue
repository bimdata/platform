<template>
  <div class="view payment">
    <ViewHeader>
      <template #left>
        <GoBackButton />
      </template>
      <template #center>
        <h1 class="payment__title" v-if="spaceInfo.isPlatformPaid">
          Ajout DataPack
        </h1>
        <h1 class="payment__title" v-else>
          {{ $t("Payment.title") }}
        </h1>
      </template>
    </ViewHeader>
    <div class="payment__content">
      <div class="payment__content__head">
        <OrgaSpaceSelectors
          :organizations="organizations"
          :spaces="spaces"
          :selectedOrga="selectedOrga"
          :selectedSpace="selectedSpace"
          @orgaClick="onOrganizationClick"
          @spaceClick="onSpaceClick"
        />
      </div>
      <transition name="fade" mode="out-in">
        <template v-if="spaceInfo.isPlatformPaid">
          <DatapackSubscription :space="selectedSpace" />
        </template>
        <template v-else>
          <PlatformSubscription :space="selectedSpace" />
        </template>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useOrganizations } from "@/state/organizations.js";
import { usePayment } from "@/state/payment.js";
import { useSpaces } from "@/state/spaces.js";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import OrgaSpaceSelectors from "@/components/specific/payment/orga-space-selectors/OrgaSpaceSelectors.vue";
import DatapackSubscription from "./datapack-subscription/DatapackSubscription.vue";
import PlatformSubscription from "./platform-subscription/PlatformSubscription.vue";

export default {
  components: {
    DatapackSubscription,
    GoBackButton,
    OrgaSpaceSelectors,
    PlatformSubscription,
    ViewHeader
  },
  setup() {
    const { userOrganizations, organizationsSpaces } = useOrganizations();
    const { currentSpace } = useSpaces();
    const { retrieveSpaceInformation } = usePayment();

    const selectedOrga = ref({});

    const spaces = ref([]);
    const selectedSpace = ref({});
    const spaceInfo = ref({});

    const onOrganizationClick = organization => {
      selectedOrga.value = organization;
    };
    const onSpaceClick = space => {
      selectedSpace.value = space;
    };

    onMounted(() => {
      selectedOrga.value = userOrganizations.value[0];
      if (currentSpace.value) {
        selectedSpace.value = currentSpace.value;
      }
    });

    watch(
      () => selectedOrga.value,
      () => {
        spaces.value = organizationsSpaces.value[selectedOrga.value.id];
        selectedSpace.value = spaces.value[0];
      }
      // { immediate: true }
    );

    watch(
      () => selectedSpace.value,
      async space => {
        if (space && space.id) {
          spaceInfo.value = await retrieveSpaceInformation(space);
        }
      }
    );

    return {
      // References
      organizations: userOrganizations,
      selectedOrga,
      selectedSpace,
      spaceInfo,
      spaces,
      // Methods
      onOrganizationClick,
      onSpaceClick
    };
  }
};
</script>

<style scoped lang="scss" src="./Payment.scss"></style>
