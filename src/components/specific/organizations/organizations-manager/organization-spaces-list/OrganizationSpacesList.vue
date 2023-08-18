<template>
  <div class="organization-spaces-list">
    <div class="organization-spaces-list__actions">
      <BIMDataButton
        width="48%"
        color="primary"
        outline
        radius
        @click="localState.currentView = 'spaces-import'"
      >
        {{ $t("OrganizationSpacesList.importButtonText") }}
      </BIMDataButton>
      <AppLink
        v-if="isSubscriptionEnabled"
        style="width: 48%"
        :to="{
          name: routeNames.subscriptionPro,
          query: {
            organization: localState.organization.id
          }
        }"
      >
        <BIMDataButton width="100%" color="secondary" fill radius>
          <BIMDataIconPlus size="xxxs" margin="0 6px 0 0" />
          <span>{{ $t("OrganizationSpacesList.addButtonText") }}</span>
        </BIMDataButton>
      </AppLink>
    </div>
    <BIMDataSearch
      width="100%"
      :placeholder="$t('t.search')"
      v-model="searchText"
      clear
    />
    <div class="organization-spaces-list__title">
      {{ $t("OrganizationSpacesList.spaceListTitle") }}
    </div>
    <div class="organization-spaces-list__container" v-if="spaces.length > 0">
      <transition-group name="list">
        <OrganizationSpaceCard
          v-for="space of displayedSpaces"
          :key="space.id"
          :organization="localState.organization"
          :space="space"
        />
      </transition-group>
    </div>
    <div class="organization-spaces-list__placeholder" v-else>
      {{ $t("OrganizationSpacesList.spaceListPlaceholder") }}
    </div>
  </div>
</template>

<script>
import { computed, inject } from "vue";
import { useListFilter } from "../../../../../composables/list-filter.js";
import { IS_SUBSCRIPTION_ENABLED } from "../../../../../config/subscription.js";
import routeNames from "../../../../../router/route-names.js";
import { useOrganizations } from "../../../../../state/organizations.js";
// Components
import AppLink from "../../../app/app-link/AppLink.vue";
import OrganizationSpaceCard from "./organization-space-card/OrganizationSpaceCard.vue";

export default {
  components: {
    AppLink,
    OrganizationSpaceCard
  },
  setup() {
    const { getOrganizationSpaces } = useOrganizations();

    const localState = inject("localState");

    const spaces = computed(() =>
      getOrganizationSpaces(localState.organization)
    );

    const { filteredList: displayedSpaces, searchText } = useListFilter(
      spaces,
      space => space.name
    );

    return {
      // References
      displayedSpaces,
      isSubscriptionEnabled: IS_SUBSCRIPTION_ENABLED,
      localState,
      routeNames,
      searchText,
      spaces
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationSpacesList.scss"></style>
