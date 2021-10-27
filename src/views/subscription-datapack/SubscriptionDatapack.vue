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
        <SpaceSelector
          :organizations="organizations"
          :initialOrga="currentOrga"
          :initialSpace="currentSpace"
          @space-selected="selectedSpace = $event"
        />
      </div>
      <div class="subscription-datapack__content__body">
        <div class="subscription-datapack__content__body__left">
          <DatapackSubInfo :spaceInfo="spaceInfo" :subscriptions="spaceSubs" />
        </div>
        <div class="subscription-datapack__content__body__center">
          <DatapackSubForm
            :space="selectedSpace"
            :subscriptions="spaceSubs"
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
import { computed, ref, watch } from "vue";
import { GB } from "@/config/size-unit.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSubscriptions } from "@/state/subscriptions.js";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import DatapackSubForm from "@/components/specific/payment/datapack-sub-form/DatapackSubForm.vue";
import DatapackSubInfo from "@/components/specific/payment/datapack-sub-info/DatapackSubInfo.vue";
import SpaceSelector from "@/components/specific/payment/space-selector/SpaceSelector.vue";
import SpaceSizePreview from "@/components/specific/payment/space-size-preview/SpaceSizePreview.vue";

export default {
  components: {
    DatapackSubForm,
    DatapackSubInfo,
    GoBackButton,
    SpaceSelector,
    SpaceSizePreview,
    ViewHeader
  },
  setup() {
    const { userOrganizations } = useOrganizations();
    const {
      currentOrga,
      currentSpace,
      retrieveSpaceInformation,
      getSpaceSubscriptions
    } = useSubscriptions();

    const organizations = computed(() =>
      userOrganizations.value.filter(orga => !orga.is_personnal)
    );

    const selectedSpace = ref(currentSpace.value);
    const spaceInfo = ref({});
    const spaceSubs = ref([]);

    watch(
      () => selectedSpace.value,
      async space => {
        if (space && space.id) {
          spaceInfo.value = await retrieveSpaceInformation(space);
          spaceSubs.value = getSpaceSubscriptions(space);
        }
      },
      { immediate: true }
    );

    const newSizeAvailable = ref(spaceInfo.value.smartDataSizeAvailable + GB);

    const onQuantityUpdate = quantity => {
      newSizeAvailable.value =
        spaceInfo.value.smartDataSizeAvailable + quantity * GB;
    };

    return {
      // References
      currentOrga,
      currentSpace,
      newSizeAvailable,
      organizations,
      selectedSpace,
      spaceInfo,
      spaceSubs,
      // Methods
      onQuantityUpdate
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionDatapack.scss"></style>
