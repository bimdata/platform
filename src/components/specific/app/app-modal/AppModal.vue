<template>
  <teleport to="#modal-container">
    <transition name="fade">
      <div class="app-modal__overlay" v-show="showModal">
        <div class="app-modal__box">
          <BIMDataButton
            class="app-modal__box__btn-close"
            ghost
            rounded
            icon
            @click="closeModal"
          >
            <BIMDataIcon name="close" size="xs" fill color="granite-light" />
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

<style scoped lang="scss" src="./AppModal.scss"></style>
