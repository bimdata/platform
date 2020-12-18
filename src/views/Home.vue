<template>
  <div class="home-view">
    <img alt="BIMData Platform logo"
      src="../assets/logo.svg"
      width="330"
      height="150"
    />
    <h1>Welcome to BIMData Platform !</h1>
    <BIMDataButton color="primary" fill radius @click="signOut">
      <BIMDataIcon name="close" size="xxxs" /><span>Log Out</span>
    </BIMDataButton>
  </div>
</template>

<script>
import BIMDataButton from "@bimdata/design-system-next/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system-next/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import { useOidcState } from '@/state/oidcState';

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  setup() {
    const { signOutOidc } = useOidcState();
    return {
      signOut: signOutOidc
    };
  }
};
</script>
