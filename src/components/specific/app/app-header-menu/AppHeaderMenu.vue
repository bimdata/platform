<template>
  <div class="app-header-menu" v-click-away="close">
    <button
      type="button"
      data-test-id="btn-toggle-app-menu"
      class="app-header-menu__trigger"
      :class="{ active: isOpen }"
      @click="toggle"
    >
      <UserAvatar :user="user" size="38" />
    </button>

    <transition name="fade">
      <div v-show="isOpen" class="app-header-menu__popover">
        <div class="app-header-menu__user">
          <UserAvatar
            class="app-header-menu__user__avatar"
            :user="user"
            size="44"
          />
          <div class="app-header-menu__user__content">
            <BIMDataTextbox
              data-test-id="user-name"
              class="app-header-menu__user__name"
              :tooltip="false"
              :text="fullName(user)"
            />
            <BIMDataTextbox
              class="app-header-menu__user__email"
              :tooltip="false"
              :text="user.email"
            />
          </div>
        </div>

        <div class="app-header-menu__divider"></div>

        <button
          v-if="userIframeProfile"
          type="button"
          class="app-header-menu__item"
          @click="goToProfile"
        >
          <BIMDataIconAccountSettings size="s" />
          <span>{{ $t("AppHeaderMenu.entrySettings") }}</span>
        </button>
        <a
          v-else
          class="app-header-menu__item"
          :href="bimdataConnectProfileUrl"
          target="blank"
        >
          <BIMDataIconAccountSettings size="s" />
          <span>{{ $t("AppHeaderMenu.entrySettings") }}</span>
        </a>

        <a class="app-header-menu__item" :href="documentationUrl" target="blank">
          <BIMDataIconLinkedDocument size="s" />
          <span>{{ $t("AppHeaderMenu.entryDocumentation") }}</span>
        </a>

        <a
          v-if="marketPlaceUrl"
          class="app-header-menu__item"
          :href="marketPlaceUrl"
          target="blank"
        >
          <BIMDataIconMarketplace size="s" />
          <span>{{ $t("AppHeaderMenu.entryMarketplace") }}</span>
        </a>

        <div class="app-header-menu__divider"></div>

        <button
          type="button"
          class="app-header-menu__item app-header-menu__item--language"
          @click.stop="openLanguageSelector"
        >
          <span>{{ $t("AppHeaderMenu.entryLanguage") }}</span>
          <span class="app-header-menu__lang-badge">{{ $i18n.locale }}</span>
        </button>

        <BIMDataButton
          data-test-id="btn-logout"
          class="app-header-menu__logout"
          color="primary"
          fill
          radius
          @click="signOut"
        >
          {{ $t("AppHeaderMenu.logoutButtonText") }}
        </BIMDataButton>

        <transition name="fade">
          <LanguageSelector
            v-show="showLanguageSelector"
            v-click-away="closeLanguageSelector"
            @close="closeLanguageSelector"
          />
        </transition>
      </div>
    </transition>
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
    const router = useRouter();
    const { signOut } = useAuth();
    const { currentSpace } = useSpaces();
    const { user } = useUser();

    const { isOpen, close, toggle } = useToggle();

    const {
      isOpen: showLanguageSelector,
      open: openLanguageSelector,
      close: closeLanguageSelector
    } = useToggle();

    const goToProfile = () => {
      close();
      router.push({ name: routeNames.userProfile });
    };

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
      isOpen,
      routeNames,
      showLanguageSelector,
      space: currentSpace,
      user,
      userIframeProfile,
      // Methods
      close,
      toggle,
      goToProfile,
      closeLanguageSelector,
      openLanguageSelector,
      router,
      fullName,
      signOut
    };
  }
};
</script>

<style scoped lang="scss" src="./AppHeaderMenu.scss"></style>
