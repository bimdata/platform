<template>
  <div class="user-menu">
    <BIMDataButton color="default" outline radius
      class="user-menu-btn"
      @click="isOpen = !isOpen">
      <span class="user-menu-btn__picture">NN</span>
      <span class="user-menu-btn__fullname">{{ `${user.profile.given_name} ${user.profile.family_name}` }}</span>
      <span class="user-menu-btn__email">{{ user.profile.email }}</span>
    </BIMDataButton>
    <transition name="fade">
      <div class="user-menu-content" v-show="isOpen">
        <BIMDataSelect
          :label="$t('Home.selectLocaleLabel')"
          :options="$i18n.availableLocales"
          v-model="$i18n.locale"
        />
        <BIMDataButton color="primary" fill radius
          @click="signOut">
          <BIMDataIcon name="close" size="xxxs" />
          <span>{{ $t('Home.logout') }}</span>
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
    return {
      user,
      signOut,
      isOpen
    };
  }
}
</script>

<style scoped lang="scss" src="./UserMenu.scss"></style>