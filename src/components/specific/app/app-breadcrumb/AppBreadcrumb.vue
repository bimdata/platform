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
// Components
import GoBackButton from "@/components/generic/go-back-button/GoBackButton";
import BreadcrumbProjectSelector from "@/components/specific/app/breadcrumb-project-selector/BreadcrumbProjectSelector";
import BreadcrumbSpaceSelector from "@/components/specific/app/breadcrumb-space-selector/BreadcrumbSpaceSelector";

export default {
  components: {
    BreadcrumbProjectSelector,
    BreadcrumbSpaceSelector,
    GoBackButton
  },
  setup() {
    const route = useRoute();

    return {
      breadcrumb: route.meta.breadcrumb
    };
  }
};
</script>

<style scoped lang="scss" src="./AppBreadcrumb.scss"></style>
