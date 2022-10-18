<template>
  <AppSlotContent :name="`app-side-panel-${side}`">
    <div v-if="header" class="app-side-panel__header">
      <slot name="header">
        <span class="app-side-panel__header__title">
          {{ title }}
        </span>
        <BIMDataButton ghost rounded icon @click="closeSidePanel(side)">
          <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
        </BIMDataButton>
      </slot>
    </div>
    <div class="app-side-panel__content">
      <slot></slot>
    </div>
  </AppSlotContent>
</template>

<script>
import { onBeforeRouteLeave } from "vue-router";
import { useAppSidePanel } from "./app-side-panel.js";
// Components
import AppSlotContent from "../app-slot/AppSlotContent.vue";

export default {
  components: {
    AppSlotContent
  },
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
    const { closeSidePanel } = useAppSidePanel();

    // Auto-close side panel(s) on route change
    onBeforeRouteLeave(() => {
      closeSidePanel("left");
      closeSidePanel("right");
    });

    return { closeSidePanel };
  }
};
</script>

<style scoped lang="scss">
.app-side-panel__header {
  display: flex;
  align-items: center;
  height: var(--header-height);
  padding: calc(var(--spacing-unit) / 2) 0;

  &__title {
    flex-grow: 1;
    font-weight: bold;
  }
}

.app-side-panel__content {
  height: 100%;
}

.app-side-panel__header ~ .app-side-panel__content {
  height: calc(100% - var(--header-height));
}
</style>
