<template>
  <div class="home-view">
    <img alt="BIMData Platform logo"
      src="../assets/logo.svg"
      width="330"
      height="150"
    />
    <h1>Welcome to BIMData Platform !</h1>
    <button @click="signOutOidc">Log Out</button>
  </div>
</template>

<script>
import { useOidcState } from '@/state/oidcState';

export default {
  // name: "Home",
  // methods: {
  //   ...mapActions([ 'signOutOidc' ])
  // }
  setup() {
    const { signOutOidc } = useOidcState();
    return {
      signOutOidc
    };
  }
};
</script>
