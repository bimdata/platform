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
        {{ $t("SubscriptionFree.text") }}
      </p>
      <div class="subscription-free__body__content">
        <SpaceCreator
          :organizations="organizations"
          :initialOrga="currentOrga"
          @space-created="onSpaceCreated"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { routeNames } from "@/router/index.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSubscriptions } from "@/state/subscriptions.js";
// Components
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton.vue";
import SpaceCreator from "@/components/specific/subscriptions/space-creator/SpaceCreator.vue";

export default {
  components: {
    GoBackButton,
    SpaceCreator,
    ViewHeader
  },
  setup() {
    const router = useRouter();
    const { userOrganizations } = useOrganizations();
    const { currentOrga } = useSubscriptions();

    const space = ref(null);

    const onSpaceCreated = space => {
      router.push({
        name: routeNames.spaceBoard,
        params: {
          spaceID: space.id
        }
      });
    };

    return {
      // References
      currentOrga,
      organizations: userOrganizations,
      space,
      // Methods
      onSpaceCreated
    };
  }
};
</script>

<style scoped lang="scss" src="./SubscriptionFree.scss"></style>
