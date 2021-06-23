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
          data-test="btn-open-create"
          class="user-spaces__header__btn-create"
          color="primary"
          fill
          radius
          @click="openCreationForm"
        >
          <BIMDataIcon name="plus" size="xxxs" />
          <span>{{ $t("UserSpaces.createButtonText") }}</span>
        </BIMDataButton>
      </template>
    </ViewHeader>

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
import { useListFilter } from "@/composables/list-filter";
import { useListSort } from "@/composables/list-sort";
import { useToggle } from "@/composables/toggle";
import { useSpaces } from "@/state/spaces";
// Components
import ResponsiveGrid from "@/components/generic/responsive-grid/ResponsiveGrid";
import ViewHeader from "@/components/generic/view-header/ViewHeader";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import SpaceCard from "@/components/specific/spaces/space-card/SpaceCard";
import SpaceCreationCard from "@/components/specific/spaces/space-creation-card/SpaceCreationCard";

export default {
  components: {
    ResponsiveGrid,
    ViewHeader,
    AppBreadcrumb,
    SpaceCard,
    SpaceCreationCard
  },
  setup() {
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
      searchText,
      showCreationForm,
      spaces: displayedSpaces,
      // Methods
      closeCreationForm,
      openCreationForm,
      sortSpaces
    };
  }
};
</script>

<style scoped lang="scss" src="./UserSpaces.scss"></style>
