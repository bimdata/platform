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
          <BIMDataButton ghost squared>
            {{ $t("AppHeaderMenu.entrySettings") }}
          </BIMDataButton>
          <BIMDataButton ghost squared @click="openBIMDataConnect">
            {{ $t("AppHeaderMenu.entryConnect") }}
          </BIMDataButton>
          <div class="separator"></div>
          <BIMDataButton ghost squared @click="openDocumentation">
            {{ $t("AppHeaderMenu.entryDocumentation") }}
          </BIMDataButton>
          <BIMDataButton ghost squared @click="openMarketplace">
            {{ $t("AppHeaderMenu.entryMarketplace") }}
          </BIMDataButton>
          <div class="separator"></div>
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
            <BIMDataIcon name="logout" size="xxs" />
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
import { ref } from "vue";
import { useAuth } from "@/state/auth";
import { useUser } from "@/state/user";
// Components
import UserAvatar from "@/components/specific/users/user-avatar/UserAvatar";
import LanguageSelector from "./language-selector/LanguageSelector";

export default {
  components: {
    UserAvatar,
    LanguageSelector
  },
  setup() {
    const { signOut } = useAuth();
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

    const showLanguageSelector = ref(false);
    const openLanguageSelector = () => {
      showLanguageSelector.value = true;
    };
    const closeLanguageSelector = () => {
      showLanguageSelector.value = false;
    };

    return {
      // References
      showLanguageSelector,
      user,
      // Methods
      closeLanguageSelector,
      openBIMDataConnect,
      openDocumentation,
      openLanguageSelector,
      openMarketplace,
      signOut
    };
  }
};
</script>

<style scoped lang="scss" src="./AppHeaderMenu.scss"></style>
