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
import { onMounted, ref } from 'vue';
import { useSpacesState } from '@/state/spacesState';
// Components
import SpaceCard from '@/components/space-card/SpaceCard';

export default {
  components: {
    SpaceCard
  },
  setup() {
    const { spaces, fetchSpaces } = useSpacesState();

    const recentSpaces = ref([]);

    onMounted(() => {
      fetchSpaces().then(() => {
        recentSpaces.value = spaces.value.slice()
          .sort((a, b) => a.updatedAt < b.updatedAt ? 1 : -1)
          .slice(0, 10);
      });
    });

    return {
      recentSpaces
    };
  }
}
</script>

<style scoped lang="scss" src="./RecentSpacesList.scss"></style>
