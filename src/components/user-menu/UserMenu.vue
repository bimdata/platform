<template>
  <div class="user-menu">
    <BIMDataDropdownMenu width="0">
      <template #header>
        <div class="user-menu__btn">
          <span class="user-menu__btn__picture">
            {{ initials }}
          </span>
          <span class="user-menu__btn__fullname">
            {{ `${firstName} ${lastName}` }}
          </span>
          <span class="user-menu__btn__email">
            {{ email }}
          </span>
        </div>
      </template>
      <template #element>
        <div class="user-menu__container" @click.stop="() => {}">
          <BIMDataButton ghost squared>
            {{ $t("UserMenu.settings") }}
          </BIMDataButton>
          <BIMDataButton ghost squared @click="openBIMDataConnect">
            {{ $t("UserMenu.connect") }}
          </BIMDataButton>
          <div class="separator"></div>
          <BIMDataButton ghost squared @click="openDocumentation">
            {{ $t("UserMenu.documentation") }}
          </BIMDataButton>
          <BIMDataButton ghost squared @click="openMarketplace">
            {{ $t("UserMenu.marketplace") }}
          </BIMDataButton>
          <div class="separator"></div>
          <BIMDataButton
            class="lang-btn"
            ghost
            squared
            @click="openLanguageSelector"
          >
            <span>{{ $t("UserMenu.selectLanguage") }}</span>
            <span class="lang-badge">{{ $i18n.locale }}</span>
          </BIMDataButton>
          <BIMDataButton
            class="logout-btn"
            color="primary"
            fill
            radius
            @click="signOut"
          >
            <BIMDataIcon name="logout" size="xxs" />
            <span>{{ $t("UserMenu.logout") }}</span>
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
import LanguageSelector from "@/components/language-selector/LanguageSelector";

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

<style scoped lang="scss" src="./UserMenu.scss"></style>
