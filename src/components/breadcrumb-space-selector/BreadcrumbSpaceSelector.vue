<template>
  <BreadcrumbSelector
    :header="currentSpace.name"
    :list="spaces"
    labelProp="name"
    @item-click="changeSpace"
  />
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
import { useSpaces } from "@/state/spaces";
// Components
import BreadcrumbSelector from "@/components/breadcrumb-selector/BreadcrumbSelector";

export default {
  components: {
    BreadcrumbSelector
  },
  setup() {
    const router = useRouter();
    const { spaces, currentSpace } = useSpaces();

    const changeSpace = space => {
      router.push({
        name: routeNames.spaceBoard,
        params: { spaceID: space.id }
      });
    };

    return {
      // References
      currentSpace,
      spaces,
      // Methods
      changeSpace
    };
  }
};
</script>
