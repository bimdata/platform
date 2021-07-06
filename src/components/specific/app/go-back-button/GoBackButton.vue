<template>
  <BIMDataButton
    data-test="btn-back"
    class="go-back-button"
    ghost
    radius
    @click="goBack"
  >
    <BIMDataIcon class="go-back-button__icon" name="arrow" size="xxs" />
    <span>{{ $t("GoBackButton.text") }}</span>
  </BIMDataButton>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { routeNames } from "@/router";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

const HAS_PREVIOUS_STORAGE_KEY = "has-previous";

const DEFAULT_PREVIOUS_VIEWS = {
  [routeNames.userSpaces]: routeNames.dashboard,
  [routeNames.userProjects]: routeNames.dashboard,
  [routeNames.spaceBoard]: routeNames.dashboard,
  [routeNames.projectBoard]: routeNames.spaceBoard,
  [routeNames.modelViewer]: routeNames.projectBoard,
  [routeNames.projectGroups]: routeNames.projectBoard,
  [routeNames.groupBoard]: routeNames.projectGroups
};

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const goBack = () => {
      const hasPrevious = sessionStorage.getItem(HAS_PREVIOUS_STORAGE_KEY);
      if (hasPrevious) {
        router.back();
      } else {
        sessionStorage.setItem(HAS_PREVIOUS_STORAGE_KEY, "yes");
        router.push({
          name: DEFAULT_PREVIOUS_VIEWS[route.name],
          params: route.params
        });
      }
    };

    return {
      goBack
    };
  }
};
</script>

<style scoped lang="scss" src="./GoBackButton.scss"></style>
