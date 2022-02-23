<template>
  <div class="model-name-cell">
    <transition name="fade" mode="out-in">
      <div v-if="loading" class="model-name-cell__loader">
        <BIMDataSpinner />
      </div>

      <div v-else-if="showUpdateForm" class="model-name-cell__update-form">
        <BIMDataInput
          ref="nameInput"
          class="model-name-cell__update-form__input"
          v-model="modelName"
          @keyup.esc.stop="closeUpdateForm"
          @keyup.enter.stop="renameModel"
          :error="hasError"
          :errorMessage="$t('ModelNameCell.inputErrorMessage')"
        />
        <BIMDataButton
          class="model-name-cell__update-form__btn-submit"
          color="primary"
          fill
          radius
          @click="renameModel"
        >
          {{ $t("ModelNameCell.submitButtonText") }}
        </BIMDataButton>
        <BIMDataButton
          class="model-name-cell__update-form__btn-close"
          ghost
          rounded
          icon
          @click="closeUpdateForm"
        >
          <BIMDataIcon name="close" size="xxs" />
        </BIMDataButton>
      </div>

      <div v-else class="model-name-cell__content">
        <img src="/static/ifc-logo.svg" />
        <BIMDataTextbox :text="model.name" />
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useModels } from "@/state/models.js";

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    model: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close", "success"],
  setup(props, { emit }) {
    const { updateModelName } = useModels();

    const loading = ref(false);

    const nameInput = ref(null);
    const modelName = ref("");
    const hasError = ref(false);

    const renameModel = async () => {
      if (modelName.value) {
        try {
          loading.value = true;
          await updateModelName(props.project, props.model, modelName.value);
          closeUpdateForm();
          emit("success");
        } finally {
          loading.value = false;
        }
      } else {
        hasError.value = true;
        nameInput.value.focus();
      }
    };

    const showUpdateForm = ref(false);
    const openUpdateForm = () => {
      showUpdateForm.value = true;
      setTimeout(() => nameInput.value.focus(), 200);
    };
    const closeUpdateForm = () => {
      loading.value = false;
      hasError.value = false;
      showUpdateForm.value = false;
      emit("close");
    };

    watch(
      () => props.model,
      model => (modelName.value = model.name),
      { immediate: true }
    );
    watch(
      () => props.editMode,
      value => {
        if (value) {
          openUpdateForm();
        } else {
          closeUpdateForm();
        }
      }
    );

    return {
      // References
      hasError,
      loading,
      nameInput,
      modelName,
      showUpdateForm,
      // Methods
      closeUpdateForm,
      openUpdateForm,
      renameModel
    };
  }
};
</script>

<style scoped lang="scss" src="./ModelNameCell.scss"></style>
