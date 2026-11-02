<template>
  <div class="naming-constraint-form m-t-18">
    <div class="naming-constraint-form__body">
      <div class="naming-constraint-form__title m-b-12">
        {{ $t(`NamingConstraint.${isUpdate ? "updateConstraintTitle" : "createConstraintTitle"}`) }}
      </div>

      <div class="naming-constraint-form__content">
        <section class="naming-constraint-form__step">
          <div class="naming-constraint-form__step__head">
            <span class="naming-constraint-form__step__num">1</span>
            <span class="naming-constraint-form__step__label">
              {{ $t("NamingConstraint.ruleNameStep") }}
            </span>
          </div>

          <BIMDataInputOutlined
            width="100%"
            margin="0"
            :placeholder="$t('NamingConstraint.ruleNamePlaceholder')"
            :error="hasInvalidName"
            :errorMessage="$t('t.invalidName')"
            v-model="localState.ruleDraft.name"
            :counter="true"
            :maxLength="255"
          />
        </section>

        <section class="naming-constraint-form__step">
          <div class="naming-constraint-form__step__head">
            <span class="naming-constraint-form__step__num">2</span>
            <span class="naming-constraint-form__step__label">
              {{ $t("NamingConstraint.separatorStep") }}
            </span>
          </div>
          <div class="naming-constraint-form__radios">
            <BIMDataRadio
              v-for="option in separatorOptions"
              :key="option.value"
              :modelValue="localState.ruleDraft.separator"
              :value="option.value"
              :text="option.label"
              @update:modelValue="localState.ruleDraft.separator = $event"
            />
          </div>
        </section>

        <section class="naming-constraint-form__step">
          <div class="naming-constraint-form__step__head">
            <span class="naming-constraint-form__step__num">3</span>
            <span class="naming-constraint-form__step__label">
              {{ $t("NamingConstraint.structureSectionTitle") }}
            </span>
          </div>
          <RuleBuilder
            v-model="localState.ruleDraft.parts"
            :partLists="partLists"
            @go-to-part-list="goToPartList"
          />
          <div v-if="hasEmptyRule" class="naming-constraint-form__error">
            {{ $t("NamingConstraint.emptyParts") }}
          </div>
          <div v-if="hasInvalidBounds" class="naming-constraint-form__error">
            {{ $t("NamingConstraint.invalidBoundsError") }}
          </div>
          <div v-if="hasMissingBounds" class="naming-constraint-form__error">
            {{ $t("NamingConstraint.missingBoundsError") }}
          </div>
          <div v-if="hasInvalidMaxLength" class="naming-constraint-form__error">
            {{ $t("NamingConstraint.invalidMaxLengthError") }}
          </div>
          <div v-if="hasMissingList" class="naming-constraint-form__error">
            {{ $t("NamingConstraint.missingListError") }}
          </div>
        </section>

        <div class="naming-constraint-form__strict">
          <BIMDataCheckbox
            v-model="localState.ruleDraft.strict"
            :text="$t('NamingConstraint.strictLabel')"
          />
          <span class="naming-constraint-form__help">
            {{ $t("NamingConstraint.strictHelp") }}
          </span>
        </div>

        <div class="naming-constraint-form__preview flex flex-col">
          <span class="naming-constraint-form__preview__label">
            {{ $t("NamingConstraint.previewLabel") }}
          </span>

          <NamingConstraintPreview :rule="previewRule" />
        </div>
      </div>
    </div>

    <div class="naming-constraint-form__actions">
      <BIMDataButton ghost radius @click="cancel">
        {{ $t("t.cancel") }}
      </BIMDataButton>
      <BIMDataButton color="primary" fill radius :disabled="localState.loading" @click="submit">
        <BIMDataIconAddGavel size="xs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.saveRuleButton") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import { useFiles } from "../../../../../state/files.js";
import { useNamingConstraints } from "../../../../../state/naming-constraints.js";
import { debounce } from "../../../../../utils/async.js";
import { isFolder } from "../../../../../utils/file-structure.js";
import { collectDescendants } from "../../../../../utils/file-tree.js";
import { PART_TYPES } from "../../../../../utils/naming-constraint.js";

import { useAppModal } from "../../../app/app-modal/app-modal.js";
import RuleBuilder from "./RuleBuilder.vue";
import NamingConflictModal from "../NamingConflictModal.vue";
import NamingConstraintPreview from "../naming-constraint-preview/NamingConstraintPreview.vue";

export default {
  components: {
    RuleBuilder,
    NamingConstraintPreview,
    NamingConflictModal,
  },

  emits: ["close"],

  setup(props, { emit }) {
    const { t } = useI18n();

    const { createNamingConstraint, updateNamingConstraint } = useNamingConstraints();
    const { projectFileStructure } = useFiles();
    const { openModal, closeModal } = useAppModal();

    const localState = inject("localState");
    const refreshFiles = inject("refreshFiles", null);

    /** Draft initialization */
    const createEmptyDraft = () => ({
      name: "",
      strict: false,
      separator: "_",
      parts: [],
    });

    /** Computed */
    const isUpdate = computed(() => !!localState.constraint);
    const partLists = computed(() => localState.partLists ?? []);
    const allFolders = computed(() =>
      projectFileStructure.value ? collectDescendants(projectFileStructure.value, isFolder) : [],
    );

    const separatorOptions = computed(() => [
      {
        value: "-",
        label: t("NamingConstraint.separatorDashOption"),
      },
      {
        value: ".",
        label: t("NamingConstraint.separatorDotOption"),
      },
      {
        value: "_",
        label: t("NamingConstraint.separatorUnderscoreOption"),
      },
    ]);

    /** Form validation */
    const submitted = ref(false);
    const hasInvalidName = computed(() => {
      const name = localState.ruleDraft.name ?? "";

      return submitted.value && (!name.trim() || name.length > 255);
    });
    const hasEmptyRule = computed(() => submitted.value && !localState.ruleDraft?.parts?.length);
    const draftParts = computed(() => localState.ruleDraft?.parts ?? []);
    const hasInvalidBounds = computed(() =>
      draftParts.value.some(
        (part) =>
          part.type === PART_TYPES.BOUNDED &&
          part.min_value != null &&
          part.max_value != null &&
          part.max_value < part.min_value,
      ),
    );
    const hasMissingBounds = computed(
      () =>
        submitted.value &&
        draftParts.value.some(
          (part) =>
            part.type === PART_TYPES.BOUNDED && (part.min_value == null || part.max_value == null),
        ),
    );
    const hasInvalidMaxLength = computed(() =>
      draftParts.value.some(
        (part) =>
          part.type === PART_TYPES.N_CHARS && (part.max_length == null || part.max_length < 1),
      ),
    );
    const hasMissingList = computed(
      () =>
        submitted.value &&
        draftParts.value.some(
          (part) => part.type === PART_TYPES.VALUES_IN && part.value_list_id == null,
        ),
    );

    /** Navigation */
    const goToPartList = (index) => {
      localState.pendingPartListPartIndex = index;

      if (localState.managerType === "folder") {
        localState.returnTo = {
          view: "constraint-form",
        };

        localState.currentView = "part-list-form";
        return;
      }

      localState.returnTo = {
        tab: "constraints",
        view: "form",
      };

      localState.currentTab = "part-lists";
      localState.currentView = "form";
    };

    /** Watchers
     * Select the newly created part list on the pending part.
     */
    watch(
      () => localState.newlyCreatedPartList,
      (partList) => {
        if (!partList) return;

        const index = localState.pendingPartListPartIndex;
        const part = localState.ruleDraft?.parts?.[index];

        if (index != null && part) {
          part.value_list_id = partList.id;
          part.name = partList.name;
          part.elements = [...(partList.elements ?? [])];
        }

        localState.newlyCreatedPartList = null;
        localState.pendingPartListPartIndex = null;
      },
    );

    watch(
      () => localState.constraint,
      (constraint) => {
        if (localState.ruleDraft != null) {
          return;
        }

        if (constraint) {
          localState.ruleDraft = {
            name: constraint.name ?? "",
            strict: !!constraint.strict,
            separator: constraint.separator ?? "_",
            parts: (constraint.parts ?? []).map((part) => ({
              ...JSON.parse(JSON.stringify(part)),
              default_name: part.name ?? "",
            })),
          };
        } else {
          localState.ruleDraft = createEmptyDraft();
        }
      },
      { immediate: true },
    );

    /** Actions */
    const cancel = () => {
      submitted.value = false;
      emit("close");
    };

    const getEffectivePartName = (part) => {
      if (part.name?.trim()) {
        return part.name;
      }

      switch (part.type) {
        case PART_TYPES.N_CHARS:
          return "N CHARS";

        case PART_TYPES.BOUNDED:
          return "BOUNDED VALUES";

        case PART_TYPES.VALUES_IN: {
          const partList = partLists.value.find((item) => item.id === part.value_list_id);

          return partList?.name ?? "";
        }

        default:
          return "";
      }
    };

    const previewRule = computed(() => ({
      ...localState.ruleDraft,
      parts: localState.ruleDraft.parts.map((part) => ({
        ...part,
        name: getEffectivePartName(part),
      })),
    }));

    const buildPayload = () => ({
      name: localState.ruleDraft.name,
      strict: localState.ruleDraft.strict,
      separator: localState.ruleDraft.separator,
      parts: localState.ruleDraft.parts.map((part) => ({
        type: part.type,
        name: getEffectivePartName(part),
        max_length: part.type === PART_TYPES.N_CHARS ? part.max_length : null,
        min_value: part.type === PART_TYPES.BOUNDED ? part.min_value : null,
        max_value: part.type === PART_TYPES.BOUNDED ? part.max_value : null,
        value_list_id: part.type === PART_TYPES.VALUES_IN ? part.value_list_id : null,
      })),
    });

    const saveConstraint = async (payload) => {
      if (isUpdate.value) {
        const updated = await updateNamingConstraint(
          localState.project,
          localState.constraint,
          payload,
        );

        localState.constraints = localState.constraints.map((item) =>
          item.id === updated.id ? updated : item,
        );

        return updated;
      }

      const created = await createNamingConstraint(localState.project, payload);
      localState.constraints = [...localState.constraints, created];

      return created;
    };

    const showConflicts = (rule, documents, onConfirm) => {
      openModal({
        component: NamingConflictModal,
        props: {
          project: localState.project,
          documents,
          allFolders: allFolders.value,
          rule,
          onClose: closeModal,
          onConfirm,
        },
      });
    };

    const submit = debounce(async () => {
      submitted.value = true;

      if (
        hasInvalidName.value ||
        hasEmptyRule.value ||
        hasInvalidBounds.value ||
        hasMissingBounds.value ||
        hasInvalidMaxLength.value ||
        hasMissingList.value
      ) {
        return;
      }

      const payload = buildPayload();

      try {
        localState.loading = true;
        const savedConstraint = await saveConstraint(payload);
        localState.markRuleDraftAsSaved?.();
        const conflicts = savedConstraint?.conflicting_documents ?? [];

        if (isUpdate.value) {
          await refreshFiles?.();
        }

        if (conflicts.length) {
          showConflicts({ ...savedConstraint }, conflicts, async () => {
            await refreshFiles?.();
            closeModal();
            cancel();
          });
          return;
        }

        cancel();
      } finally {
        localState.loading = false;
      }
    }, 500);

    return {
      localState,
      isUpdate,
      partLists,
      separatorOptions,
      hasInvalidName,
      hasEmptyRule,
      hasInvalidBounds,
      hasMissingBounds,
      hasInvalidMaxLength,
      hasMissingList,
      previewRule,
      // Methods
      cancel,
      submit,
      goToPartList,
      getEffectivePartName,
    };
  },
};
</script>

<style scoped src="./NamingConstraintForm.css"></style>
