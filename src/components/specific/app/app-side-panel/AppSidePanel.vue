<template>
  <!-- Left Panel -->
  <teleport to="#app-side-panel-container--left">
    <transition name="slide-fade-left">
      <div v-show="isOpenLeft" class="app-side-panel">
        <AppSlot name="app-side-panel-left" />
      </div>
    </transition>
  </teleport>

  <!-- Right Panel -->
  <teleport to="#app-side-panel-container--right">
    <transition name="slide-fade-right">
      <div v-show="isOpenRight" class="app-side-panel">
        <AppSlot name="app-side-panel-right" />
      </div>
    </transition>
  </teleport>
</template>

<script>
import { useAppSidePanel } from "./app-side-panel.js";
// Components
import AppSlot from "../app-slot/AppSlot.js";

export default {
  components: {
    AppSlot
  },
  setup() {
    const { isOpenLeft, isOpenRight } = useAppSidePanel();

    return { isOpenLeft, isOpenRight };
  }
};
</script>

<style lang="scss" src="./AppSidePanel.global.scss"></style>
<style scoped lang="scss" src="./AppSidePanel.scss"></style>
