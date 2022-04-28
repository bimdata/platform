<template>
  <div class="dashboard-space-list">
    <div class="dashboard-space-list__title" :class="{ isCarousel }">
      {{ $t("DashboardSpaceList.title") }}
    </div>
    <component
      :class="isCarousel ? '' : 'dashboard-space-list__content'"
      :is="isCarousel ? 'CarouselList' : 'div'"
    >
      <SpaceCard
        v-for="space in displayedSpaces"
        data-guide="dashboard-space"
        :key="space.id"
        :space="space"
        :actionMenu="false"
      />
    </component>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
// Components
import CarouselList from "@/components/generic/carousel-list/CarouselList";
import SpaceCard from "@/components/specific/spaces/space-card/SpaceCard";

export default {
  components: {
    CarouselList,
    SpaceCard
  },
  props: {
    spaces: {
      type: Array,
      required: true
    },
    isCarousel: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const displayedSpaces = ref([]);

    watchEffect(() => {
      if (props.spaces) {
        displayedSpaces.value = props.spaces
          .slice()
          .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
          .slice(0, 10);
      }
    });

    return {
      displayedSpaces
    };
  }
};
</script>

<style scoped lang="scss" src="./DashboardSpaceList.scss"></style>
