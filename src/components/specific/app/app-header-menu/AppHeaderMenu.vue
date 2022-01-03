<template>
  <div class="app-header-menu">
    <BIMDataDropdownMenu width="0">
      <template #header>
        <div class="app-header-menu__btn">
          <UserAvatar
            class="app-header-menu__btn__avatar"
            :user="user"
            size="34"
          />
          <span data-test="user-name" class="app-header-menu__btn__fullname">
            {{ `${user.firstname} ${user.lastname}` }}
          </span>
          <span class="app-header-menu__btn__email">
            {{ user.email }}
          </span>
        </div>
      </template>
      <template #element>
        <div class="app-header-menu__container" @click.stop="() => {}">
          <BIMDataButton ghost squared @click="openBIMDataConnect">
            {{ $t("AppHeaderMenu.entryConnect") }}
          </BIMDataButton>
          <div class="separator"></div>
          <BIMDataButton ghost squared @click="openDocumentation">
            {{ $t("AppHeaderMenu.entryDocumentation") }}
          </BIMDataButton>
          <!-- <BIMDataButton ghost squared @click="openMarketplace">
            {{ $t("AppHeaderMenu.entryMarketplace") }}
          </BIMDataButton> -->
          <BIMDataButton ghost squared @click="openOldPlatform">
            {{ $t("AppHeaderMenu.entryOldPlatform") }}
          </BIMDataButton>
          <div class="separator"></div>
          <BIMDataButton
            v-if="isSubscriptionEnabled"
            ghost
            squared
            @click="goToUserSubscriptions"
          >
            <span>{{ $t("AppHeaderMenu.subscriptionPlatform") }}</span>
          </BIMDataButton>
          <BIMDataButton ghost squared @click="openLanguageSelector">
            <span>{{ $t("AppHeaderMenu.entryLanguage") }}</span>
            <span class="lang-badge">{{ $i18n.locale }}</span>
          </BIMDataButton>
          <BIMDataButton
            data-test="btn-logout"
            class="btn-logout"
            color="primary"
            fill
            radius
            @click="signOut"
          >
            <BIMDataIcon name="logout" size="xxs" margin="0 6px 0 0" />
            <span>{{ $t("AppHeaderMenu.logoutButtonText") }}</span>
          </BIMDataButton>

          <transition name="fade">
            <LanguageSelector
              v-show="showLanguageSelector"
              v-click-away="closeLanguageSelector"
              @close="closeLanguageSelector"
            />
          </transition>
        </div>
      </template>
    </BIMDataDropdownMenu>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { IS_SUBSCRIPTION_ENABLED } from "@/config/subscription.js";
import routeNames from "@/router/route-names.js";
import { useToggle } from "@/composables/toggle.js";
import { useAuth } from "@/state/auth.js";
import { useSpaces } from "@/state/spaces.js";
import { useUser } from "@/state/user.js";
// Components
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar.vue";
import LanguageSelector from "./language-selector/LanguageSelector.vue";

export default {
  components: {
    UserAvatar,
    LanguageSelector
  },
  setup() {
    const router = useRouter();
    const { signOut } = useAuth();
    const { currentSpace } = useSpaces();
    const { user } = useUser();

    const openBIMDataConnect = () => {
      window.open(`${process.env.VUE_APP_URL_BIMDATACONNECT}`);
    };

    const openDocumentation = () => {
      window.open(`${process.env.VUE_APP_URL_DOCUMENTATION}`);
    };

    const openMarketplace = () => {
      window.open(`${process.env.VUE_APP_URL_MARKETPLACE}`);
    };

    const openOldPlatform = () => {
      window.open(`${process.env.VUE_APP_URL_OLD_PLATFORM}`);
    };

    const goToUserSubscriptions = () => {
      router.push({
        name: routeNames.userSubscriptions,
        query: {
          organization: currentSpace.value?.organization.id
        }
      });
    };

    const {
      isOpen: showLanguageSelector,
      open: openLanguageSelector,
      close: closeLanguageSelector
    } = useToggle();

    return {
      // References
      isSubscriptionEnabled: IS_SUBSCRIPTION_ENABLED,
      showLanguageSelector,
      user,
      // Methods
      closeLanguageSelector,
      goToUserSubscriptions,
      openBIMDataConnect,
      openDocumentation,
      openLanguageSelector,
      openMarketplace,
      openOldPlatform,
      signOut
    };
  }
};
</script>

<style scoped lang="scss" src="./AppHeaderMenu.scss"></style>
