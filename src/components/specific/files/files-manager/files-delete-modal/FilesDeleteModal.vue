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
        <div>
          {{
            $t(`FilesDeleteModal.${hasVersions ? "messageVersion" : "message"}`)
          }}
        </div>
        <ul class="files-delete-modal__message__list">
          <li
            class="files-delete-modal__message__list__item"
            v-for="file of files"
            :key="file.id"
          >
            <BIMDataTextbox :text="file.name" />
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <BIMDataButton ghost radius width="120px" @click="$emit('close')">
        {{ $t("FilesDeleteModal.cancelButtonText") }}
      </BIMDataButton>
      <BIMDataButton color="high" fill radius width="120px" @click="submit">
        {{ $t("FilesDeleteModal.deleteButtonText") }}
      </BIMDataButton>
    </template>
  </GenericModal>
</template>

<script>
import { computed } from "vue";
import { useFiles } from "@/state/files";
// Components
import GenericModal from "@/components/generic/generic-modal/GenericModal.vue";

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
    const { deleteFiles, softUpdateFileStructure } = useFiles();

    const hasVersions = computed(() =>
      props.files.some(file => file.history.length > 1)
    );

    const submit = () => {
      deleteFiles(props.project, props.files);
      softUpdateFileStructure("delete", props.files);
      emit("close");
    };

    return {
      submit,
      hasVersions
    };
  }
};
</script>

<style scoped lang="scss" src="./FilesDeleteModal.scss"></style>
