<template>
  <div class="breadcrumb">
    <GoBackButton />
    <template v-for="component in breadcrumb" :key="component">
      <div class="separator"></div>
      <component :is="component" />
    </template>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
// Components
import BreadcrumbSpaceSelector from "@/components/breadcrumb-space-selector/BreadcrumbSpaceSelector";
import GoBackButton from "@/components/go-back-button/GoBackButton";

export default {
  components: {
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
