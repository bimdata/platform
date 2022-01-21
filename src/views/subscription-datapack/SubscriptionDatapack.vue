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
        <SpaceSelected :space="currentSpace" />
      </div>

      <div class="subscription-datapack__content__body">
        <DatapackInfo :spaceSubInfo="spaceSubInfo" :datapack="datapack" />
        <DatapackForm
          :space="currentSpace"
          :spaceSubInfo="spaceSubInfo"
          :datapack="datapack"
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
import { useAppNotification } from "@/components/specific/app/app-notification/app-notification.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSubscriptions } from "@/state/subscriptions.js";
import routeNames from "@/router/route-names.js";
import { formatBytes } from "@/utils/files.js";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import DatapackForm from "@/components/specific/subscriptions/datapack-form/DatapackForm.vue";
import DatapackInfo from "@/components/specific/subscriptions/datapack-info/DatapackInfo.vue";
import SpaceSelected from "@/components/specific/subscriptions/space-selected/SpaceSelected.vue";

export default {
  components: {
    DatapackForm,
    DatapackInfo,
    GoBackButton,
    SpaceSelected,
    ViewHeader
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const { pushNotification } = useAppNotification();
    const { userOrganizations } = useOrganizations();
    const {
      currentOrga,
      currentSpace,
      fetchSpaceSubInfo,
      loadSpaceSubscriptions,
      getSpaceActiveDatapack,
      waitForUpdatedSpaceSize
    } = useSubscriptions();

    const loading = ref(false);
    provide("loading", loading);

    const spaceSubInfo = ref({});
    const datapack = ref(null);

    watch(
      () => currentSpace.value,
      async space => {
        spaceSubInfo.value = await fetchSpaceSubInfo(space);
        datapack.value = await loadSpaceSubscriptions(space).then(() =>
          getSpaceActiveDatapack(space)
        );
      },
      { immediate: true }
    );

    const onSuccess = async ({ size }) => {
      await waitForUpdatedSpaceSize(
        currentSpace.value,
        spaceSubInfo.value.smartDataSizeAvailable
      );

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

    return {
      // References
      currentOrga,
      currentSpace,
      datapack,
      loading,
      organizations: userOrganizations,
      spaceSubInfo,
      // Methods
      onSuccess
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionDatapack.scss"></style>
