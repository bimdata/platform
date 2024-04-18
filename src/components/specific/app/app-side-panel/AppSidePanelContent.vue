<template>
  <AppSlotContent :name="`app-side-panel-${side}`">
    <div v-if="header" class="app-side-panel__header">
      <slot name="header">
        <span class="title">
          {{ title }}
        </span>
        <BIMDataButton ghost rounded icon @click="closeSidePanel(side)">
          <BIMDataIconClose size="xxs" fill color="granite-light" />
        </BIMDataButton>
      </slot>
    </div>
    <div class="app-side-panel__content">
      <slot></slot>
    </div>
  </AppSlotContent>
</template>

<script>
import { useAppSidePanel } from "./app-side-panel.js";
// Components
import AppSlotContent from "../app-slot/AppSlotContent.js";

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

    return { closeSidePanel };
  }
};
</script>

<style scoped>
.app-side-panel__header {
  display: flex;
  align-items: center;
  height: var(--header-height);
  padding: calc(var(--spacing-unit) / 2) 0;

  .title {
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
