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
        <SpaceCreator
          :organizations="organizations"
          :initialOrga="currentOrga"
          @space-created="space = $event"
        />
      </div>

      <transition name="slide-fade-down">
        <div class="subscription-platform__content__body" v-show="space">
          <div class="subscription-platform__content__body__left">
            <PlatformSubInfo />
          </div>
          <div class="subscription-platform__content__body__center">
            <PlatformSubForm :space="space" />
          </div>
          <div class="subscription-platform__content__body__right">
            <SpaceSizePreview
              :spaceInfo="spaceInfo"
              :newSizeAvailable="10 * Math.pow(1024, 3)"
            />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useOrganizations } from "@/state/organizations.js";
import { useSubscriptions } from "@/state/subscriptions.js";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import PlatformSubForm from "@/components/specific/payment/platform-sub-form/PlatformSubForm.vue";
import PlatformSubInfo from "@/components/specific/payment/platform-sub-info/PlatformSubInfo.vue";
import SpaceCreator from "@/components/specific/payment/space-creator/SpaceCreator.vue";
import SpaceSizePreview from "@/components/specific/payment/space-size-preview/SpaceSizePreview.vue";

export default {
  components: {
    GoBackButton,
    PlatformSubForm,
    PlatformSubInfo,
    SpaceCreator,
    SpaceSizePreview,
    ViewHeader
  },
  setup() {
    const { userOrganizations } = useOrganizations();
    const { currentOrga } = useSubscriptions();

    const organizations = computed(() =>
      userOrganizations.value.filter(orga => !orga.is_personnal)
    );
    const space = ref(null);
    const spaceInfo = ref({});

    return {
      // References
      currentOrga,
      organizations,
      space,
      spaceInfo
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionPlatform.scss"></style>
