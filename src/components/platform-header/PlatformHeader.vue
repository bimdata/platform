<template>
  <div class="platform-header">
    <img
      class="platform-header__logo"
      alt="BIMData Platform logo"
      src="/static/header-logo.svg"
      @click="goToDashboard"
    />
    <UserMenu class="platform-header__user-menu" />
  </div>
</template>

<script>
import { useRouter } from "vue-router";
// Components
import UserMenu from "@/components/user-menu/UserMenu";

export default {
  components: {
    UserMenu
  },
  setup() {
    const router = useRouter();

    const goToDashboard = () => {
      router.push({ name: "dashboard" });
    };

    return {
      goToDashboard
    };
  }
};
</script>

<style scoped lang="scss" src="./PlatformHeader.scss"></style>
