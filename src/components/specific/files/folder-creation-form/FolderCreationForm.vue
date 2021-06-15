<template>
  <div class="folder-creation-form">
    <div class="folder-creation-form__title">
      <BIMDataIcon name="addFolder" size="xs" />
      <span>{{ $t("FolderCreationForm.creationFormTitle") }}</span>
    </div>
    <BIMDataInput
      ref="nameInput"
      class="folder-creation-form__input"
      :placeholder="$t('FolderCreationForm.nameInputPlaceholder')"
      v-model="name"
      :error="error"
      :errorMessage="$t('FolderCreationForm.nameInputErrorMessage')"
      @keyup.esc.stop="close"
      @keyup.enter.stop="submit"
    />
    <BIMDataButton
      class="folder-creation-form__btn-cancel"
      width="80px"
      ghost
      radius
      @click="close"
    >
      {{ $t("FolderCreationForm.cancelButtonText") }}
    </BIMDataButton>
    <BIMDataButton
      class="folder-creation-form__btn-submit"
      width="80px"
      color="primary"
      fill
      radius
      @click="submit"
    >
      {{ $t("FolderCreationForm.submitButtonText") }}
    </BIMDataButton>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useFiles } from "@/state/files";
// Components
import BIMDataButton from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataButton.js";
import BIMDataIcon from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataIcon.js";
import BIMDataInput from "@bimdata/design-system/dist/js/BIMDataComponents/vue3/BIMDataInput.js";

export default {
  components: {
    BIMDataButton,
    BIMDataIcon,
    BIMDataInput
  },
  props: {
    project: {
      type: Object,
      required: true
    },
    folder: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "success", "error"],
  setup(props, { emit }) {
    const { createFolder } = useFiles();

    const nameInput = ref(null);
    const name = ref("");
    const error = ref(false);

    const reset = () => {
      name.value = "";
      error.value = false;
    };

    const submit = async () => {
      if (name.value) {
        try {
          await createFolder(props.project, {
            parentId: props.folder.id,
            name: name.value
          });
          reset();
          emit("success");
        } catch (error) {
          emit("error", error);
        }
      } else {
        nameInput.value.focus();
        error.value = true;
      }
    };

    const close = () => {
      reset();
      emit("close");
    };

    onMounted(() => {
      setTimeout(() => nameInput.value.focus(), 200);
    });

    return {
      // References
      error,
      name,
      nameInput,
      // Methods
      close,
      submit
    };
  }
}
</script>

<style scoped lang="scss" src="./FolderCreationForm.scss"></style>
