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
            <BIMDataTextBox :text="model.name" />
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <BIMDataButton ghost radius width="120px" @click="$emit('close')">
        {{ $t("ModelsDeleteModal.cancelButtonText") }}
      </BIMDataButton>
      <BIMDataButton color="high" fill radius width="120px" @click="submit">
        {{ $t("ModelsDeleteModal.deleteButtonText") }}
      </BIMDataButton>
    </template>
  </GenericModal>
</template>

<script>
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
    const { deleteModels, softDeleteModels } = useModels();

    const submit = () => {
      deleteModels(props.project, props.models);
      softDeleteModels(props.models);
      emit("close");
    };

    return {
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsDeleteModal.scss"></style>
