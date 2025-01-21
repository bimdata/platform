<template>
  <AppSlotContent name="app-modal">
    <div class="app-modal__box" :style="boxStyle">
      <BIMDataButton
        class="app-modal__box__btn-close"
        :style="{ color: closeBtnColor }"
        ghost
        rounded
        icon
        @click="closeModal"
      >
        <BIMDataIconClose size="xxs" />
      </BIMDataButton>
      <slot></slot>
    </div>
  </AppSlotContent>
</template>

<script setup>
import { onBeforeRouteLeave } from "vue-router";
import { useAppModal } from "./app-modal.js";
// Components
import AppSlotContent from "../app-slot/AppSlotContent.js";

defineProps({
  boxStyle: {
    type: Object,
    default: () => ({})
  },
  closeBtnColor: {
    type: String,
    default: "var(--color-granite-light)"
  }
});

const { closeModal } = useAppModal();

onBeforeRouteLeave(() => closeModal());
</script>

<style scoped lang="scss">
.app-modal__box {
  position: relative;
  min-width: 400px;
  min-height: 400px;
  padding: calc(var(--spacing-unit) * 3);
  background-color: var(--color-white);

  &__btn-close {
    position: absolute;
    top: calc(var(--spacing-unit) / 2);
    right: calc(var(--spacing-unit) / 2);
    &:hover {
      background-color: rgba(216, 216, 216, 0.1);
    }
  }
}
</style>
