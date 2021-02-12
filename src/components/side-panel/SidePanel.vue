<template>
  <div class="side-panel">
    <div class="side-panel__title">
      <span>{{ title }}</span>
      <BIMDataButton ghost rounded icon @click="$emit('close')">
        <BIMDataIcon name="close" size="xxxs" />
      </BIMDataButton>
    </div>
    <div class="side-panel__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
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
  emits: ["close"]
};
</script>

<style scoped lang="scss" src="./SidePanel.scss"></style>
