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
          <DatapackInfo :spaceInfo="spaceInfo" :subscription="subscription" />
        </div>
        <div class="subscription-datapack__content__body__center">
          <DatapackForm
            :space="selectedSpace"
            :subscription="subscription"
            @quantity-updated="quantity = $event"
            @datapack-created="loadSpaceData(selectedSpace)"
            @datapack-updated="loadSpaceData(selectedSpace)"
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
    <div class="subscription-datapack__loader" v-show="loading">
      <BIMDataSpinner />
    </div>
  </div>
</template>

<script>
import { computed, provide, ref, watch } from "vue";
import SIZE_UNIT from "@/config/size-unit.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSubscriptions } from "@/state/subscriptions.js";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import DatapackForm from "@/components/specific/subscriptions/datapack-form/DatapackForm.vue";
import DatapackInfo from "@/components/specific/subscriptions/datapack-info/DatapackInfo.vue";
import SpaceSelector from "@/components/specific/subscriptions/space-selector/SpaceSelector.vue";
import SpaceSizePreview from "@/components/specific/subscriptions/space-size-preview/SpaceSizePreview.vue";

export default {
  components: {
    DatapackForm,
    DatapackInfo,
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
      retrieveSpaceSubscriptions,
      getSpaceActiveSubscription
    } = useSubscriptions();

    const loading = ref(false);
    provide("loading", loading);

    const selectedSpace = ref(currentSpace.value);
    const spaceInfo = ref({});
    const subscription = ref(null);

    const quantity = ref(1);
    const newSizeAvailable = computed(
      () =>
        spaceInfo.value.smartDataSizeAvailable + quantity.value * SIZE_UNIT.GB
    );

    const loadSpaceData = async space => {
      if (space && space.id) {
        const info = await retrieveSpaceInformation(space);
        const sub = await retrieveSpaceSubscriptions(space).then(() =>
          getSpaceActiveSubscription(space)
        );
        // This is needed to trigger reactive effects
        spaceInfo.value = { ...info };
        subscription.value = { ...sub };
      }
    };

    watch(
      () => selectedSpace.value,
      space => loadSpaceData(space),
      { immediate: true }
    );

    return {
      // References
      currentOrga,
      currentSpace,
      loading,
      newSizeAvailable,
      organizations: userOrganizations,
      quantity,
      selectedSpace,
      spaceInfo,
      subscription,
      // Methods
      loadSpaceData
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionDatapack.scss"></style>
