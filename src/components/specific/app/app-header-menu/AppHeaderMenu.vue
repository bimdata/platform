<template>
  <div class="app-header-menu">
    <BIMDataDropdownMenu width="0">
      <template #header>
        <div data-test-id="btn-toggle-app-menu" class="app-header-menu__btn">
          <UserAvatar
            class="app-header-menu__btn__avatar"
            :user="user"
            size="34"
          />
          <BIMDataTextbox
            data-test-id="user-name"
            class="app-header-menu__btn__fullname"
            :tooltip="false"
            :text="fullName(user)"
          />
          <BIMDataTextbox
            class="app-header-menu__btn__email"
            :tooltip="false"
            :text="user.email"
          />
        </div>
      </template>
      <template #element>
        <div class="app-header-menu__container">
          <div class="user-info">
            <UserAvatar class="user-avatar" :user="user" size="50" />
            <div class="user-content">
              <BIMDataTextbox
                class="user-name"
                width="calc(100% - var(--spacing-unit) * 2)"
                :tooltip="false"
                :text="fullName(user)"
              />
              <BIMDataTextbox
                class="user-email"
                width="calc(100% - var(--spacing-unit) * 2)"
                :tooltip="false"
                :text="user.email"
              />
            </div>
          </div>
          <div class="separator"></div>
          <template v-if="userIframeProfile">
            <BIMDataButton
              width="100%"
              height="40px"
              ghost
              squared
              @click="router.push({ name: routeNames.userProfile })"
            >
              {{ $t("AppHeaderMenu.entrySettings") }}
            </BIMDataButton>
          </template>
          <template v-else>
            <a
              class="external-link"
              :href="bimdataConnectProfileUrl"
              target="blank"
            >
              <BIMDataButton width="100%" height="40px" ghost squared>
                {{ $t("AppHeaderMenu.entrySettings") }}
              </BIMDataButton>
            </a>
          </template>
          <a class="external-link" :href="documentationUrl" target="blank">
            <BIMDataButton width="100%" height="40px" ghost squared>
              {{ $t("AppHeaderMenu.entryDocumentation") }}
            </BIMDataButton>
          </a>
          <a
            v-if="marketPlaceUrl"
            class="external-link"
            :href="marketPlaceUrl"
            target="blank"
          >
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
            @click.stop="openLanguageSelector"
          >
            <span>{{ $t("AppHeaderMenu.entryLanguage") }}</span>
            <span class="lang-badge">{{ $i18n.locale }}</span>
          </BIMDataButton>
          <BIMDataButton
            data-test-id="btn-logout"
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
import { useRouter } from "vue-router";
import { useToggle } from "../../../../composables/toggle.js";
import { IS_SUBSCRIPTION_ENABLED } from "../../../../config/subscription.js";
import routeNames from "../../../../router/route-names.js";
import { useAuth } from "../../../../state/auth.js";
import { useSpaces } from "../../../../state/spaces.js";
import { useUser } from "../../../../state/user.js";
import { fullName } from "../../../../utils/users";

// Components
import UserAvatar from "../../users/user-avatar/UserAvatar.vue";
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
      ENV.VUE_APP_URL_BIMDATACONNECT + "/profile/";
    const documentationUrl = ENV.VUE_APP_URL_DOCUMENTATION;
    const marketPlaceUrl = ENV.VUE_APP_URL_MARKETPLACE;
    const userIframeProfile = ENV.VUE_APP_USER_IFRAME_PROFILE;

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
      userIframeProfile,
      // Methods
      closeLanguageSelector,
      openLanguageSelector,
      router: useRouter(),
      fullName,
      signOut
    };
  }
};
</script>

<style scoped lang="scss" src="./AppHeaderMenu.scss"></style>
