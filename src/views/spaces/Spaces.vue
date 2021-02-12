<template>
  <div class="spaces-view">
    <div class="sub-header">
      <div class="sub-header--left">
        <GoBackButton />
      </div>
      <div class="sub-header--center">
        <BIMDataSearch
          width="300px"
          :placeholder="$t('Spaces.searchSpaces')"
          v-model="searchText"
          clear
        />
      </div>
      <div class="sub-header--right">
        <BIMDataButton fill squared icon @click="sortSpaces">
          <BIMDataIcon name="alphabeticalSort" size="s" />
        </BIMDataButton>
        <BIMDataButton fill radius color="primary" @click="createSpace">
          <BIMDataIcon name="plus" size="xxxs" />
          <span>{{ $t("Spaces.createSpace") }}</span>
        </BIMDataButton>
      </div>
    </div>

    <transition name="fade" appear>
      <div class="list-container">
        <transition name="pop-in">
          <SpaceCreationCard
            v-if="showCreationCard"
            @close="showCreationCard = false"
          />
        </transition>
        <transition-group name="card-list">
          <SpaceCard v-for="space in spaces" :key="space.id" :space="space" />
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useSpaces } from "@/state/spaces";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSearch from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js";
import GoBackButton from "@/components/go-back-button/GoBackButton";
import SpaceCard from "@/components/space-card/SpaceCard";
import SpaceCreationCard from "@/components/space-creation-card/SpaceCreationCard";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSearch,
    GoBackButton,
    SpaceCard,
    SpaceCreationCard
  },
  setup() {
    const { spaces } = useSpaces();

    const displayedSpaces = ref([]);
    watchEffect(() => (displayedSpaces.value = spaces.value));

    const searchText = ref("");
    const filterSpaces = value => {
      const text = value.trim().toLowerCase();
      if (text) {
        displayedSpaces.value = spaces.value.filter(a =>
          a.name.toLowerCase().includes(text)
        );
      } else {
        displayedSpaces.value = spaces.value;
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

<style scoped lang="scss" src="./Spaces.scss"></style>
