<template>
  <div class="app-breadcrumb">
    <GoBackButton />
    <template v-if="breadcrumb && !isSM">
      <div
        class="breadcrumb-separator"
        :style="{
          margin: `0 ${
            isMD ? 'calc(var(--spacing-unit) / 2)' : 'var(--spacing-unit)'
          }`
        }"
      ></div>
      <component :is="breadcrumb" />
    </template>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { useStandardBreakpoints } from "@/composables/responsive.js";
import routeNames from "@/router/route-names.js";
// Components
import GoBackButton from "@/components/specific/app/go-back-button/GoBackButton";
import BreadcrumbGroupSelector from "./breadcrumb-group-selector/BreadcrumbGroupSelector";
import BreadcrumbProjectSelector from "./breadcrumb-project-selector/BreadcrumbProjectSelector";
import BreadcrumbSpaceSelector from "./breadcrumb-space-selector/BreadcrumbSpaceSelector";

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
      breadcrumb: BREADCRUMB_COMPONENTS[route.name],
      ...useStandardBreakpoints()
    };
  }
};
</script>

<style scoped lang="scss" src="./AppBreadcrumb.scss"></style>
