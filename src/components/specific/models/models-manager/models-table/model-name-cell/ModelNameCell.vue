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
        <template v-if="model.type === MODEL_TYPE.IFC">
          <img src="/static/ifc-logo.svg" />
        </template>
        <template v-if="model.type === MODEL_TYPE.DWG">
          <BIMDataIcon name="fileDwgPolychrome" size="m" />
        </template>
        <template v-if="model.type === MODEL_TYPE.DXF">
          <img src="/static/dxf-file.svg" />
        </template>
        <template v-if="model.type === MODEL_TYPE.PDF">
          <BIMDataIcon name="filePdfPolychrome" size="m" />
        </template>
        <template v-if="model.type === MODEL_TYPE.META_BUILDING">
          <BIMDataIcon name="building" size="s" />
        </template>
        <BIMDataTextbox :text="model.name" />
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { MODEL_TYPE } from "../../../../../../config/models.js";
import { useModels } from "../../../../../../state/models.js";
import { debounce } from "../../../../../../utils/async.js";

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

    const renameModel = debounce(async () => {
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
    }, 500);

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
      modelName,
      MODEL_TYPE,
      nameInput,
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
