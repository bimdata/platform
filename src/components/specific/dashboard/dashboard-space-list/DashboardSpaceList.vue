<template>
  <div class="dashboard-space-list">
    <div class="dashboard-space-list__title" :class="{ isCarousel }">
      {{ $t("DashboardSpaceList.title") }}
    </div>
    <component
      :class="isCarousel ? '' : 'dashboard-space-list__content'"
      :is="isCarousel ? 'BIMDataCarousel' : 'div'"
    >
      <SpaceCard
        v-for="space in displayedSpaces"
        data-guide="dashboard-space"
        :key="space.id"
        :space="space"
      />
    </component>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
// Components
import SpaceCard from "../../spaces/space-card/SpaceCard.vue";

export default {
  components: {
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
          .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
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
