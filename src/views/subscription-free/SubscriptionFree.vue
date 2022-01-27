<template>
  <div class="view subscription-free">
    <ViewHeader>
      <template #left>
        <GoBackButton />
      </template>
      <template #center>
        <h1 class="subscription-free__title">
          {{ $t("SubscriptionFree.title") }}
        </h1>
      </template>
    </ViewHeader>
    <div class="subscription-free__body">
      <p class="subscription-free__body__text">
        {{ $t("SubscriptionFree.text", { size }) }}
      </p>
      <div class="subscription-free__body__content">
        <SpaceCreator
          type="free"
          :organizations="organizations"
          :initialOrga="orga"
          @space-created="onSpaceCreated"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useAppNotification } from "@/components/specific/app/app-notification/app-notification.js";
import { FREE_PLAN_STORAGE } from "@/config/subscription.js";
import routeNames from "@/router/route-names.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSubscriptions } from "@/state/subscriptions.js";
import { formatBytes } from "@/utils/files.js";
// Components
import ViewHeader from "@/components/specific/app/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import SpaceCreator from "@/components/specific/subscriptions/space-creator/SpaceCreator.vue";

export default {
  components: {
    GoBackButton,
    SpaceCreator,
    ViewHeader
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const { pushNotification } = useAppNotification();
    const { userOrganizations, getPersonalOrganization } = useOrganizations();
    const { currentOrga } = useSubscriptions();

    const orga = ref(currentOrga.value || getPersonalOrganization());
    const size = formatBytes(FREE_PLAN_STORAGE);

    const onSpaceCreated = space => {
      pushNotification({
        type: "success",
        title: t("Success"),
        message: t("SubscriptionFree.spaceCreatedNotification", {
          organizationName: space.organization.name,
          spaceName: space.name
        })
      });
      router.push({
        name: routeNames.spaceBoard,
        params: {
          spaceID: space.id
        }
      });
    };

    return {
      // References
      orga,
      organizations: userOrganizations,
      size,
      // Methods
      onSpaceCreated
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionFree.scss"></style>
