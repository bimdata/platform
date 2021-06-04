<template>
  <div class="generic-modal" :style="{ zIndex }">
    <div
      class="generic-modal__content"
      :style="{
        width: contentWidth,
        height: contentHeight
      }"
    >
      <BIMDataButton
        class="generic-modal__content__btn-close"
        ghost
        rounded
        icon
        @click="$emit('close')"
      >
        <BIMDataIcon name="close" size="xxs" />
      </BIMDataButton>
      <div class="generic-modal__content__title">
        <slot name="header"></slot>
      </div>
      <div class="generic-modal__content__text">
        <slot name="body"></slot>
      </div>
      <div class="generic-modal__content__actions">
        <slot name="footer"></slot>
      </div>
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
    contentWidth: {
      type: String,
      default: "50%"
    },
    contentHeight: {
      type: String,
      default: "50%"
    },
    zIndex: {
      type: [String, Number],
      default: 2
    }
  },
  emits: ["close"]
};
</script>

<style scoped lang="scss" src="./GenericModal.scss"></style>
