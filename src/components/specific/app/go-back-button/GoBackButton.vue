<template>
  <BIMDataButton
    data-test="btn-back"
    class="go-back-button"
    ghost
    radius
    @click="goBack"
  >
    <BIMDataIcon
      class="go-back-button__icon"
      name="arrow"
      size="xxs"
      margin="0 6px 0 0"
    />
    <span>{{ $t("GoBackButton.text") }}</span>
  </BIMDataButton>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import routeNames from "@/router/route-names.js";
import { useSession } from "@/state/session";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

const DEFAULT_PREVIOUS_ROUTE = {
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
    const { defaultRoutingMode } = useSession();

    const goBack = () => {
      if (defaultRoutingMode.get()) {
        router.back();
      } else {
        defaultRoutingMode.set(true);
        router.push({
          name: DEFAULT_PREVIOUS_ROUTE[route.name],
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
