<template>
  <div class="app-header">
    <img
      class="app-header__logo"
      alt="BIMData Platform logo"
      src="/static/header-logo.svg"
      @click="goToDashboard"
    />
    <app-slot name="app-header-action" />
    <AppHeaderMenu class="app-header__menu" />
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import routeNames from "@/router/route-names.js";
// Components
import AppSlot from "@/components/generic/app-slot/AppSlot";
import AppHeaderMenu from "@/components/specific/app/app-header-menu/AppHeaderMenu";

export default {
  components: {
    AppSlot,
    AppHeaderMenu
  },
  setup() {
    const router = useRouter();

    const goToDashboard = () => {
      router.push({ name: routeNames.dashboard });
    };

    return {
      goToDashboard
    };
  }
};
</script>

<style scoped lang="scss" src="./AppHeader.scss"></style>
