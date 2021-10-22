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
      <template v-if="selectedOrga && selectedSpace">
        <transition name="fade" mode="out-in">
          <template v-if="loading">
            <div class="payment__content__loader">
              <BIMDataSpinner />
            </div>
          </template>
          <template v-else-if="spaceInfo.isPlatformPaid">
            <DatapackSubscription
              :space="selectedSpace"
              :spaceInfo="spaceInfo"
            />
          </template>
          <template v-else>
            <PlatformSubscription
              :space="selectedSpace"
              :spaceInfo="spaceInfo"
            />
          </template>
        </transition>
      </template>
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

    const loading = ref(false);

    const selectedOrga = ref(null);
    const spaces = ref([]);
    const selectedSpace = ref(null);
    const spaceInfo = ref({});

    const loadSpaceInfo = space => {
      if (space) {
        loading.value = true;
        retrieveSpaceInformation(space)
          .then(info => (spaceInfo.value = info))
          .finally(() => (loading.value = false));
      }
    };
    const onOrganizationClick = organization => {
      selectedOrga.value = organization;
    };
    const onSpaceClick = space => {
      selectedSpace.value = space;
    };

    onMounted(() => {
      if (currentSpace.value) {
        selectedOrga.value = currentSpace.value.organization;
        selectedSpace.value = currentSpace.value;
      } else {
        selectedOrga.value = userOrganizations.value[0];
        spaces.value = organizationsSpaces.value[selectedOrga.value.id];
        selectedSpace.value = spaces.value[0];
      }
      loadSpaceInfo(selectedSpace.value);

      watch(
        () => selectedOrga.value,
        orga => {
          spaces.value = organizationsSpaces.value[orga.id];
          selectedSpace.value = spaces.value[0];
        }
      );
      watch(
        () => selectedSpace.value,
        space => {
          loadSpaceInfo(space);
        }
      );
    });

    return {
      // References
      loading,
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
