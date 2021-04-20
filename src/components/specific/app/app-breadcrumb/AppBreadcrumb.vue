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
import { routeNames } from "@/router";
// Components
import GoBackButton from "@/components/generic/go-back-button/GoBackButton";
import BreadcrumbProjectSelector from "./breadcrumb-project-selector/BreadcrumbProjectSelector";
import BreadcrumbSpaceSelector from "./breadcrumb-space-selector/BreadcrumbSpaceSelector";

export default {
  components: {
    GoBackButton,
    BreadcrumbProjectSelector,
    BreadcrumbSpaceSelector
  },
  setup() {
    const route = useRoute();

    let breadcrumb;
    switch (route.name) {
      case routeNames.spaceBoard:
        breadcrumb = "BreadcrumbSpaceSelector";
        break;
      case routeNames.projectBoard:
        breadcrumb = "BreadcrumbProjectSelector";
        break;
    }

    return {
      breadcrumb
    };
  }
};
</script>

<style scoped lang="scss" src="./AppBreadcrumb.scss"></style>
