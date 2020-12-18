<template>
  <div class="home-view">
    <img alt="BIMData Platform logo"
      src="../assets/logo.svg"
      width="330"
      height="150"
    />
    <h1>{{ $t('Home.welcome') }}</h1>
    <div>
      <BIMDataSelect
        :label="$t('Home.selectLocaleLabel')"
        :options="$i18n.availableLocales"
        v-model="$i18n.locale"
        width="150px"
      />
      <BIMDataButton color="primary" fill radius @click="signOut">
        <BIMDataIcon name="close" size="xxxs" />
        <span>{{ $t('Home.logout') }}</span>
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import BIMDataButton from "@bimdata/design-system-next/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system-next/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataSelect from "@bimdata/design-system-next/dist/js/BIMDataComponents/vue3/BIMDataSelect.js";
import { useOidcState } from '@/state/oidcState';

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataSelect
  },
  setup() {
    const { signOutOidc } = useOidcState();
    return {
      signOut: signOutOidc
    };
  }
};
</script>

<style scoped>
.bimdata-select {
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
}
.bimdata-btn {
  display: inline-block;
}
</style>
