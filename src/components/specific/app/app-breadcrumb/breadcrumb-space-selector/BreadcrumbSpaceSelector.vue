<template>
  <BreadcrumbSelector
    :list="spaces"
    labelProp="name"
    :header="selectedSpace.name"
    @item-selected="goToSpace"
  />
</template>

<script>
import { useRouter } from "vue-router";
import routeNames from "../../../../../router/route-names.js";
import { useSpaces } from "../../../../../state/spaces.js";
// Components
import BreadcrumbSelector from "../breadcrumb-selector/BreadcrumbSelector.vue";

export default {
  components: {
    BreadcrumbSelector
  },
  setup() {
    const router = useRouter();
    const { userSpaces, currentSpace } = useSpaces();

    const goToSpace = space => {
      router.push({
        name: routeNames.spaceBoard,
        params: { spaceID: space.id }
      });
    };

    return {
      // References
      selectedSpace: currentSpace,
      spaces: userSpaces,
      // Methods
      goToSpace
    };
  }
};
</script>
