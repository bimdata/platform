<template>
  <div class="user-spaces-view">
    <ViewHeader class="user-spaces-view__header">
      <template #left>
        <AppBreadcrumb />
      </template>
      <template #center>
        <BIMDataSearch
          class="user-spaces-view__header__search"
          width="300px"
          :placeholder="$t('Spaces.searchSpaces')"
          v-model="searchText"
          clear
        />
      </template>
      <template #right>
        <BIMDataButton
          class="user-spaces-view__header__sort-btn"
          fill
          squared
          icon
          @click="sortSpaces"
        >
          <BIMDataIcon name="alphabeticalSort" size="s" />
        </BIMDataButton>
        <BIMDataButton color="primary" fill radius @click="createSpace">
          <BIMDataIcon name="plus" size="xxxs" />
          <span>{{ $t("Spaces.createSpace") }}</span>
        </BIMDataButton>
      </template>
    </ViewHeader>

    <ResponsiveGrid itemWidth="215px">
      <SpaceCreationCard
        :key="-1"
        v-if="showCreationCard"
        @close="showCreationCard = false"
      />
      <SpaceCard v-for="space in spaces" :key="space.id" :space="space" />
    </ResponsiveGrid>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useSpaces } from "@/state/spaces";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";
import ResponsiveGrid from "@/components/generic/responsive-grid/ResponsiveGrid";
import ViewHeader from "@/components/generic/view-header/ViewHeader";
import AppBreadcrumb from "@/components/specific/app/app-breadcrumb/AppBreadcrumb";
import SpaceCard from "@/components/specific/spaces/space-card/SpaceCard";
import SpaceCreationCard from "@/components/specific/spaces/space-creation-card/SpaceCreationCard";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSearch,
    ResponsiveGrid,
    ViewHeader,
    AppBreadcrumb,
    SpaceCard,
    SpaceCreationCard
  },
  setup() {
    const { userSpaces } = useSpaces();

    const displayedSpaces = ref([]);
    watchEffect(() => (displayedSpaces.value = userSpaces.value));

    const searchText = ref("");
    const filterSpaces = value => {
      const text = value.trim().toLowerCase();
      if (text) {
        displayedSpaces.value = userSpaces.value.filter(a =>
          a.name.toLowerCase().includes(text)
        );
      } else {
        displayedSpaces.value = userSpaces.value;
      }
    };
    watchEffect(() => filterSpaces(searchText.value));

    let sortOrder = "none";
    const sortSpaces = () => {
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
      const n = sortOrder === "desc" ? -1 : 1;
      displayedSpaces.value = displayedSpaces.value
        .slice()
        .sort((a, b) => (a.name < b.name ? -1 : 1) * n);
    };

    const showCreationCard = ref(false);
    const createSpace = () => {
      showCreationCard.value = true;
    };

    return {
      // References
      searchText,
      showCreationCard,
      spaces: displayedSpaces,
      // Methods
      createSpace,
      sortSpaces
    };
  }
};
</script>

<style scoped lang="scss" src="./UserSpaces.scss"></style>
