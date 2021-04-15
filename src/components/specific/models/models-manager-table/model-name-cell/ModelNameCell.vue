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
          :error="error"
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
        <span class="model-name-cell__content__text">
          {{ model.name }}
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useModels } from "@/state/models";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataInput.js";
import BIMDataSpinner from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataSpinner.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput,
    BIMDataSpinner
  },
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
  emits: ["close", "success", "error"],
  setup(props, { emit }) {
    const { updateModelName } = useModels();

    const loading = ref(false);

    const nameInput = ref(null);
    const modelName = ref("");
    const error = ref(false);

    const renameModel = async () => {
      try {
        if (modelName.value) {
          loading.value = true;
          await updateModelName(props.project, props.model, modelName.value);
          closeUpdateForm();
          emit("success");
        } else {
          error.value = true;
          nameInput.value.focus();
        }
      } catch (error) {
        console.log(error);
        emit("error", error);
      } finally {
        loading.value = false;
      }
    };

    const showUpdateForm = ref(false);
    const openUpdateForm = () => {
      showUpdateForm.value = true;
      setTimeout(() => nameInput.value.focus(), 200);
    };
    const closeUpdateForm = () => {
      loading.value = false;
      error.value = false;
      showUpdateForm.value = false;
      emit("close");
    };

    watch(
      () => props.model,
      model => {
        modelName.value = model.name;
      },
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
      error,
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
