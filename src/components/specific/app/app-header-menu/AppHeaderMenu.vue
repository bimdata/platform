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
          <a class="external-link" :href="bimdataConnectUrl" target="blank">
            <BIMDataButton width="100%" ghost squared>
              {{ $t("AppHeaderMenu.entryConnect") }}
            </BIMDataButton>
          </a>
          <div class="separator"></div>
          <a class="external-link" :href="documentationUrl" target="blank">
            <BIMDataButton width="100%" ghost squared>
              {{ $t("AppHeaderMenu.entryDocumentation") }}
            </BIMDataButton>
          </a>
          <div class="separator"></div>
          <AppLink
            v-if="isSubscriptionEnabled"
            :to="{
              name: routeNames.userSubscriptions,
              query: {
                organization: space?.organization.id
              }
            }"
          >
            <BIMDataButton width="100%" ghost squared>
              <span>{{ $t("AppHeaderMenu.subscriptionPlatform") }}</span>
            </BIMDataButton>
          </AppLink>
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
import { IS_SUBSCRIPTION_ENABLED } from "@/config/subscription.js";
import routeNames from "@/router/route-names.js";
import { useToggle } from "@/composables/toggle.js";
import { useAuth } from "@/state/auth.js";
import { useSpaces } from "@/state/spaces.js";
import { useUser } from "@/state/user.js";
// Components
import AppLink from "@/components/specific/app/app-link/AppLink.vue";
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar.vue";
import LanguageSelector from "./language-selector/LanguageSelector.vue";

export default {
  components: {
    AppLink,
    LanguageSelector,
    UserAvatar
  },
  setup() {
    const { signOut } = useAuth();
    const { currentSpace } = useSpaces();
    const { user } = useUser();

    const {
      isOpen: showLanguageSelector,
      open: openLanguageSelector,
      close: closeLanguageSelector
    } = useToggle();

    const bimdataConnectUrl = process.env.VUE_APP_URL_BIMDATACONNECT;
    const documentationUrl = process.env.VUE_APP_URL_DOCUMENTATION;

    return {
      // References
      bimdataConnectUrl,
      documentationUrl,
      isSubscriptionEnabled: IS_SUBSCRIPTION_ENABLED,
      routeNames,
      showLanguageSelector,
      space: currentSpace,
      user,
      // Methods
      closeLanguageSelector,
      openLanguageSelector,
      signOut
    };
  }
};
</script>

<style scoped lang="scss" src="./AppHeaderMenu.scss"></style>
