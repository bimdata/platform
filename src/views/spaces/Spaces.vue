<template>
  <div class="spaces-view">
    <div class="sub-header">
      <GoBackButton />
      <BIMDataSearch :placeholder="$t('Spaces.searchSpaces')" width="300px"
        class="sub-header__search-input"
        v-model="searchText"
        clear
      />
      <BIMDataButton fill squared
        class="sub-header__sort-btn"
        @click="sortSpaces">
        <BIMDataIcon name="listManage" size="xxxs" />
      </BIMDataButton>
      <BIMDataButton fill radius color="primary"
        class="sub-header__create-btn"
        @click="createSpace">
        <BIMDataIcon name="plus" size="xxxs" />
        <span>{{ $t('Spaces.createSpace') }}</span>
      </BIMDataButton>
    </div>
    <div class="space-list">
      <transition name="pop-in">
        <SpaceCreationCard v-if="onCreate" @close="onCreate = false" />
      </transition>
      <transition-group name="space-list">
        <SpaceCard v-for="space in spaces" :key="space.id" :space="space" />
      </transition-group>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch } from 'vue';
import { useSpacesState } from '@/state/spacesState';
// Components
import BIMDataButton from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js';
import BIMDataIcon from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js';
import BIMDataSearch from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSearch.js';
import GoBackButton from '@/components/go-back-button/GoBackButton';
import SpaceCard from '@/components/space-card/SpaceCard';
import SpaceCreationCard from '@/components/space-creation-card/SpaceCreationCard';

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
    const { spaces, fetchSpaces } = useSpacesState();

    const displayedSpaces = ref([]);
    const searchText = ref('');
    const onCreate = ref(false);
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
      onCreate.value = true;
    };

    watch(
      () => spaces.value,
      (spaces) => displayedSpaces.value = spaces
    );
    watch(
      () => searchText.value,
      (searchText) => filterSpaces(searchText)
    );

    onMounted(() => fetchSpaces());

    return {
      spaces: displayedSpaces,
      onCreate,
      searchText,
      filterSpaces,
      sortSpaces,
      createSpace
    };
  }
}
</script>

<style scoped lang="scss" src="./Spaces.scss"></style>
