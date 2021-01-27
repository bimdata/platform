<template>
  <div class="spaces-view">

    <BIMDataSpinner class="loader" v-if="loading" />

    <template v-else>

      <div class="sub-header">
        <GoBackButton />
        <BIMDataSearch :placeholder="$t('Spaces.searchSpaces')" width="300px"
          class="sub-header__search-input"
          v-model="searchText"
          clear
        />
        <BIMDataButton fill squared icon
          class="sub-header__sort-btn"
          @click="sortSpaces">
          <BIMDataIcon name="alphabeticalSort" size="s" />
        </BIMDataButton>
        <BIMDataButton fill radius color="primary"
          class="sub-header__create-btn"
          @click="createSpace">
          <BIMDataIcon name="plus" size="xxxs" />
          <span>{{ $t('Spaces.createSpace') }}</span>
        </BIMDataButton>
      </div>

      <transition name="fade" appear>
        <div class="spaces-list">
          <transition name="pop-in">
            <SpaceCreationCard v-if="showCreationCard" @close="showCreationCard = false" />
          </transition>
          <transition-group name="card-list">
            <SpaceCard v-for="space in spaces" :key="space.id" :space="space" />
          </transition-group>
        </div>
      </transition>

    </template>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useSpacesState } from '@/state/spacesState';
// Components
import BIMDataButton from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js';
import BIMDataIcon from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js';
import BIMDataSearch from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js';
import BIMDataSpinner from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSpinner.js";
import GoBackButton from '@/components/go-back-button/GoBackButton';
import SpaceCard from '@/components/space-card/SpaceCard';
import SpaceCreationCard from '@/components/space-creation-card/SpaceCreationCard';

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSearch,
    BIMDataSpinner,
    GoBackButton,
    SpaceCard,
    SpaceCreationCard,
  },
  setup() {
    const { spaces } = useSpacesState();

    const loading = ref(false);

    const displayedSpaces = ref([]);
    const searchText = ref('');
    const showCreationCard = ref(false);
    let sortOrder = 'none';

    const filterSpaces = (value) => {
      const text = value.trim().toLowerCase();
      if (text) {
        displayedSpaces.value = spaces.value.filter(
          a => a.name.toLowerCase().includes(text)
        );
      } else {
        displayedSpaces.value = spaces.value;
      }
    };
    const sortSpaces = () => {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      const n = sortOrder === 'desc' ? -1 : 1;
      displayedSpaces.value = displayedSpaces.value.slice().sort(
        (a, b) => (a.name < b.name ? -1 : 1) * n
      );
    };
    const createSpace = () => {
      showCreationCard.value = true;
    };

    watch(
      () => spaces.value,
      (spaces) => displayedSpaces.value = spaces
    );
    watch(
      () => searchText.value,
      (searchText) => filterSpaces(searchText)
    );

    return {
      // References
      loading,
      spaces: displayedSpaces,
      searchText,
      showCreationCard,
      // Methods
      filterSpaces,
      sortSpaces,
      createSpace
    };
  }
}
</script>

<style scoped lang="scss" src="./Spaces.scss"></style>
