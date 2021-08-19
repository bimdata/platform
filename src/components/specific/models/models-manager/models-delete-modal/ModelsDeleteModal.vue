<template>
  <GenericModal
    class="models-delete-modal"
    contentWidth="450px"
    @close="$emit('close')"
  >
    <template #header>
      {{ $t("ModelsDeleteModal.title") }}
    </template>
    <template #body>
      <div class="models-delete-modal__message">
        <div>{{ $t("ModelsDeleteModal.message") }}</div>
        <ul class="models-delete-modal__message__list">
          <li
            class="models-delete-modal__message__list__item"
            v-for="model of models"
            :key="model.id"
          >
            "{{ model.name }}"
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <BIMDataButton ghost radius width="120px" @click="$emit('close')">
        {{ $t("ModelsDeleteModal.cancelButtonText") }}
      </BIMDataButton>
      <BIMDataButton
        color="high"
        fill
        radius
        width="120px"
        @click="removeModels"
      >
        {{ $t("ModelsDeleteModal.deleteButtonText") }}
      </BIMDataButton>
    </template>
  </GenericModal>
</template>

<script>
import { useErrors } from "@/composables/errors";
import { useModels } from "@/state/models";
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
    models: {
      type: Array,
      required: true
    }
  },
  emits: ["close"],
  setup(props, { emit }) {
    const { handleError, MODEL_DELETE_ERROR } = useErrors();
    const { softDeleteModels, deleteModels } = useModels();

    const removeModels = async () => {
      try {
        softDeleteModels(props.models);
        await deleteModels(props.project, props.models);
        emit("close");
      } catch (error) {
        handleError(MODEL_DELETE_ERROR, error);
      }
    };

    return {
      removeModels
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsDeleteModal.scss"></style>
