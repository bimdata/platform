<template>
  <Teleport to="#app-modal-container">
    <Transition name="fade">
      <div class="app-modal__overlay" v-show="showModal">
        <template v-if="content">
          <component :is="content.component" v-bind="content.props" />
        </template>
        <template v-else>
          <AppSlot name="app-modal" />
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { useAppModal } from "./app-modal.js";
// Components
import AppSlot from "../app-slot/AppSlot.js";

export default {
  components: {
    AppSlot
  },
  setup() {
    const { content, showModal, closeModal } = useAppModal();

    return {
      // References
      content,
      showModal,
      // Methods
      closeModal
    };
  }
};
</script>

<style lang="scss" src="./AppModal.global.scss"></style>
<style scoped lang="scss" src="./AppModal.scss"></style>
