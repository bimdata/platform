<template>
  <div class="platform-layout">
    <PlatformHeader />
    <div class="view-container">
      <router-view></router-view>
    </div>
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
