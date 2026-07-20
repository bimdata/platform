<template>
  <div class="dashboard-space-list">
    <AppLink
      class="dashboard-space-list__title"
      :to="{ name: routeNames.userSpaces }"
    >
      <span>{{ $t("DashboardSpaceList.title") }}</span>
      <BIMDataIconChevron size="xxs" />
    </AppLink>
    <div ref="contentEl" class="dashboard-space-list__content">
      <SpaceCreationCard v-if="creating" :key="-1" @close="$emit('close-creation')" />
      <SpaceCard
        v-for="space in displayedSpaces"
        data-guide="dashboard-space"
        :key="space.id"
        :space="space"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, watchEffect } from "vue";
import routeNames from "../../../../router/route-names.js";
// Components
import AppLink from "../../app/app-link/AppLink.vue";
import SpaceCard from "../../spaces/space-card/SpaceCard.vue";
import SpaceCreationCard from "../../spaces/space-creation-card/SpaceCreationCard.vue";

// Keep in sync with SpaceCard --card-width and DashboardSpaceList.scss content gap.
const CARD_WIDTH = 215;
const CARD_GAP = 8;
const MIN_CARDS = 1;

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
    creating: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close-creation"],
  setup(props) {
    const contentEl = ref(null);
    const maxCards = ref(MIN_CARDS);
    const displayedSpaces = ref([]);

    const computeMaxCards = width => {
      if (!width) return;
      const fit = Math.floor((width + CARD_GAP) / (CARD_WIDTH + CARD_GAP));
      maxCards.value = Math.max(MIN_CARDS, fit);
    };

    let observer;
    onMounted(() => {
      observer = new ResizeObserver(entries => {
        computeMaxCards(entries[0].contentRect.width);
      });
      if (contentEl.value) {
        observer.observe(contentEl.value);
        computeMaxCards(contentEl.value.clientWidth);
      }
    });
    onUnmounted(() => observer && observer.disconnect());

    watchEffect(() => {
      if (props.spaces) {
        // If the creation form is open, it takes one card slot.
        const slots = Math.max(0, maxCards.value - (props.creating ? 1 : 0));
        displayedSpaces.value = props.spaces
          .slice()
          .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1))
          .slice(0, slots);
      }
    });

    return {
      contentEl,
      displayedSpaces,
      routeNames,
    };
  },
};
</script>

<style scoped lang="scss" src="./DashboardSpaceList.scss"></style>

