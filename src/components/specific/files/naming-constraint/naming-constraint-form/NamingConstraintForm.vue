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
          <BIMDataInput
            width="100%"
            margin="0"
            :placeholder="$t('NamingConstraint.ruleNamePlaceholder')"
            :error="hasInvalidName"
            :errorMessage="$t('t.invalidName')"
            v-model="localState.ruleDraft.name"
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
            :templates="templates"
            @go-to-template="goToTemplate"
          />
          <div v-if="hasEmptyRule" class="naming-constraint-form__error">
            {{ $t("NamingConstraint.emptyParts") }}
          </div>
          <div v-if="hasInvalidBounds" class="naming-constraint-form__error">
            {{ $t("NamingConstraint.invalidBoundsError") }}
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

        <div class="naming-constraint-form__preview" v-if="example">
          <span class="naming-constraint-form__preview__label">
            {{ $t("NamingConstraint.previewLabel") }}
          </span>
          <code class="naming-constraint-form__preview__value">{{ example }}</code>
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

import RuleBuilder from "./RuleBuilder.vue";
import NamingConflictModal from "../NamingConflictModal.vue";

export default {
  components: {
    RuleBuilder,
  },

  setup() {
    const { t } = useI18n();

    const { createNamingConstraint, updateNamingConstraint } = useNamingConstraints();
    const { projectFileStructure } = useFiles();
    const { openModal, closeModal } = useAppModal();

    const localState = inject("localState");

    /** Draft initialization */
    const createEmptyDraft = () => ({
      name: "",
      strict: false,
      separator: "_",
      parts: [],
    });

    if (!localState.ruleDraft) {
      if (localState.constraint) {
        const rule = localState.constraint.rule ?? {};

        localState.ruleDraft = {
          name: localState.constraint.name ?? "",
          strict: !!localState.constraint.strict,
          separator: rule.separator ?? "_",
          parts: JSON.parse(JSON.stringify(rule.parts ?? [])),
        };
      } else {
        localState.ruleDraft = createEmptyDraft();
      }
    }

    /** Computed */
    const isUpdate = computed(() => !!localState.constraint);
    const templates = computed(() => localState.templates ?? []);
    const allFolders = computed(() =>
      projectFileStructure.value ? collectDescendants(projectFileStructure.value, isFolder) : [],
    );
    const example = computed(() => buildExample(localState.ruleDraft));

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
    const hasInvalidName = computed(() => submitted.value && !localState.ruleDraft.name?.trim());
    const hasEmptyRule = computed(() => submitted.value && !localState.ruleDraft?.parts?.length);
    const hasInvalidBounds = computed(() =>
      (localState.ruleDraft?.parts ?? []).some(
        (part) =>
          part.type === "bounded" &&
          part.min_value != null &&
          part.max_value != null &&
          part.max_value < part.min_value,
      ),
    );

    /** Navigation */
    const goToTemplate = (index) => {
      localState.pendingTemplatePartIndex = index;
      localState.previousView = {
        tab: localState.currentTab,
        view: localState.currentView,
      };

      localState.currentTab = "templates";
      localState.currentView = "form";
    };

    /** Watchers
     * Sync the rule when a new template has been created.
     */
    watch(
      () => localState.newlyCreatedTemplate,
      (template) => {
        if (!template) return;

        const index = localState.pendingTemplatePartIndex;

        if (index == null) return;

        localState.ruleDraft.parts[index].elements = [...template.elements];

        localState.newlyCreatedTemplate = null;
        localState.pendingTemplatePartIndex = null;
      },
    );

    /** Actions */
    const cancel = () => {
      localState.ruleDraft = null;
      localState.constraint = null;
      localState.pendingTemplatePartIndex = null;
      localState.newlyCreatedTemplate = null;
      localState.currentView = "list";
      submitted.value = false;
    };

    const submit = debounce(async () => {
      submitted.value = true;
      if (
        hasInvalidName.value ||
        hasInvalidSeparator.value ||
        hasEmptyRule.value ||
        hasInvalidBounds.value
      ) {
        return;
      }

      const payload = {
        name: localState.ruleDraft.name,
        strict: localState.ruleDraft.strict,
        rule: {
          separator: localState.ruleDraft.separator,
          parts: localState.ruleDraft.parts,
        },
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

          if (conflicts.length) {
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
              rule: payload,
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

    return {
      // State
      localState,

      // Computed
      isUpdate,
      templates,
      separatorOptions,
      example,
      hasInvalidName,
      hasEmptyRule,
      hasInvalidBounds,

      // Methods
      cancel,
      submit,
      goToTemplate,
    };
  },
};
</script>

<style scoped src="./NamingConstraintForm.css"></style>
