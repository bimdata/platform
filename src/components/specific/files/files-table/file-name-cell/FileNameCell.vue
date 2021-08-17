<template>
  <div class="file-name-cell">
    <transition name="fade" mode="out-in">
      <div v-if="loading" class="file-name-cell__loader">
        <BIMDataSpinner />
      </div>

      <div v-else-if="showUpdateForm" class="file-name-cell__update-form">
        <BIMDataInput
          ref="nameInput"
          class="file-name-cell__update-form__input"
          v-model="fileName"
          @keyup.esc.stop="closeUpdateForm"
          @keyup.enter.stop="renameFile"
          :error="error"
          :errorMessage="$t('FileNameCell.inputErrorMessage')"
          margin="0"
        />
        <BIMDataButton
          class="file-name-cell__update-form__btn-submit"
          color="primary"
          fill
          radius
          @click="renameFile"
        >
          {{ $t("FileNameCell.submitButtonText") }}
        </BIMDataButton>
        <BIMDataButton
          class="file-name-cell__update-form__btn-close"
          ghost
          rounded
          icon
          @click="closeUpdateForm"
        >
          <BIMDataIcon name="close" size="xxs" />
        </BIMDataButton>
      </div>

      <div
        v-else
        class="file-name-cell__content"
        @click="$emit('file-clicked', file)"
      >
        <BIMDataIcon
          v-if="file.type === 'Folder'"
          class="file-name-cell__content__icon-folder"
          name="folder"
          size="m"
        />
        <FileIcon v-else-if="file.type === 'Ifc'" name="ifc" size="20" />
        <FileIcon v-else :name="fileExtension(file.name)" size="20" />
        <TextBox :text="file.name" :maxLength="64" />
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useFiles } from "@/state/files";
import { fileExtension } from "@/utils/files";

export default {
  props: {
    project: {
      type: Object,
      required: true
    },
    file: {
      type: Object,
      required: true
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ["file-clicked", "close", "success", "error"],
  setup(props, { emit }) {
    const { updateFiles } = useFiles();

    const loading = ref(false);

    const nameInput = ref(null);
    const fileName = ref("");
    const error = ref(false);

    const renameFile = async () => {
      try {
        if (fileName.value) {
          loading.value = true;
          await updateFiles(props.project, [
            {
              ...props.file,
              name: fileName.value
            }
          ]);
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
      fileName.value = props.file.name;
      setTimeout(() => nameInput.value.focus(), 200);
    };
    const closeUpdateForm = () => {
      loading.value = false;
      error.value = false;
      showUpdateForm.value = false;
      emit("close");
    };

    watch(
      () => props.file,
      file => (fileName.value = file.name),
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
      fileName,
      loading,
      nameInput,
      showUpdateForm,
      // Methods
      closeUpdateForm,
      fileExtension,
      openUpdateForm,
      renameFile
    };
  }
};
</script>

<style scoped lang="scss" src="./FileNameCell.scss"></style>
