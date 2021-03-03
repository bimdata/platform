<template>
  <div class="breadcrumb">
    <GoBackButton />
    <div class="breadcrumb-separator"></div>
    <component :is="breadcrumb" />
  </div>
</template>

<script>
import { useRoute } from "vue-router";
// Components
import BreadcrumbProjectSelector from "@/components/breadcrumb-project-selector/BreadcrumbProjectSelector";
import BreadcrumbSpaceSelector from "@/components/breadcrumb-space-selector/BreadcrumbSpaceSelector";
import GoBackButton from "@/components/go-back-button/GoBackButton";

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

<style scoped lang="scss" src="./Breadcrumb.scss"></style>
