<template>
  <div class="dashboard-space-list">
    <div class="dashboard-space-list__title">
      {{ $t("DashboardSpaceList.title") }}
    </div>
    <div class="dashboard-space-list__content">
      <SpaceCard
        v-for="space in recentSpaces"
        :key="space.id"
        :space="space"
        :actionMenu="false"
      />
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { useSpaces } from "@/state/spaces";
// Components
import SpaceCard from "@/components/specific/spaces/space-card/SpaceCard";

export default {
  components: {
    SpaceCard
  },
  setup() {
    const { userSpaces } = useSpaces();

    const recentSpaces = ref([]);

    watchEffect(() => {
      if (userSpaces.value) {
        recentSpaces.value = userSpaces.value
          .slice()
          .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
          .slice(0, 7);
      }
    });

    return {
      recentSpaces
    };
  }
};
</script>

<style scoped lang="scss" src="./DashboardSpaceList.scss"></style>
