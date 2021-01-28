<template>
  <div class="user-menu" v-click-away="closeMenu">
    <BIMDataButton color="default" outline radius
      class="user-menu__btn"
      @click="toggleMenu">
      <span class="user-menu__btn__picture">{{ initials }}</span>
      <span class="user-menu__btn__fullname">{{ `${firstName} ${lastName}` }}</span>
      <span class="user-menu__btn__email">{{ email }}</span>
    </BIMDataButton>
    <transition name="fade">
      <div class="user-menu__container" v-show="isOpen">
        <BIMDataSelect
          :label="$t('Header.selectLanguage')"
          :options="$i18n.availableLocales"
          v-model="$i18n.locale"
        />
        <BIMDataButton color="primary" fill radius
          @click="signOut">
          <BIMDataIcon name="logout" size="xxs" />
          <span>{{ $t('Header.logout') }}</span>
        </BIMDataButton>
      </div>
    </transition>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useGlobalState } from '@/state/global';
// Components
import BIMDataButton from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js';
import BIMDataIcon from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js';
import BIMDataSelect from '@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSelect.js';

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSelect
  },
  setup() {
    const { user, signOut } = useGlobalState();

    const isOpen = ref(false);
    const firstName = ref(user.value.profile.given_name);
    const lastName = ref(user.value.profile.family_name);
    const email = ref(user.value.profile.email);
    const initials = computed(() => `${firstName.value[0]}${lastName.value[0]}`.toUpperCase());

    const closeMenu = () => isOpen.value = false;
    const toggleMenu = () => isOpen.value = !isOpen.value;

    return {
      // References
      isOpen,
      firstName,
      lastName,
      email,
      initials,
      // Methods
      closeMenu,
      toggleMenu,
      signOut
    };
  }
}
</script>

<style scoped lang="scss" src="./UserMenu.scss"></style>