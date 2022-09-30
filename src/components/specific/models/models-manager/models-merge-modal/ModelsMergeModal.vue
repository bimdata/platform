<template>
  <GenericModal
    class="models-merge-modal"
    contentWidth="450px"
    @close="$emit('close')"
  >
    <template #header>
      <BIMDataIcon name="union" size="xl" />
      <div>{{ $t("ModelsMergeModal.title") }}</div>
    </template>
    <template #body>
      <BIMDataInput
        ref="mergeNameInput"
        class="models-merge-modal__input"
        :placeholder="$t('ModelsMergeModal.inputPlaceholder')"
        v-model="mergeName"
        @keyup.enter.stop="merge"
        :error="error"
        :errorMessage="$t('ModelsMergeModal.inputErrorMessage')"
      />
    </template>
    <template #footer>
      <BIMDataButton color="primary" fill radius width="120px" @click="merge">
        {{ $t("ModelsMergeModal.submitButtonText") }}
      </BIMDataButton>
    </template>
  </GenericModal>
</template>

<script>
import { onMounted, ref } from "vue";
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
    const { mergeModels } = useModels();

    const mergeNameInput = ref(null);
    const mergeName = ref("");
    const error = ref(false);

    const merge = async () => {
      if (mergeName.value) {
        await mergeModels(props.project, props.models, mergeName.value);
        emit("close");
      } else {
        error.value = true;
        mergeNameInput.value.focus();
      }
    };

    onMounted(() => {
      mergeNameInput.value.focus();
    });

    return {
      // References
      error,
      mergeName,
      mergeNameInput,
      // Methods
      merge
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelsMergeModal.scss"></style>
