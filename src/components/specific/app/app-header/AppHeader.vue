<template>
  <div class="app-header">
    <AppLink :to="{ name: routeNames.dashboard }">
      <PlatformLogo class="app-header__logo" />
    </AppLink>
    <AppSlot name="app-header-action" />
    <BIMDataButton
      class="app-header__fav-btn"
      width="38px"
      height="38px"
      fill
      square
      icon
      @click="openFavoritesManager"
    >
      <span class="icon">&starf;</span>
    </BIMDataButton>
    <AppLink
      class="app-header__invit-btn"
      :to="{ name: routeNames.invitations }"
    >
      <BIMDataButton width="38px" height="38px" fill square icon>
        <BIMDataIconInvitation size="m" />
        <div
          v-if="pendingInvitations.length > 0"
          class="app-header__invit-btn__notif"
        ></div>
      </BIMDataButton>
    </AppLink>
    <AppHeaderMenu class="app-header__menu" />
  </div>
</template>

<script>
import { useAppSidePanel } from "../app-side-panel/app-side-panel.js";
import routeNames from "../../../../router/route-names.js";
import { useInvitations } from "../../../../state/invitations.js";

// Components
import AppSlot from "../app-slot/AppSlot.js";
import AppLink from "../app-link/AppLink.vue";
import AppHeaderMenu from "../app-header-menu/AppHeaderMenu.vue";
import UserFavoritesManager from "../../users/user-favorites-manager/UserFavoritesManager.vue";

export default {
  components: {
    AppLink,
    AppSlot,
    AppHeaderMenu
  },
  setup() {
    const { pendingInvitations } = useInvitations();
    const { openSidePanel } = useAppSidePanel();

    const openFavoritesManager = () => {
      openSidePanel("right", {
        component: UserFavoritesManager
      });
    };

    return {
      pendingInvitations,
      routeNames,
      openFavoritesManager
    };
  }
};
</script>

<style scoped lang="scss" src="./AppHeader.scss"></style>
