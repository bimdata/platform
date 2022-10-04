<template>
  <teleport to="#app-global-loader-container">
    <transition name="fade" mode="out-in">
      <template v-if="showGlobalLoader">
        <BIMDataLoading
          class="app-global-loader"
          :message="message"
          :subMessage="subMessage"
        />
      </template>
    </transition>
  </teleport>
</template>

<script>
import { useAppGlobalLoader } from "./app-global-loader.js";

export default {
  props: {
    message: {
      type: String
    },
    subMessage: {
      type: String
    }
  },
  setup() {
    return {
      showGlobalLoader: useAppGlobalLoader().showGlobalLoader
    };
  }
};
</script>

<style lang="scss" src="./AppGlobalLoader.global.scss"></style>
<style scoped lang="scss" src="./AppGlobalLoader.scss"></style>
