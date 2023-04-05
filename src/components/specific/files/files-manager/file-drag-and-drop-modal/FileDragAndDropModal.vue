<template>
  <div class="file-drag-and-drop-modal" v-click-away="closeModal">
    <div class="file-drag-and-drop-modal__header">
      <div>{{ $t("FilesManager.folderImport") }}</div>
      <BIMDataButton ghost rounded icon @click="closeModal">
        <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>
    <div
      class="file-drag-and-drop-modal__drop-zone"
      :class="{ 'file-drag-and-drop-modal__drop-zone--dragover': dragOver }"
      @dragleave="onDragleave"
      @dragover="onDragover"
      @drop="onDrop"
    >
      <BIMDataIcon name="upload" size="l" />
      <div class="file-drag-and-drop-modal__drop-zone__text">
        {{ $t("FileUploader.uploadDropArea") }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

import { useAppModal } from "../../../app/app-modal/app-modal.js";

export default {
  emits: ["drop"],
  setup(_, { emit }) {
    const { closeModal } = useAppModal();

    const dragOver = ref(false);

    const onDragleave = () => {
      dragOver.value = false;
    };
    const onDragover = event => {
      if (event.dataTransfer.types.includes("Files")) {
        event.preventDefault();
        event.stopPropagation();

        dragOver.value = true;
      }
    };

    const onDrop = event => {
      event.preventDefault();
      event.stopPropagation();

      emit("drop", event);

      closeModal();
    };

    return {
      onDragleave,
      onDragover,
      onDrop,
      closeModal,
      dragOver
    };
  }
};
</script>

<style scoped lang="scss">
.file-drag-and-drop-modal {
  background-color: white;
  width: 530px;
  padding: calc(var(--spacing-unit) * 2);

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__drop-zone {
    height: 170px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border: dashed 2px var(--color-silver-dark);
    border-radius: calc(var(--spacing-unit) / 2);

    margin-top: calc(var(--spacing-unit) * 2);

    &__text {
      color: var(--color-granite-light);
      margin-top: var(--spacing-unit);
    }

    &--dragover {
      border: solid 1px var(--color-primary);
      background-color: var(--color-primary-lighter);
    }
  }
}
</style>