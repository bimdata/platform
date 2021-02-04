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
import BreadcrumbSpaceList from "@/components/breadcrumb-space-list/BreadcrumbSpaceList";
import GoBackButton from "@/components/go-back-button/GoBackButton";

export default {
  components: {
    BreadcrumbSpaceList,
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
