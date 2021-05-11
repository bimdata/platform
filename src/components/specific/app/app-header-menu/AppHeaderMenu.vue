<template>
  <div class="app-header-menu">
    <BIMDataDropdownMenu width="0">
      <template #header>
        <div class="app-header-menu__btn">
          <span class="app-header-menu__btn__picture">
            {{ initials }}
          </span>
          <span data-test="user-name" class="app-header-menu__btn__fullname">
            {{ `${firstName} ${lastName}` }}
          </span>
          <span class="app-header-menu__btn__email">
            {{ email }}
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
          <BIMDataButton
            class="btn-lang"
            ghost
            squared
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
import { computed, ref, watchEffect } from "vue";
import { useAuth } from "@/state/auth";
import { useUser } from "@/state/user";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataDropdownMenu from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataDropdownMenu.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import LanguageSelector from "@/components/generic/language-selector/LanguageSelector";

export default {
  components: {
    BIMDataButton,
    BIMDataDropdownMenu,
    BIMDataIcon,
    LanguageSelector
  },
  setup() {
    const { signOut } = useAuth();
    const { user } = useUser();

    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const initials = computed(() =>
      `${firstName.value[0]}${lastName.value[0]}`.toUpperCase()
    );
    watchEffect(() => {
      if (user.value) {
        firstName.value = user.value.firstname;
        lastName.value = user.value.lastname;
        email.value = user.value.email;
      }
    });

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
      email,
      firstName,
      initials,
      lastName,
      showLanguageSelector,
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
