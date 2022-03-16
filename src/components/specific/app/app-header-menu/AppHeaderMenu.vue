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
          <BIMDataTextbox
            data-test="user-name"
            class="app-header-menu__btn__fullname"
            maxWidth="130px"
            :tooltip="false"
            :text="fullName(user)"
          />
          <BIMDataTextbox
            class="app-header-menu__btn__email"
            maxWidth="130px"
            :tooltip="false"
            :text="user.email"
          />
        </div>
      </template>
      <template #element>
        <div class="app-header-menu__container" @click.stop="() => {}">
          <div class="user-info">
            <UserAvatar class="user-avatar" :user="user" size="50" />
            <div class="user-content">
              <BIMDataTextbox
                class="user-name"
                maxWidth="200px"
                :tooltip="false"
                :text="fullName(user)"
              />
              <BIMDataTextbox
                class="user-email"
                maxWidth="200px"
                :tooltip="false"
                :text="user.email"
              />
            </div>
          </div>
          <div class="separator"></div>
          <a
            class="external-link"
            :href="bimdataConnectProfileUrl"
            target="blank"
          >
            <BIMDataButton width="100%" height="40px" ghost squared>
              {{ $t("AppHeaderMenu.entrySettings") }}
            </BIMDataButton>
          </a>
          <a class="external-link" :href="documentationUrl" target="blank">
            <BIMDataButton width="100%" height="40px" ghost squared>
              {{ $t("AppHeaderMenu.entryDocumentation") }}
            </BIMDataButton>
          </a>
          <a class="external-link" :href="marketPlaceUrl" target="blank">
            <BIMDataButton width="100%" height="40px" ghost squared>
              {{ $t("AppHeaderMenu.entryMarketplace") }}
            </BIMDataButton>
          </a>
          <div class="separator"></div>
          <BIMDataButton
            class="btn-language"
            ghost
            squared
            height="40px"
            @click="openLanguageSelector"
          >
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
import { fullName } from "@/utils/users";

// Components
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar.vue";
import LanguageSelector from "./language-selector/LanguageSelector.vue";

export default {
  components: {
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

    const bimdataConnectProfileUrl =
      process.env.VUE_APP_URL_BIMDATACONNECT + "/profile/";
    const documentationUrl = process.env.VUE_APP_URL_DOCUMENTATION;
    const marketPlaceUrl = process.env.VUE_APP_URL_MARKETPLACE;

    return {
      // References
      bimdataConnectProfileUrl,
      documentationUrl,
      marketPlaceUrl,
      isSubscriptionEnabled: IS_SUBSCRIPTION_ENABLED,
      routeNames,
      showLanguageSelector,
      space: currentSpace,
      user,
      // Methods
      closeLanguageSelector,
      openLanguageSelector,
      fullName,
      signOut
    };
  }
};
</script>

<style scoped lang="scss" src="./AppHeaderMenu.scss"></style>
