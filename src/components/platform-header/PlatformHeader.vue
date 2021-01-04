<template>
  <div class="platform-header">
    <img
      alt="BIMData Platform logo"
      src="@/assets/logo.svg"
      width="110"
      height="50"
    />
    <UserMenu />
  </div>
</template>

<script>
// Components
import UserMenu from '@/components/user-menu/UserMenu';

export default {
  components: {
    UserMenu
  }
}
</script>

<style scoped lang="scss" src="./PlatformHeader.scss"></style>