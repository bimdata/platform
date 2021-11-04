<template>
  <div class="subscription-pro">
    <ViewHeader>
      <template #left>
        <GoBackButton />
      </template>
      <template #center>
        <h1 class="subscription-pro__title">
          {{ $t("SubscriptionPro.title") }}
        </h1>
      </template>
    </ViewHeader>

    <div class="subscription-pro__content">
      <div class="subscription-pro__content__text">
        {{ $t("SubscriptionPro.text") }}
      </div>

      <div class="subscription-pro__content__head">
        <SpaceCreator
          :organizations="organizations"
          :initialOrga="currentOrga"
          @space-created="space = $event"
        />
      </div>

      <transition name="slide-fade-down">
        <div class="subscription-pro__content__body" v-show="space">
          <div class="subscription-pro__content__body__left">
            <ProPlanInfo />
          </div>
          <div class="subscription-pro__content__body__center">
            <ProPlanForm :space="space" />
          </div>
          <div class="subscription-pro__content__body__right">
            <SpaceSizePreview
              :spaceInfo="spaceInfo"
              :newSizeAvailable="newSizeAvailable"
            />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useOrganizations } from "@/state/organizations.js";
import { useSubscriptions } from "@/state/subscriptions.js";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import ProPlanForm from "@/components/specific/payment/pro-plan-form/ProPlanForm.vue";
import ProPlanInfo from "@/components/specific/payment/pro-plan-info/ProPlanInfo.vue";
import SpaceCreator from "@/components/specific/payment/space-creator/SpaceCreator.vue";
import SpaceSizePreview from "@/components/specific/payment/space-size-preview/SpaceSizePreview.vue";

export default {
  components: {
    GoBackButton,
    ProPlanForm,
    ProPlanInfo,
    SpaceCreator,
    SpaceSizePreview,
    ViewHeader
  },
  setup() {
    const { userOrganizations } = useOrganizations();
    const { currentOrga } = useSubscriptions();

    const space = ref(null);
    const spaceInfo = ref({});
    const newSizeAvailable = ref(
      +process.env.VUE_APP_PLATFORM_SUBSCRIPTION_STORAGE
    );

    return {
      // References
      currentOrga,
      newSizeAvailable,
      organizations: userOrganizations,
      space,
      spaceInfo
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionPro.scss"></style>
