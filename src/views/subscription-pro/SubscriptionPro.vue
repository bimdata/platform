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
        {{
          $t("SubscriptionPro.text", { size: formatBytes(newSizeAvailable) })
        }}
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
            <ProPlanForm :space="space" @space-created="goToSpaceBoard" />
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
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useNotifications } from "@/composables/notifications.js";
import routeNames from "@/router/route-names.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSubscriptions } from "@/state/subscriptions.js";
import { formatBytes } from "@/utils/files.js";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import ProPlanForm from "@/components/specific/subscriptions/pro-plan-form/ProPlanForm.vue";
import ProPlanInfo from "@/components/specific/subscriptions/pro-plan-info/ProPlanInfo.vue";
import SpaceCreator from "@/components/specific/subscriptions/space-creator/SpaceCreator.vue";
import SpaceSizePreview from "@/components/specific/subscriptions/space-size-preview/SpaceSizePreview.vue";

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
    const { t } = useI18n();
    const router = useRouter();
    const { pushNotification } = useNotifications();
    const { userOrganizations } = useOrganizations();
    const { currentOrga } = useSubscriptions();

    const space = ref(null);
    const spaceInfo = ref({});
    const newSizeAvailable = ref(+process.env.VUE_APP_PRO_PLAN_STORAGE);

    const goToSpaceBoard = space => {
      pushNotification({
        type: "success",
        title: t("Success"),
        message: t("SubscriptionPro.spaceCreatedNotification", {
          organizationName: space.organization.name,
          spaceName: space.name
        })
      });
      router.push({
        name: routeNames.spaceBoard,
        params: { spaceID: space.id }
      });
    };

    return {
      // References
      currentOrga,
      newSizeAvailable,
      organizations: userOrganizations,
      space,
      spaceInfo,
      // Methods
      formatBytes,
      goToSpaceBoard
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionPro.scss"></style>
