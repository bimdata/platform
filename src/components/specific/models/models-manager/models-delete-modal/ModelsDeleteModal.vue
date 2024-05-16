<template>
  <BIMDataSafeZoneModal style="z-index: 100" width="600px">
    <template #title>
      {{ $t("ModelsDeleteModal.title") }}
    </template>
    <template #text>
      <p>{{ $t("ModelsDeleteModal.message") }}</p>
      <ul class="models-delete-modal__message__list">
          <li
            class="models-delete-modal__message__list__item"
            v-for="model of models"
            :key="model.id"
          >
          <span>{{ model.name }}</span>
          </li>
        </ul>
    </template>
    <template #actions>
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
  </BIMDataSafeZoneModal>
</template>

<script>
import { useModels } from "../../../../../state/models.js";
// Components
import GenericModal from "../../../../generic/generic-modal/GenericModal.vue";

export default {
  components: {
    GenericModal,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    models: {
      type: Array,
      required: true,
    },
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
      submit,
    };
  },
};
</script>

<style scoped lang="scss">
ul {
  max-height: 180px;
  overflow: auto;
  text-align: left;
  line-height: 1.5;
  li {
    margin-bottom: calc(var(--spacing-unit) / 2);
  }
}
</style>
