<template>
  <div class="warning-modal">
    <BIMDataButton  class="warning-modal__btn-close" ghost rounded icon @click="closeModal">
      <BIMDataIconClose size="xxs" fill color="granite" />
    </BIMDataButton>
    <BIMDataIconWarning class="warning-modal__icon" size="xl" fill color="warning" />
    <div class="warning-modal__title">
      {{ $t("WarningModal.title") }}
    </div>
    <div class="warning-modal__text">
      {{ $t("WarningModal.text1") }}
    </div>
    <div class="warning-modal__text">
      {{ $t("WarningModal.text2") }}
    </div>
  </div>
</template>

<script setup>
import { onBeforeRouteLeave } from "vue-router";
import { useAppModal } from "../app-modal/app-modal.js"; 

const { closeModal } = useAppModal();

onBeforeRouteLeave(() => closeModal());
</script>

<style scoped>
.warning-modal {
  position: relative;
  width: 500px;
  min-height: 400px;
  padding: calc(var(--spacing-unit) * 3);
  background-color: var(--color-white);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-unit);

  .warning-modal__title {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-warning);
  }

  .warning-modal__text {
    text-align: center;
  }

  .warning-modal__btn-close {
    position: absolute;
    top: calc(var(--spacing-unit) / 2);
    right: calc(var(--spacing-unit) / 2);
    &:hover {
      background-color: rgba(216, 216, 216, 0.1);
    }
  }
}
</style>
