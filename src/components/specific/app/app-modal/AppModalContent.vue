<script setup>
import { useAppModal } from "./app-modal.js";
// Components
import AppSlotContent from "../app-slot/AppSlotContent.vue";

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

const emit = defineEmits(["close"]);

const { closeModal } = useAppModal();

const close = () => {
  closeModal();
  emit("close");
};
</script>

<template>
  <AppSlotContent name="app-modal">
    <div class="app-modal__box" :style="boxStyle">
      <BIMDataButton
        class="app-modal__box__btn-close"
        :style="{ color: closeBtnColor }"
        ghost
        rounded
        icon
        @click="close"
      >
        <BIMDataIcon name="close" size="xxs" />
      </BIMDataButton>
      <slot></slot>
    </div>
  </AppSlotContent>
</template>

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
