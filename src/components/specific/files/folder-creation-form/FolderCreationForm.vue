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
      :error="hasError"
      :errorMessage="$t('FolderCreationForm.nameInputErrorMessage')"
      @keyup.esc.stop="close"
      @keyup.enter.stop="submit"
      margin="24px 0px"
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
import { useFiles } from "../../../../state/files.js";
import { debounce } from "../../../../utils/async.js";

export default {
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
  emits: ["close", "success"],
  setup(props, { emit }) {
    const { createFolder } = useFiles();

    const nameInput = ref(null);
    const name = ref("");
    const hasError = ref(false);

    const reset = () => {
      name.value = "";
      hasError.value = false;
    };

    const submit = debounce(async () => {
      if (name.value) {
        await createFolder(props.project, {
          parent_id: props.folder.id,
          name: name.value
        });
        reset();
        emit("success");
      } else {
        nameInput.value.focus();
        hasError.value = true;
      }
    }, 500);

    const close = () => {
      reset();
      emit("close");
    };

    onMounted(() => {
      setTimeout(() => nameInput.value.focus(), 200);
    });

    return {
      // References
      hasError,
      name,
      nameInput,
      // Methods
      close,
      submit
    };
  }
};
</script>

<style scoped lang="scss" src="./FolderCreationForm.scss"></style>
