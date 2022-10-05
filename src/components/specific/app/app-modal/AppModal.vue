<template>
  <teleport to="#app-modal-container">
    <transition name="fade">
      <div
        class="app-modal__overlay"
        :class="{ 'app-modal__large': isModalLarge }"
        v-show="showModal"
      >
        <div class="app-modal__box" :style="{ backgroundColor: bgColor }">
          <BIMDataButton
            class="app-modal__box__btn-close"
            ghost
            rounded
            icon
            @click="closeModal"
          >
            <BIMDataIcon name="close" size="xxs" fill :color="iconColor" />
          </BIMDataButton>
          <slot></slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { useAppModal } from "./app-modal.js";

export default {
  props: {
    bgColor: {
      type: String,
      default: "var(--color-white)"
    },
    iconColor: {
      type: String,
      default: "granite-light"
    },
    isModalLarge: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { showModal, closeModal } = useAppModal();

    return {
      // References
      showModal,
      // Methods
      closeModal
    };
  }
};
</script>

<style lang="scss" src="./AppModal.global.scss"></style>
<style scoped lang="scss" src="./AppModal.scss"></style>
