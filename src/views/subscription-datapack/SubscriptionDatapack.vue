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
            @datapack-created="onSuccess"
            @datapack-updated="onSuccess"
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
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useNotifications } from "@/composables/notifications.js";
import SIZE_UNIT from "@/config/size-unit.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSubscriptions } from "@/state/subscriptions.js";
import { formatBytes } from "@/utils/files.js";
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
    const { t } = useI18n();
    const router = useRouter();
    const { pushNotification } = useNotifications();
    const { userOrganizations } = useOrganizations();
    const {
      currentOrga,
      currentSpace,
      fetchSpaceInformation,
      loadSpaceSubscriptions,
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
        const info = await fetchSpaceInformation(space);
        const sub = await loadSpaceSubscriptions(space).then(() =>
          getSpaceActiveSubscription(space)
        );
        // This is needed to trigger reactive effects
        spaceInfo.value = { ...info };
        subscription.value = { ...sub };
      }
    };

    const onSuccess = () => {
      pushNotification(
        {
          type: "success",
          title: t("Success"),
          message: t("SubscriptionDatapack.successNotification", {
            spaceName: selectedSpace.value.name,
            size: formatBytes(newSizeAvailable.value)
          })
        },
        8000
      );
      router.back();
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
      onSuccess
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionDatapack.scss"></style>
