<template>
  <div class="subscription-datapack">
    <ViewHeader>
      <template #center>
        <h1 class="subscription-datapack__title">
          {{ $t("SubscriptionDatapack.title") }}
        </h1>
      </template>
    </ViewHeader>

    <div class="subscription-datapack__content">
      <div class="subscription-datapack__content__head">
        <SpaceSelected :space="currentSpace" />
      </div>

      <div class="subscription-datapack__content__body">
        <DatapackInfo :spaceInfo="spaceInfo" :subscription="subscription" />
        <DatapackForm
          :space="currentSpace"
          :spaceInfo="spaceInfo"
          :subscription="subscription"
          @datapack-created="onSuccess"
          @datapack-updated="onSuccess"
        />
      </div>
    </div>

    <div class="subscription-datapack__loader" v-show="loading">
      <BIMDataSpinner />
    </div>
  </div>
</template>

<script>
import { provide, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useNotifications } from "@/composables/notifications.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSubscriptions } from "@/state/subscriptions.js";
import routeNames from "@/router/route-names.js";
import { formatBytes } from "@/utils/files.js";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import DatapackForm from "@/components/specific/subscriptions/datapack-form/DatapackForm.vue";
import DatapackInfo from "@/components/specific/subscriptions/datapack-info/DatapackInfo.vue";
import SpaceSelected from "@/components/specific/subscriptions/space-selected/SpaceSelected.vue";

export default {
  components: {
    DatapackForm,
    DatapackInfo,
    SpaceSelected,
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

    const spaceInfo = ref({});
    const subscription = ref(null);

    const loadSpaceData = async space => {
      if (space && space.id) {
        spaceInfo.value = await fetchSpaceInformation(space);
        subscription.value = await loadSpaceSubscriptions(space).then(() =>
          getSpaceActiveSubscription(space)
        );
      }
    };

    const onSuccess = ({ size }) => {
      pushNotification(
        {
          type: "success",
          title: t("Success"),
          message: t("SubscriptionDatapack.successNotification", {
            spaceName: currentSpace.value.name,
            size: formatBytes(size)
          })
        },
        8000
      );

      router.push({
        name: routeNames.spaceBoard,
        params: {
          spaceID: currentSpace.value.id
        }
      });
    };

    watch(
      () => currentSpace.value,
      space => loadSpaceData(space),
      { immediate: true }
    );

    return {
      // References
      currentOrga,
      currentSpace,
      loading,
      organizations: userOrganizations,
      spaceInfo,
      subscription,
      // Methods
      onSuccess
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionDatapack.scss"></style>
