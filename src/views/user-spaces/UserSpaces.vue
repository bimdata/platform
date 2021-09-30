<template>
  <div data-test="user-spaces" class="view user-spaces">
    <ViewHeader class="user-spaces__header">
      <template #left>
        <AppBreadcrumb />
      </template>
      <template #center>
        <BIMDataSearch
          data-test="input-search"
          class="user-spaces__header__search"
          width="300px"
          :placeholder="$t('UserSpaces.searchInputPlaceholder')"
          v-model="searchText"
          clear
        />
      </template>
      <template #right>
        <BIMDataButton
          data-test="btn-sort"
          class="user-spaces__header__btn-sort"
          fill
          squared
          icon
          @click="sortSpaces"
        >
          <BIMDataIcon name="alphabeticalSort" size="s" />
        </BIMDataButton>
        <BIMDataButton
          width="120px"
          fill
          radius
          @click="openOrganizationsManager"
        >
          {{ $t("UserSpaces.organizationsButtonText") }}
        </BIMDataButton>
        <BIMDataButton
          data-test="btn-open-create"
          class="user-spaces__header__btn-create"
          width="120px"
          color="primary"
          fill
          radius
          @click="openCreationForm"
        >
          <BIMDataIcon name="plus" size="xxxs" margin="0 6px 0 0" />
          <span>{{ $t("UserSpaces.createButtonText") }}</span>
        </BIMDataButton>
      </template>
    </ViewHeader>

    <SidePanel :title="$t('OrganizationsManager.title')">
      <OrganizationsManager :organizations="organizations" />
    </SidePanel>

    <ResponsiveGrid itemWidth="215px">
      <SpaceCreationCard
        v-if="showCreationForm"
        :key="-1"
        @close="closeCreationForm"
      />
      <SpaceCard v-for="space in spaces" :key="space.id" :space="space" />
    </ResponsiveGrid>
  </div>
</template>

<script>
import { useListFilter } from "@/composables/list-filter.js";
import { useListSort } from "@/composables/list-sort.js";
import { useSidePanel } from "@/composables/side-panel.js";
import { useToggle } from "@/composables/toggle.js";
import { useOrganizations } from "@/state/organizations.js";
import { useSpaces } from "@/state/spaces.js";
// Components
import ResponsiveGrid from "@/components/generic/responsive-grid/ResponsiveGrid.vue";
import SidePanel from "@/components/generic/side-panel/SidePanel.vue";
import ViewHeader from "@/components/generic/view-header/ViewHeader.vue";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb.vue";
import OrganizationsManager from "@/components/specific/organizations/organizations-manager/OrganizationsManager.vue";
import SpaceCard from "@/components/specific/spaces/space-card/SpaceCard.vue";
import SpaceCreationCard from "@/components/specific/spaces/space-creation-card/SpaceCreationCard.vue";

export default {
  components: {
    ResponsiveGrid,
    SidePanel,
    ViewHeader,
    AppBreadcrumb,
    OrganizationsManager,
    SpaceCard,
    SpaceCreationCard
  },
  setup() {
    const { openSidePanel } = useSidePanel();
    const { userOrganizations } = useOrganizations();
    const { userSpaces } = useSpaces();

    const {
      isOpen: showCreationForm,
      open: openCreationForm,
      close: closeCreationForm
    } = useToggle();

    const { filteredList: displayedSpaces, searchText } = useListFilter(
      userSpaces,
      space => space.name
    );

    const { sortToggle: sortSpaces } = useListSort(
      displayedSpaces,
      space => space.name
    );

    return {
      // References
      organizations: userOrganizations,
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
