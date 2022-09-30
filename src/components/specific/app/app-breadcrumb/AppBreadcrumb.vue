<template>
  <div class="app-breadcrumb">
    <GoBackButton />
    <template v-if="breadcrumb">
      <div class="breadcrumb-separator"></div>
      <component :is="breadcrumb" />
    </template>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import routeNames from "../../../../router/route-names.js";
// Components
import GoBackButton from "../go-back-button/GoBackButton.vue";
import BreadcrumbGroupSelector from "./breadcrumb-group-selector/BreadcrumbGroupSelector.vue";
import BreadcrumbProjectSelector from "./breadcrumb-project-selector/BreadcrumbProjectSelector.vue";
import BreadcrumbSpaceSelector from "./breadcrumb-space-selector/BreadcrumbSpaceSelector.vue";

const BREADCRUMB_COMPONENTS = {
  [routeNames.spaceBoard]: "BreadcrumbSpaceSelector",
  [routeNames.projectBoard]: "BreadcrumbProjectSelector",
  [routeNames.groupBoard]: "BreadcrumbGroupSelector"
};

export default {
  components: {
    GoBackButton,
    BreadcrumbGroupSelector,
    BreadcrumbProjectSelector,
    BreadcrumbSpaceSelector
  },
  setup() {
    const route = useRoute();

    return {
      breadcrumb: BREADCRUMB_COMPONENTS[route.name]
    };
  }
};
</script>

<style scoped lang="scss" src="./AppBreadcrumb.scss"></style>
