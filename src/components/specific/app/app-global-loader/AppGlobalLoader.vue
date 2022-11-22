<template>
  <Teleport to="#app-global-loader-container">
    <Transition name="fade">
      <BIMDataLoading
        v-show="showGlobalLoader"
        class="app-global-loader"
        :message="message"
        :subMessage="subMessage"
      />
    </Transition>
  </Teleport>
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
    const { showGlobalLoader } = useAppGlobalLoader();

    return { showGlobalLoader };
  }
};
</script>

<style lang="scss" src="./AppGlobalLoader.global.scss"></style>
<style scoped lang="scss" src="./AppGlobalLoader.scss"></style>
