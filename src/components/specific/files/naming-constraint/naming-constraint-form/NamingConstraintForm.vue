<template>
  <div class="naming-constraint-form m-t-24">
    <div class="naming-constraint-form__title">
      {{ $t(`NamingConstraint.${isUpdate ? "updateConstraintTitle" : "createConstraintTitle"}`) }}
    </div>

    <section class="naming-constraint-form__step">
      <div class="naming-constraint-form__step__head">
        <span class="naming-constraint-form__step__num">1</span>
        <span class="naming-constraint-form__step__label">
          {{ $t("NamingConstraint.ruleNameStep") }}
        </span>
      </div>
      <BIMDataInput
        width="100%"
        margin="0"
        :placeholder="$t('NamingConstraint.ruleNamePlaceholder')"
        :error="hasInvalidName"
        :errorMessage="$t('t.invalidName')"
        v-model="name"
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
          :modelValue="separator"
          :value="option.value"
          :text="option.label"
          @update:modelValue="separator = $event"
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
      <RuleBuilder v-model="parts" :templates="templates" @create-template="onCreateTemplate" />
      <!-- <div v-if="hasEmptyRule" class="naming-constraint-form__error">
        {{ $t("NamingConstraint.emptyParts") }}
      </div> -->
      <div v-if="hasInvalidBounds" class="naming-constraint-form__error">
        {{ $t("NamingConstraint.invalidBoundsError") }}
      </div>
    </section>

    <div class="naming-constraint-form__strict">
      <BIMDataCheckbox v-model="strict" :text="$t('NamingConstraint.strictLabel')" />
      <span class="naming-constraint-form__help">
        {{ $t("NamingConstraint.strictHelp") }}
      </span>
    </div>

    <div class="naming-constraint-form__preview" v-if="example">
      <span class="naming-constraint-form__preview__label">
        {{ $t("NamingConstraint.previewLabel") }}
      </span>
      <code class="naming-constraint-form__preview__value">{{ example }}</code>
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
import {
  useNamingConstraints,
  NamingConstraintConflictError,
} from "../../../../../state/naming-constraints.js";
import { buildExample } from "../../../../../utils/naming-constraint.js";
import { debounce } from "../../../../../utils/async.js";
import { collectDescendants } from "../../../../../utils/file-tree.js";
import { isFolder } from "../../../../../utils/file-structure.js";
import { useFiles } from "../../../../../state/files.js";
import { useAppModal } from "../../../app/app-modal/app-modal.js";
// Components
import RuleBuilder from "./RuleBuilder.vue";
import NamingConflictModal from "../NamingConflictModal.vue";

export default {
  components: {
    RuleBuilder,
  },
  setup() {
    const { t } = useI18n();
    const { createNamingConstraint, updateNamingConstraint, createNamingPartsTemplate } =
      useNamingConstraints();
    const { projectFileStructure } = useFiles();
    const { openModal, closeModal } = useAppModal();

    const allFolders = computed(() =>
      projectFileStructure.value ? collectDescendants(projectFileStructure.value, isFolder) : [],
    );

    const localState = inject("localState");

    const isUpdate = computed(() => !!localState.constraint);
    const templates = computed(() => localState.templates ?? []);

    const separatorOptions = computed(() => [
      { value: "-", label: t("NamingConstraint.separatorDashOption") },
      { value: ".", label: t("NamingConstraint.separatorDotOption") },
      { value: "_", label: t("NamingConstraint.separatorUnderscoreOption") },
    ]);

    const name = ref("");
    const strict = ref(false);
    const separator = ref("_");
    const parts = ref([]);
    const hasInvalidName = ref(false);

    watch(
      () => localState.constraint,
      (constraint) => {
        if (constraint) {
          name.value = constraint.name ?? "";
          strict.value = !!constraint.strict;
          const rule = constraint.rule
            ? JSON.parse(JSON.stringify(constraint.rule))
            : { separator: "_", parts: [] };
          separator.value = rule.separator ?? "_";
          parts.value = rule.parts ?? [];
        } else {
          name.value = "";
          strict.value = false;
          separator.value = "_";
          parts.value = [];
        }
        hasInvalidName.value = false;
      },
      { immediate: true },
    );

    const rule = computed(() => ({
      separator: separator.value,
      parts: parts.value,
    }));

    const example = computed(() => buildExample(rule.value));

    const hasEmptyRule = computed(() => !parts.value || parts.value.length === 0);

    const hasInvalidBounds = computed(() =>
      (parts.value ?? []).some(
        (part) =>
          part.type === "bounded" &&
          part.min_value != null &&
          part.max_value != null &&
          part.max_value < part.min_value,
      ),
    );

    const cancel = () => {
      localState.constraint = null;
      localState.currentView = "list";
    };

    const submit = debounce(async () => {
      hasInvalidName.value = !name.value;
      if (hasInvalidName.value || hasEmptyRule.value || hasInvalidBounds.value) {
        return;
      }
      const payload = {
        name: name.value,
        strict: strict.value,
        rule: rule.value,
      };
      try {
        localState.loading = true;
        if (isUpdate.value) {
          const updated = await updateNamingConstraint(
            localState.project,
            localState.constraint,
            payload,
          );
          localState.constraints = localState.constraints.map((item) =>
            item.id === updated.id ? updated : item,
          );
          const conflicts = updated?.conflicting_documents ?? [];
          if (conflicts.length > 0) {
            openModal({
              component: NamingConflictModal,
              props: {
                project: localState.project,
                documents: conflicts,
                allFolders: allFolders.value,
                rule: updated,
                onClose: closeModal,
                onConfirm: () => {
                  closeModal();
                  cancel();
                },
              },
            });
            return;
          }
        } else {
          const constraint = await createNamingConstraint(localState.project, payload);
          localState.constraints = [...localState.constraints, constraint];
        }
        cancel();
      } catch (error) {
        if (error instanceof NamingConstraintConflictError) {
          openModal({
            component: NamingConflictModal,
            props: {
              project: localState.project,
              documents: error.documents ?? [],
              allFolders: allFolders.value,
              rule: {
                name: payload.name,
                rule: payload.rule,
                strict: payload.strict,
              },
              onClose: closeModal,
              onConfirm: () => {
                closeModal();
                submit();
              },
            },
          });
        } else {
          throw error;
        }
      } finally {
        localState.loading = false;
      }
    }, 500);

    const onCreateTemplate = async ({ name, elements }) => {
      try {
        localState.loading = true;

        const template = await createNamingPartsTemplate(localState.project, {
          name,
          elements,
        });

        localState.templates = [...localState.templates, template];
      } finally {
        localState.loading = false;
      }
    };

    return {
      // References
      localState,
      isUpdate,
      templates,
      separatorOptions,
      name,
      strict,
      separator,
      parts,
      hasInvalidName,
      hasEmptyRule,
      hasInvalidBounds,
      example,
      // Methods
      cancel,
      submit,
      onCreateTemplate,
    };
  },
};
</script>

<style scoped src="./NamingConstraintForm.css"></style>
