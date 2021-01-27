<template>
  <div class="recent-spaces-list">
    <div class="recent-spaces-list__title">{{ $t('RecentSpacesList.title') }}</div>
    <div class="recent-spaces-list__content">
      <SpaceCard v-for="space in recentSpaces" :key="space.id"
        :space="space"
        :actionMenu="false"
      />
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from 'vue';
import { useSpacesState } from '@/state/spacesState';
// Components
import SpaceCard from '@/components/space-card/SpaceCard';

export default {
  components: {
    SpaceCard
  },
  setup() {
    const { spaces } = useSpacesState();

    const recentSpaces = ref([]);

    watchEffect(() => {
      if (spaces.value) {
        recentSpaces.value = 
          spaces.value.slice()
            .sort((a, b) => a.updatedAt < b.updatedAt ? 1 : -1)
            .slice(0, 7);
      }
    });

    return {
      recentSpaces
    };
  }
}
</script>

<style scoped lang="scss" src="./RecentSpacesList.scss"></style>
