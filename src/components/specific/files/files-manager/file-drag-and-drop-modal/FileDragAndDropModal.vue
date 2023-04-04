<template>
  <div class="file-drag-and-drop-modal" v-click-away="closeModal">
    <div class="file-drag-and-drop-modal__header">
      <div>{{ $t("FilesManager.folderImport") }}</div>
      <BIMDataButton ghost rounded icon @click="closeModal">
        <BIMDataIcon name="close" size="xxs" fill color="granite-light" />
      </BIMDataButton>
    </div>
    <div class="file-drag-and-drop-modal__drop-zone">
      <BIMDataIcon name="upload" size="l" />
      <div class="file-drag-and-drop-modal__drop-zone__text">
        {{ $t("FileUploader.uploadDropArea") }}
      </div>
    </div>
  </div>
</template>

<script>
import { useAppModal } from "../../../app/app-modal/app-modal.js";

export default {
  setup() {
    const { closeModal } = useAppModal();

    const onValidate = () => { }

    return {
      closeModal,
      onValidate
    }
  }
}
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

    margin-top: calc(var(--spacing-unit) * 2);

    &__text {
      color: var(--color-granite-light);
      margin-top: var(--spacing-unit);
    }
  }
}
</style>