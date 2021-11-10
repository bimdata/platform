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
      <BIMDataButton
        v-if="isSubscriptionEnabled"
        width="48%"
        color="secondary"
        fill
        radius
        @click="goToSubscriptionPro"
      >
        <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
        <span>{{ $t("OrganizationSpacesList.addButtonText") }}</span>
      </BIMDataButton>
    </div>
    <BIMDataSearch
      width="100%"
      :placeholder="$t('OrganizationSpacesList.searchInputPlaceholder')"
      v-model="searchText"
      clear
    />
    <div class="organization-spaces-list__title">
      {{ $t("OrganizationSpacesList.spaceListTitle") }}
    </div>
    <div class="organization-spaces-list__container">
      <transition-group name="list">
        <OrganizationSpaceCard
          v-for="space of displayedSpaces"
          :key="space.id"
          :organization="localState.organization"
          :space="space"
        />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { computed, inject } from "vue";
import { useRouter } from "vue-router";
import { useListFilter } from "@/composables/list-filter.js";
import { IS_SUBCRIPTION_ENABLED } from "@/config/subscription.js";
import routeNames from "@/router/route-names.js";
import { useOrganizations } from "@/state/organizations.js";
// Components
import OrganizationSpaceCard from "./organization-space-card/OrganizationSpaceCard.vue";

export default {
  components: {
    OrganizationSpaceCard
  },
  setup() {
    const router = useRouter();
    const { getOrganizationSpaces } = useOrganizations();

    const localState = inject("localState");

    const { filteredList: displayedSpaces, searchText } = useListFilter(
      computed(() => getOrganizationSpaces(localState.organization)),
      space => space.name
    );

    const goToSubscriptionPro = () => {
      router.push({
        name: routeNames.subscriptionPro,
        query: {
          organization: localState.organization.id
        }
      });
    };

    return {
      // References
      displayedSpaces,
      isSubscriptionEnabled: IS_SUBCRIPTION_ENABLED,
      localState,
      searchText,
      // Methods
      goToSubscriptionPro
    };
  }
};
</script>

<style scoped lang="scss" src="./OrganizationSpacesList.scss"></style>
