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
          :errorMessage="errorMessage"
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

      <div v-else class="file-name-cell__content" @click="$emit('file-clicked', file)">
        <BIMDataTextbox :text="file.name" width="auto" maxWidth="94%" />
        <BIMDataTooltip
          v-if="isConflictFile"
          :text="$t('NamingConstraint.conflictTooltip')"
          position="right"
          class="flex items-center"
        >
          <BIMDataIconWarning margin="0 0 0 4px" size="xxs" fill color="warning" />
        </BIMDataTooltip>
        <div v-if="displayModelInfo(file)" class="flex items-center">
          <BIMDataTooltip
            :text="
              file.model_type === 'PHOTOSPHERE'
                ? $t('FileNameCell.photosphereFile')
                : file.nature === 'Model'
                  ? $t('FileNameCell.modelFile')
                  : ''
            "
            position="right"
            class="flex items-center"
          >
            <BIMDataIconSetAsModel
              v-if="file.nature === 'Model' || file.model_type === 'PHOTOSPHERE'"
            />
          </BIMDataTooltip>
        </div>
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
import { useI18n } from "vue-i18n";
import { useFiles } from "../../../../../state/files.js";
import { useNamingConstraints } from "../../../../../state/naming-constraints.js";
import { useAppNotification } from "../../../app/app-notification/app-notification.js";
import { debounce } from "../../../../../utils/async.js";
import { isFolder } from "../../../../../utils/file-structure.js";
import { matchName, buildExample } from "../../../../../utils/naming-constraint.js";
import { isConvertible, isConvertibleToPhotosphere } from "../../../../../utils/models.js";

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
    file: {
      type: Object,
      required: true,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close", "file-clicked", "open-versioning-manager", "success"],
  setup(props, { emit }) {
    const { t } = useI18n();
    const { updateFiles } = useFiles();
    const { getEffectiveFolderRule } = useNamingConstraints();
    const { pushNotification } = useAppNotification();

    const loading = ref(false);

    const nameInput = ref(null);
    const fileName = ref("");
    const hasError = ref(false);
    const errorMessage = ref("");

    const hasHistory = computed(() => props.file?.history_count > 0);

    const isConflictFile = computed(() => {
      return !isFolder(props.file) && props.file.naming_constraint_conflict;
    });

    const renameFile = debounce(async () => {
      if (fileName.value) {
        const rule = isFolder(props.file)
          ? null
          : await getEffectiveFolderRule(props.project, {
              id: props.file.parent_id,
            });
        if (rule?.rule && !matchName(fileName.value, rule.rule)) {
          if (rule.strict) {
            hasError.value = true;
            errorMessage.value = t("t.invalidNameFormat", {
              example: buildExample(rule.rule),
            });
            nameInput.value.focus();
            return;
          }
          pushNotification({
            type: "warning",
            title: t("NamingConstraint.applyRuleWarningTitle"),
            message: t("t.invalidNameFormat", {
              example: buildExample(rule.rule),
            }),
          });
        }
        try {
          loading.value = true;
          await updateFiles(props.project, [
            {
              ...props.file,
              name: fileName.value,
            },
          ]);
          closeUpdateForm();
          emit("success");
        } finally {
          loading.value = false;
        }
      } else {
        hasError.value = true;
        errorMessage.value = t("t.invalidName");
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
      errorMessage.value = "";
      showUpdateForm.value = false;
      emit("close");
    };

    watch(
      () => props.file,
      (file) => (fileName.value = file.name),
      { immediate: true },
    );
    watch(
      () => props.editMode,
      (value) => {
        if (value) {
          openUpdateForm();
        } else {
          closeUpdateForm();
        }
      },
    );

    const displayModelInfo = (file) => {
      if (!isFolder(file)) {
        return isConvertible(file) || isConvertibleToPhotosphere(file);
      }
    };

    return {
      // References
      fileName,
      hasError,
      errorMessage,
      loading,
      nameInput,
      showUpdateForm,
      isConflictFile,
      // Methods
      closeUpdateForm,
      hasHistory,
      displayModelInfo,
      isFolder,
      openUpdateForm,
      renameFile,
    };
  },
};
</script>

<style scoped lang="scss" src="./FileNameCell.scss"></style>
