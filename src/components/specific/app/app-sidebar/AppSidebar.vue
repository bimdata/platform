<template>
  <nav class="app-sidebar" data-test-id="app-sidebar">
    <div class="app-sidebar__rail">
      <AppLink
        class="app-sidebar__logo"
        data-test-id="sidebar-logo"
        :to="{ name: routeNames.dashboard }"
      >
        <svg
          class="app-sidebar__logo-mark"
          viewBox="0 0 20 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 6.10898L7.60781 3.12695V32.6052L0 29.5897V6.10898Z"
            class="fill-primary"
          />
          <path
            d="M19.0654 16.4789L11.4576 19.4609V0.00178969L19.0654 3.01732V16.4789Z"
            class="fill-secondary"
          />
        </svg>
      </AppLink>

      <div class="app-sidebar__nav">
        <AppSidebarItem
          :to="{ name: routeNames.dashboard }"
          :label="$t('AppSidebar.home')"
          data-test-id="sidebar-home"
        >
          <BIMDataIconHome size="s" />
        </AppSidebarItem>
        <AppSidebarItem
          :to="{ name: routeNames.userSpaces }"
          :label="$t('AppSidebar.spaces')"
          data-test-id="sidebar-spaces"
        >
          <BIMDataIconSpace size="s" />
        </AppSidebarItem>
        <AppSidebarItem
          :to="{ name: routeNames.userProjects }"
          :label="$t('AppSidebar.projects')"
          data-test-id="sidebar-projects"
        >
          <BIMDataIconProject size="s" />
        </AppSidebarItem>
        <AppSidebarItem
          :to="{ name: routeNames.invitations }"
          :label="$t('AppSidebar.invitations')"
          :notif="pendingInvitations.length > 0"
          data-test-id="sidebar-invitations"
        >
          <BIMDataIconInvitation size="s" />
        </AppSidebarItem>
        <AppSidebarItem
          :label="$t('AppSidebar.favorites')"
          data-test-id="sidebar-favorites"
          @click="openFavoritesManager"
        >
          <BIMDataIconFavoriteStroke size="s" />
        </AppSidebarItem>
        <AppSidebarItem
          v-if="isSubscriptionEnabled"
          :to="{ name: routeNames.userSubscriptions }"
          :label="$t('AppSidebar.subscription')"
          data-test-id="sidebar-subscriptions"
        >
          <BIMDataIconPlan size="s" />
        </AppSidebarItem>
      </div>

      <div class="app-sidebar__bottom">
        <AppHeaderMenu />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAppSidePanel } from "../app-side-panel/app-side-panel.js";
import routeNames from "../../../../router/route-names.js";
import { IS_SUBSCRIPTION_ENABLED } from "../../../../config/subscription.js";
import { useInvitations } from "../../../../state/invitations.js";

// Components
import AppLink from "../app-link/AppLink.vue";
import AppHeaderMenu from "../app-header-menu/AppHeaderMenu.vue";
import AppSidebarItem from "./app-sidebar-item/AppSidebarItem.vue";
import UserFavoritesManager from "../../users/user-favorites-manager/UserFavoritesManager.vue";

const { pendingInvitations } = useInvitations();
const { openSidePanel } = useAppSidePanel();

const openFavoritesManager = () => {
  openSidePanel("right", {
    component: UserFavoritesManager
  });
};

const isSubscriptionEnabled = IS_SUBSCRIPTION_ENABLED;
</script>

<style scoped lang="scss" src="./AppSidebar.scss"></style>
