<template>
  <div data-test="user-spaces" class="view user-spaces">
    <ViewHeader class="user-spaces__header">
      <template #left>
        <AppBreadcrumb />
      </template>
      <template #center>
        <BIMDataSearch
          class="user-spaces__header__search"
          width="300px"
          :placeholder="$t('UserSpaces.searchInputPlaceholder')"
          v-model="searchText"
          clear
        />
      </template>
      <template #right>
        <BIMDataButton
          class="user-spaces__header__btn-sort"
          fill
          squared
          icon
          @click="sortSpaces"
        >
          <BIMDataIcon name="alphabeticalSort" size="s" />
        </BIMDataButton>
        <BIMDataButton
          v-if="isSubscriptionEnabled"
          width="120px"
          fill
          radius
          @click="openOrganizationsManager"
        >
          {{ $t("UserSpaces.organizationsButtonText") }}
        </BIMDataButton>

        <template v-if="isSubscriptionEnabled">
          <AppLink :to="{ name: routeNames.subscriptionPro }">
            <BIMDataButton
              class="user-spaces__header__btn-create"
              width="120px"
              color="secondary"
              fill
              radius
            >
              <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
              <span>{{ $t("UserSpaces.createButtonText") }}</span>
            </BIMDataButton>
          </AppLink>
        </template>
        <template v-else>
          <BIMDataButton
            class="user-spaces__header__btn-create"
            width="120px"
            color="primary"
            fill
            radius
            @click="openCreationForm()"
          >
            <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
            <span>{{ $t("UserSpaces.createButtonText") }}</span>
          </BIMDataButton>
        </template>
      </template>
    </ViewHeader>

    <AppSidePanel
      v-if="isSubscriptionEnabled"
      :title="$t('OrganizationsManager.title')"
    >
      <AppLoading name="spaces-subscriptions">
        <OrganizationsManager :organizations="organizations" />
      </AppLoading>
    </AppSidePanel>

    <BIMDataResponsiveGrid itemWidth="215px" rowGap="36px" columnGap="36px">
      <transition-group name="grid">
        <SpaceCreationCard
          v-if="showCreationForm"
          :key="-1"
          @close="closeCreationForm"
        />
        <SpaceCard v-for="space in spaces" :key="space.id" :space="space" />
      </transition-group>
    </BIMDataResponsiveGrid>
  </div>
</template>

<script>
import { useListFilter } from "@/composables/list-filter.js";
import { useListSort } from "@/composables/list-sort.js";
import { useAppSidePanel } from "@/components/specific/app/app-side-panel/app-side-panel.js";
import { useToggle } from "@/composables/toggle.js";
import { IS_SUBSCRIPTION_ENABLED } from "@/config/subscription.js";
import routeNames from "@/router/route-names.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSpaces } from "@/state/spaces.js";
// Components
import AppLoading from "@/components/specific/app/app-loading/AppLoading.vue";
import ViewHeader from "@/components/specific/app/view-header/ViewHeader.vue";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import AppLink from "@/components/specific/app/app-link/AppLink.vue";
import AppSidePanel from "@/components/specific/app/app-side-panel/AppSidePanel.vue";
import OrganizationsManager from "@/components/specific/organizations/organizations-manager/OrganizationsManager.vue";
import SpaceCard from "@/components/specific/spaces/space-card/SpaceCard.vue";
import SpaceCreationCard from "@/components/specific/spaces/space-creation-card/SpaceCreationCard.vue";

export default {
  components: {
    AppBreadcrumb,
    AppLink,
    AppLoading,
    AppSidePanel,
    OrganizationsManager,
    SpaceCard,
    SpaceCreationCard,
    ViewHeader
  },
  setup() {
    const { openSidePanel } = useAppSidePanel();
    const { userOrganizations } = useOrganizations();
    const { userSpaces } = useSpaces();

    const { filteredList: displayedSpaces, searchText } = useListFilter(
      userSpaces,
      space => space.name
    );

    const { sortToggle: sortSpaces } = useListSort(
      displayedSpaces,
      space => space.name
    );

    const {
      isOpen: showCreationForm,
      open: openCreationForm,
      close: closeCreationForm
    } = useToggle();

    return {
      // References
      isSubscriptionEnabled: IS_SUBSCRIPTION_ENABLED,
      organizations: userOrganizations,
      routeNames,
      searchText,
      showCreationForm,
      spaces: displayedSpaces,
      // Methods
      closeCreationForm,
      openCreationForm,
      openOrganizationsManager: openSidePanel,
      sortSpaces
    };
  }
};
</script>

<style scoped lang="scss" src="./UserSpaces.scss"></style>
