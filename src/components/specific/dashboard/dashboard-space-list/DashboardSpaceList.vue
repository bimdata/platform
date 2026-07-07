<template>
  <div class="dashboard-space-list">
    <AppLink
      class="dashboard-space-list__title"
      :class="{ isCarousel }"
      :to="{ name: routeNames.userSpaces }"
    >
      <span>{{ $t("DashboardSpaceList.title") }}</span>
      <BIMDataIconChevron size="xxs" />
    </AppLink>
    <component
      :class="isCarousel ? '' : 'dashboard-space-list__content'"
      :is="isCarousel ? 'BIMDataCarousel' : 'div'"
    >
      <SpaceCreationCard v-if="creating" :key="-1" @close="$emit('close-creation')" />
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
import routeNames from "../../../../router/route-names.js";
// Components
import AppLink from "../../app/app-link/AppLink.vue";
import SpaceCard from "../../spaces/space-card/SpaceCard.vue";
import SpaceCreationCard from "../../spaces/space-creation-card/SpaceCreationCard.vue";

export default {
  components: {
    AppLink,
    SpaceCard,
    SpaceCreationCard,
  },
  props: {
    spaces: {
      type: Array,
      required: true,
    },
    isCarousel: {
      type: Boolean,
      default: false,
    },
    creating: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close-creation"],
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
      displayedSpaces,
      routeNames,
    };
  },
};
</script>

<style scoped lang="scss" src="./DashboardSpaceList.scss"></style>
