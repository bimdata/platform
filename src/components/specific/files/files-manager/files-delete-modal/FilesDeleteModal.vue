<template>
  <GenericModal
    class="files-delete-modal"
    contentWidth="450px"
    zIndex="8"
    @close="$emit('close')"
  >
    <template #header>
      {{ $t("FilesDeleteModal.title") }}
    </template>
    <template #body>
      <div class="files-delete-modal__message">
        <div>{{ $t("FilesDeleteModal.message") }}</div>
        <ul class="files-delete-modal__message__list">
          <li
            class="files-delete-modal__message__list__item"
            v-for="file of files"
            :key="file.id"
          >
            "{{ file.name }}"
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <BIMDataButton ghost radius width="120px" @click="$emit('close')">
        {{ $t("FilesDeleteModal.cancelButtonText") }}
      </BIMDataButton>
      <BIMDataButton
        color="high"
        fill
        radius
        width="120px"
        @click="removeFiles"
      >
        {{ $t("FilesDeleteModal.deleteButtonText") }}
      </BIMDataButton>
    </template>
  </GenericModal>
</template>

<script>
import { useFiles } from "@/state/files";
// Components
import GenericModal from "@/components/generic/generic-modal/GenericModal";

export default {
  components: {
    GenericModal
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    files: {
      type: Array,
      required: true
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const { softUpdateFileStructure, deleteFiles } = useFiles();

    const removeFiles = () => {
      softUpdateFileStructure("delete", props.files);
      deleteFiles(props.project, props.files);
      emit("close");
    };

    return {
      removeFiles
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesDeleteModal.scss"></style>
