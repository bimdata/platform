<template>
  <div class="app-header">
    <img
      class="app-header__logo"
      alt="BIMData Platform logo"
      src="/static/header-logo.svg"
      @click="goToDashboard"
    />
    <AppHeaderMenu class="app-header__menu" />
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { routeNames } from "@/router";
// Components
import AppHeaderMenu from "@/components/specific/app/app-header-menu/AppHeaderMenu";

export default {
  components: {
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
