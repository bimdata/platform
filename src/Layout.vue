<template>
  <div id="layout">
    <PlatformHeader />
    <router-view></router-view>
  </div>
</template>

<script>
// Components
import PlatformHeader from '@/components/platform-header/PlatformHeader';

export default {
  components: {
    PlatformHeader
  }
}
</script>

<style scoped lang="scss" src="./styles/layout.scss"></style>
