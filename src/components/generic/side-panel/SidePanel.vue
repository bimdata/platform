<template>
  <teleport to="#side-panel-container">
    <transition name="slide-fade-right">
      <div class="side-panel" v-show="showSidePanel">
        <div class="side-panel__title">
          <span>{{ title }}</span>
          <BIMDataButton ghost rounded icon @click="closeSidePanel">
            <BIMDataIcon name="close" size="xxxs" />
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
import { useSidePanel } from "@/composables/side-panel";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon
  },
  props: {
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
