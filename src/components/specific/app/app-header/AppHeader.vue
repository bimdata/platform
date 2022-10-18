<template>
  <div class="app-header">
    <AppLink :to="{ name: routeNames.dashboard }">
      <PlatformLogo class="app-header__logo" />
    </AppLink>
    <app-slot name="app-header-action" />
    <AppLink :to="{ name: routeNames.invitation }" style="margin-left: auto">
      <BIMDataButton class="app-header__invitation" radius ghost icon>
        <template v-if="invitationListPending.length > 0">
          <div class="app-header__invitation__notif"><div></div></div>
        </template>
        <BIMDataIcon name="invitation" size="m" />
      </BIMDataButton>
    </AppLink>
    <AppHeaderMenu class="app-header__menu" />
  </div>
</template>

<script>
import routeNames from "../../../../router/route-names.js";
import { useInvitations } from "../../../../state/invitations.js";

// Components
import AppSlot from "../app-slot/AppSlot.vue";
import AppLink from "../app-link/AppLink.vue";
import AppHeaderMenu from "../app-header-menu/AppHeaderMenu.vue";

export default {
  components: {
    AppLink,
    AppSlot,
    AppHeaderMenu
  },
  setup() {
    return {
      routeNames,
      invitationListPending: useInvitations().invitationListPending
    };
  }
};
</script>

<style scoped lang="scss" src="./AppHeader.scss"></style>
