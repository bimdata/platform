<template>
  <!-- Left Panel -->
  <teleport to="#app-side-panel-container--left">
    <transition name="slide-fade-left">
      <div v-show="isOpenLeft" class="app-side-panel">
        <template v-if="contentLeft">
          <component :is="contentLeft.component" v-bind="contentLeft.props" />
        </template>
        <template v-else>
          <AppSlot name="app-side-panel-left" />
        </template>
      </div>
    </transition>
  </teleport>

  <!-- Right Panel -->
  <teleport to="#app-side-panel-container--right">
    <transition name="slide-fade-right">
      <div v-show="isOpenRight" class="app-side-panel">
        <template v-if="contentRight">
          <component :is="contentRight.component" v-bind="contentRight.props" />
        </template>
        <template v-else>
          <AppSlot name="app-side-panel-right" />
        </template>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { useRouter } from "vue-router";
import { useAppSidePanel } from "./app-side-panel.js";
// Components
import AppSlot from "../app-slot/AppSlot.js";

export default {
  components: {
    AppSlot
  },
  setup() {
    const router = useRouter();
    const { isOpenLeft, contentLeft, isOpenRight, contentRight, closeSidePanel } =
      useAppSidePanel();

    // Auto-close side panels on route change
    router.beforeEach(() => {
      closeSidePanel("left");
      closeSidePanel("right");
    });

    return { isOpenLeft, contentLeft, isOpenRight, contentRight };
  }
};
</script>

<style lang="scss" src="./AppSidePanel.global.scss"></style>
<style scoped lang="scss" src="./AppSidePanel.scss"></style>
