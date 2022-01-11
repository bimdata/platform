<template>
  <div class="subscription-pro">
    <ViewHeader>
      <template #left>
        <GoBackButton />
      </template>
      <template #center>
        <h1 class="subscription-pro__title">
          {{
            $t(
              `SubscriptionPro.${
                currentSpace ? "upgradeTitle" : "subscribeTitle"
              }`
            )
          }}
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
        <template v-if="currentSpace">
          <SpaceSelected :space="currentSpace" />
        </template>
        <template v-else>
          <SpaceCreatorV2
            :disabled="!!space"
            :organizations="organizations"
            :initialOrga="orga"
            @space-created="onSpacePreCreated"
          />
        </template>
      </div>

      <transition name="slide-fade-down">
        <div ref="body" class="subscription-pro__content__body" v-show="space">
          <div class="subscription-pro__content__body__left">
            <ProPlanInfo />
          </div>
          <div class="subscription-pro__content__body__center">
            <ProPlanForm :space="space" @space-created="onSpaceCreated" />
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
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useNotifications } from "@/composables/notifications.js";
import { PRO_PLAN_STORAGE } from "@/config/subscription.js";
import routeNames from "@/router/route-names.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSubscriptions } from "@/state/subscriptions.js";
import { formatBytes } from "@/utils/files.js";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import ProPlanForm from "@/components/specific/subscriptions/pro-plan-form/ProPlanForm.vue";
import ProPlanInfo from "@/components/specific/subscriptions/pro-plan-info/ProPlanInfo.vue";
import SpaceCreatorV2 from "@/components/specific/subscriptions/space-creator/SpaceCreatorV2.vue";
import SpaceSelected from "@/components/specific/subscriptions/space-selected/SpaceSelected.vue";
import SpaceSizePreview from "@/components/specific/subscriptions/space-size-preview/SpaceSizePreview.vue";

export default {
  components: {
    GoBackButton,
    ProPlanForm,
    ProPlanInfo,
    SpaceCreatorV2,
    SpaceSelected,
    SpaceSizePreview,
    ViewHeader
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const { pushNotification } = useNotifications();
    const { userOrganizations, getPersonalOrganization } = useOrganizations();
    const {
      currentOrga,
      currentSpace,
      fetchSpaceInformation,
      waitForUpdatedSpaceSize
    } = useSubscriptions();

    const orga = ref(currentOrga.value || getPersonalOrganization());
    const space = ref(null);
    const spaceInfo = ref({});
    const newSizeAvailable = ref(+PRO_PLAN_STORAGE);

    const body = ref(null);

    watch(
      () => currentSpace.value,
      async () => {
        if (currentSpace.value) {
          space.value = currentSpace.value;
          spaceInfo.value = await fetchSpaceInformation(currentSpace.value);
        }
      },
      { immediate: true }
    );

    const onSpacePreCreated = preCreatedSpace => {
      space.value = preCreatedSpace;
      setTimeout(() => body.value.scrollIntoView({ behavior: "smooth" }));
    };

    const onSpaceCreated = async createdSpace => {
      const isSpaceUpgrade = !!currentSpace.value;

      if (isSpaceUpgrade) {
        await waitForUpdatedSpaceSize(
          currentSpace.value,
          spaceInfo.value.smartDataSizeAvailable,
          newSizeAvailable.value
        );
      }

      pushNotification(
        {
          type: "success",
          title: t("Success"),
          message: t(
            `SubscriptionPro.${
              isSpaceUpgrade
                ? "spaceUpgradedNotification"
                : "spaceCreatedNotification"
            }`,
            {
              organizationName: createdSpace.organization.name,
              spaceName: createdSpace.name
            }
          )
        },
        8000
      );

      router.push({
        name: routeNames.spaceBoard,
        params: {
          spaceID: createdSpace.id
        }
      });
    };

    return {
      // References
      body,
      // currentOrga,
      currentSpace,
      newSizeAvailable,
      orga,
      organizations: userOrganizations,
      space,
      spaceInfo,
      // Methods
      formatBytes,
      onSpaceCreated,
      onSpacePreCreated
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionPro.scss"></style>
