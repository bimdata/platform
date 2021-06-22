<template>
  <BreadcrumbSelector />
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
// Components
import BreadcrumbSelector from "@/components/generic/breadcrumb-selector/BreadcrumbSelector";

export default {
  components: {
    BreadcrumbSelector
  },
  setup() {
    // TODO
  }
};
</script>
