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
          :error="hasError"
          :errorMessage="$t('t.invalidName')"
          margin="0"
        />
        <BIMDataButton
          class="file-name-cell__update-form__btn-submit"
          color="primary"
          fill
          radius
          @click="renameFile"
        >
          {{ $t("t.validate") }}
        </BIMDataButton>
        <BIMDataButton
          class="file-name-cell__update-form__btn-close"
          ghost
          rounded
          icon
          @click="closeUpdateForm"
        >
          <BIMDataIconClose size="xxs" />
        </BIMDataButton>
      </div>

      <div
        v-else
        class="file-name-cell__content"
        @click="$emit('file-clicked', file)"
      >
        <BIMDataIcon
          v-if="isFolder(file)"
          :name="
            !project.isAdmin && file.user_permission < 100
              ? 'readonlyFolder'
              : 'folder'
          "
          size="m"
          fill
          color="primary"
        />
        <BIMDataFileIcon v-else :fileName="file.file_name" :size="20" />
        <BIMDataTextbox :text="file.name" width="auto" maxWidth="70%" />
        <BIMDataIconVersioning
          v-if="hasHistory"
          margin="0px 0px 0px 4px"
          size="xxs"
          fill
          color="primary"
          @click.stop="$emit('open-versioning-manager', file)"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useFiles } from "../../../../../state/files.js";
import { debounce } from "../../../../../utils/async.js";
import { isFolder } from "../../../../../utils/file-structure.js";

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
  emits: ["close", "file-clicked", "success", "open-versioning-manager"],
  setup(props, { emit }) {
    const { updateFiles } = useFiles();

    const loading = ref(false);

    const nameInput = ref(null);
    const fileName = ref("");
    const hasError = ref(false);

    const hasHistory = computed(() => props.file?.history_count > 0);

    const renameFile = debounce(async () => {
      if (fileName.value) {
        try {
          loading.value = true;
          await updateFiles(props.project, [
            {
              ...props.file,
              name: fileName.value
            }
          ]);
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
      fileName.value = props.file.name;
      setTimeout(() => nameInput.value.focus(), 200);
    };
    const closeUpdateForm = () => {
      loading.value = false;
      hasError.value = false;
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
      fileName,
      hasError,
      loading,
      nameInput,
      showUpdateForm,
      // Methods
      closeUpdateForm,
      hasHistory,
      isFolder,
      openUpdateForm,
      renameFile
    };
  }
};
</script>

<style scoped lang="scss" src="./FileNameCell.scss"></style>
