<template>
  <teleport :to="`#app-side-panel-container--${side}`">
    <transition :name="`slide-fade-${side}`">
      <div class="app-side-panel" v-show="showSidePanel">
        <div class="app-side-panel__header">
          <span class="app-side-panel__header__title">
            <slot name="title">{{ title }}</slot>
          </span>
          <BIMDataButton ghost rounded icon @click="closeSidePanel">
            <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
          </BIMDataButton>
        </div>
        <div class="app-side-panel__content">
          <slot></slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { onBeforeRouteLeave } from "vue-router";
import { useAppSidePanel } from "./app-side-panel.js";

export default {
  props: {
    side: {
      type: String,
      default: "right",
      validator: value => ["right", "left"].includes(value)
    },
    title: {
      type: String,
      default: ""
    }
  },
  setup() {
    const { showSidePanel, closeSidePanel } = useAppSidePanel();

    onBeforeRouteLeave(() => {
      if (showSidePanel.value) closeSidePanel();
    });

    return {
      // References
      showSidePanel,
      // Methods
      closeSidePanel
    };
  }
};
</script>

<style lang="scss" src="./AppSidePanel.global.scss"></style>
<style scoped lang="scss" src="./AppSidePanel.scss"></style>
