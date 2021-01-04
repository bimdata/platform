<template>
  <div class="spaces-view">
    <BIMDataCard v-for="space in spaces" :key="space.id"
      :titleHeader="space.name"
      :submenuText="`${space.creator.firstname} ${space.creator.lastname}`">
      <template #content>
        <img :src="space.image" />
      </template>
    </BIMDataCard>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useSpacesState } from '@/state/spacesState';
// Components
import BIMDataCard from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js';

export default {
  components: {
    BIMDataCard
  },
  setup() {
    const { spaces, fetchSpaces } = useSpacesState();

    onMounted(() => fetchSpaces());

    return {
      spaces
    };
  }
}
</script>

<style lang="scss" scoped>
@import './Spaces.scss';
</style>
