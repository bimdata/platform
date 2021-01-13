<template>
  <div class="user-menu" v-click-away="close">
    <BIMDataButton color="default" outline radius
      class="user-menu-btn"
      @click="toggle">
      <span class="user-menu-btn__picture">NN</span>
      <span class="user-menu-btn__fullname">{{ `${user.profile.given_name} ${user.profile.family_name}` }}</span>
      <span class="user-menu-btn__email">{{ user.profile.email }}</span>
    </BIMDataButton>
    <transition name="fade">
      <div class="user-menu-content" v-show="isOpen">
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
import { ref } from 'vue';
import { useGlobalState } from '@/state/globalState';
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
    const close = () => isOpen.value = false;
    const toggle = () => isOpen.value = !isOpen.value;
    return {
      user,
      isOpen,
      close,
      toggle,
      signOut
    };
  }
}
</script>

<style scoped lang="scss" src="./UserMenu.scss"></style>