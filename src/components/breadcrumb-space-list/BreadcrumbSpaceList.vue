<template>
  <BIMDataDropdownList
    class="breadcrumb-space-list"
    :list="spaceNames"
    :closeOnElementClick="true"
    @element-click="changeSpace"
  >
    <template #header>{{ currentSpace.name }}</template>
  </BIMDataDropdownList>
</template>

<script>
import { useRouter } from "vue-router";
import { useSpaces } from "@/state/spaces";
// Components
import BIMDataDropdownList from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataDropdownList.js";

export default {
  components: {
    BIMDataDropdownList
  },
  setup() {
    const router = useRouter();
    const { spaces, currentSpace } = useSpaces();

    const spaceNames = spaces.value.map(s => s.name);
    const spacesMap = spaces.value.reduce(
      (map, s) => ({ ...map, [s.name]: s }),
      {}
    );

    const changeSpace = spaceName => {
      const space = spacesMap[spaceName];
      router.push({ name: "projects", params: { spaceID: space.id } });
    };

    return {
      // References
      currentSpace,
      spaceNames,
      // Methods
      changeSpace
    };
  }
};
</script>
