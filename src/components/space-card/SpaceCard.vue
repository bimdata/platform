<template>
  <BIMDataCard class="space-card" @click="goToProjects">
    <template #right>
      <SpaceActionMenu v-if="actionMenu" :space="space" />
    </template>
    <template #content>
      <SpaceImage :space="space" />
    </template>
    <template #footer>
      <div>{{ space.name }}</div>
      <div class="title-underline"></div>
    </template>
  </BIMDataCard>
</template>

<script>
import { useRouter } from 'vue-router';
// Components
import BIMDataCard from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataCard.js';
import SpaceActionMenu from '@/components/space-action-menu/SpaceActionMenu';
import SpaceImage from '@/components/space-image/SpaceImage';

export default {
  components: {
    BIMDataCard,
    SpaceActionMenu,
    SpaceImage
  },
  props: {
    space: {
      type: Object,
      required: true
    },
    actionMenu: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const router = useRouter();

    const goToProjects = () => {
      router.push({ name: 'projects', params: { spaceID: props.space.id } });
    };

    return {
      goToProjects
    };
  }
}
</script>

<style scoped lang="scss" src="./SpaceCard.scss"></style>
