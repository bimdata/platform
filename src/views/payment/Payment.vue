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
      <div class="payment__content__head">
        <!-- TODO: /!\ (WARNING !!!) Jaja area /!\ -->
      </div>
      <transition name="fade" mode="out-in">
        <template v-if="spaceInfo.isPlatformPaid">
          <DatapackSubscription :space="selectedSpace" :spaceInfo="spaceInfo" />
        </template>
        <template v-else>
          <PlatformSubscription :space="selectedSpace" :spaceInfo="spaceInfo" />
        </template>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useOrganizations } from "@/state/organizations.js";
import { usePayment } from "@/state/payment.js";
import { useSpaces } from "@/state/spaces.js";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import DatapackSubscription from "./datapack-subscription/DatapackSubscription.vue";
import PlatformSubscription from "./platform-subscription/PlatformSubscription.vue";

export default {
  components: {
    DatapackSubscription,
    GoBackButton,
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

    if (currentSpace.value) {
      selectedOrga.value = currentSpace.value.organization;
      selectedSpace.value = currentSpace.value;
    } else {
      selectedOrga.value = userOrganizations.value[0];
      spaces.value = organizationsSpaces.value[selectedOrga.value.id];
      selectedSpace.value = spaces.value[0];
    }
    retrieveSpaceInformation(selectedSpace.value).then(
      info => (spaceInfo.value = info)
    );

    watch(
      () => selectedOrga.value,
      orga => {
        spaces.value = organizationsSpaces.value[orga.id];
        selectedSpace.value = spaces.value[0];
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
