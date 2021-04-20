<template>
  <BreadcrumbSelector
    :header="selectedSpace.name"
    :list="spaces"
    labelProp="name"
    @item-selected="changeSpace"
  />
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
import { useSpaces } from "@/state/spaces";
// Components
import BreadcrumbSelector from "@/components/generic/breadcrumb-selector/BreadcrumbSelector";

export default {
  components: {
    BreadcrumbSelector
  },
  setup() {
    const router = useRouter();
    const { userSpaces, currentSpace } = useSpaces();

    const changeSpace = space => {
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
      changeSpace
    };
  }
};
</script>
