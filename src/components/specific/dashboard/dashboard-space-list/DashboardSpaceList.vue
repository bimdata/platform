<template>
  <div class="dashboard-space-list">
    <div class="dashboard-space-list__title">
      {{ $t("DashboardSpaceList.title") }}
    </div>
    <div class="dashboard-space-list__content">
      <SpaceCard
        v-for="space in displayedSpaces"
        :key="space.id"
        :space="space"
        :actionMenu="false"
      />
    </div>
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
// Components
import SpaceCard from "@/components/specific/spaces/space-card/SpaceCard";

export default {
  components: {
    SpaceCard
  },
  props: {
    spaces: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const displayedSpaces = ref([]);

    watchEffect(() => {
      if (props.spaces) {
        displayedSpaces.value = props.spaces
          .slice()
          .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
          .slice(0, 7);
      }
    });

    return {
      displayedSpaces
    };
  }
};
</script>

<style scoped lang="scss" src="./DashboardSpaceList.scss"></style>
