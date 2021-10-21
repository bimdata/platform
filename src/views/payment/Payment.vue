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
        <template v-if="hasSubscription">
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
import { ref, onMounted } from "vue";
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
    const { userOrganizations } = useOrganizations();
    const { currentSpace } = useSpaces();
    const { platformSubscriptions } = usePayment();

    const selectedOrga = ref({});
    const selectedSpace = ref({});

    const hasSubscription = ref(false);

    onMounted(() => {
      selectedOrga.value = userOrganizations.value[0];
      if (currentSpace.value) {
        selectedSpace.value = currentSpace.value;
        hasSubscription.value = platformSubscriptions.value.length > 0;
      }
    });

    return {
      // References
      hasSubscription,
      organizations: userOrganizations,
      selectedOrga,
      selectedSpace
    };
  }
};
</script>

<style scoped lang="scss" src="./Payment.scss"></style>
