<template>
  <div class="user-menu" v-click-away="closeMenu">
    <BIMDataButton
      color="default"
      outline
      radius
      class="user-menu__btn"
      @click="toggleMenu"
    >
      <span class="user-menu__btn__picture">
        {{ initials }}
      </span>
      <span class="user-menu__btn__fullname">
        {{ `${firstName} ${lastName}` }}
      </span>
      <span class="user-menu__btn__email">
        {{ email }}
      </span>
    </BIMDataButton>
    <transition name="fade">
      <div class="user-menu__container" v-show="showMenu">
        <BIMDataSelect
          :label="$t('Header.selectLanguage')"
          :options="$i18n.availableLocales"
          v-model="$i18n.locale"
        />
        <BIMDataButton color="primary" fill radius @click="signOut">
          <BIMDataIcon name="logout" size="xxs" />
          <span>{{ $t("Header.logout") }}</span>
        </BIMDataButton>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, ref, watchEffect } from "vue";
import { useUser } from "@/state/user";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSelect from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSelect.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSelect
  },
  setup() {
    const { user, signOut } = useUser();

    const showMenu = ref(false);
    const closeMenu = () => (showMenu.value = false);
    const toggleMenu = () => (showMenu.value = !showMenu.value);

    const firstName = ref("");
    const lastName = ref("");
    const email = ref("");
    const initials = computed(() =>
      `${firstName.value[0]}${lastName.value[0]}`.toUpperCase()
    );
    watchEffect(() => {
      if (user.value) {
        firstName.value = user.value.firstName;
        lastName.value = user.value.lastName;
        email.value = user.value.email;
      }
    });

    return {
      // References
      email,
      firstName,
      initials,
      lastName,
      showMenu,
      // Methods
      closeMenu,
      toggleMenu,
      signOut
    };
  }
};
</script>

<style scoped lang="scss" src="./UserMenu.scss"></style>
