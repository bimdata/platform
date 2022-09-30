<template>
  <teleport :to="`#app-side-panel-container--${side}`">
    <transition :name="`slide-fade-${side}`">
      <div
        v-show="showSidePanel"
        class="app-side-panel"
        :style="`--header-height: ${header ? '44px' : '0px'}`"
      >
        <div v-if="header" class="app-side-panel__header">
          <slot name="header">
            <span class="app-side-panel__header__title">
              {{ title }}
            </span>
            <BIMDataButton ghost rounded icon @click="closeSidePanel">
              <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
            </BIMDataButton>
          </slot>
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
    header: {
      type: Boolean,
      default: true
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
