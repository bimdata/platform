<template>
  <GenericModal
    class="models-delete-modal"
    data-test-id="models-delete-modal"
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
            <BIMDataTextbox :text="model.name" />
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <BIMDataButton
        data-test-id="btn-close"
        ghost
        radius
        width="120px"
        @click="$emit('close')"
      >
        {{ $t("t.cancel") }}
      </BIMDataButton>
      <BIMDataButton
        data-test-id="btn-submit"
        color="high"
        fill
        radius
        width="120px"
        @click="submit"
      >
        {{ $t("t.delete") }}
      </BIMDataButton>
    </template>
  </GenericModal>
</template>

<script>
import { useModels } from "../../../../../state/models.js";
// Components
import GenericModal from "../../../../generic/generic-modal/GenericModal.vue";

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
      deleteModels(props.project, props.models, { hard: true });
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
