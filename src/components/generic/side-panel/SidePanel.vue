<template>
  <teleport :to="`#side-panel-container--${side}`">
    <transition :name="`slide-fade-${side}`">
      <div class="side-panel" v-show="showSidePanel">
        <div class="side-panel__header">
          <span class="side-panel__header__title">
            <slot name="title">{{ title }}</slot>
          </span>
          <BIMDataButton ghost rounded icon @click="closeSidePanel">
            <BIMDataIcon name="close" size="xxs" fill color="tertiary-dark" />
          </BIMDataButton>
        </div>
        <div class="side-panel__content">
          <slot></slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { useSidePanel } from "@/composables/side-panel.js";

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
    const { showSidePanel, closeSidePanel } = useSidePanel();

    return {
      // References
      showSidePanel,
      // Methods
      closeSidePanel
    };
  }
};
</script>

<style scoped lang="scss" src="./SidePanel.scss"></style>
