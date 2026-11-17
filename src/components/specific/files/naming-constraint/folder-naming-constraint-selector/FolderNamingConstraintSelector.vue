<template>
  <div class="folder-naming-constraint-selector">
    <div class="folder-naming-constraint-selector__head">
      <span class="folder-naming-constraint-selector__head__title">
        {{ $t("FolderNamingConstraint.ruleSectionTitle") }}
        <strong>{{ localState.folder.name }}</strong>
      </span>
    </div>

    <div
      v-if="constraints.length > 0"
      class="flex items-center justify-between folder-naming-constraint-selector__head__actions"
    >
      <BIMDataSearch
        class="folder-naming-constraint-selector__search"
        width="60%"
        height="32px"
        radius
        clear
        color="primary"
        :placeholder="$t('NamingConstraint.searchPlaceholder')"
        v-model="searchText"
      />
      <BIMDataButton color="primary" fill radius @click="create">
        <BIMDataIconAddGavel size="xs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.addRuleButton") }}
      </BIMDataButton>
    </div>

    <div v-if="constraints.length === 0" class="folder-naming-constraint-selector__empty">
      <BIMDataIllustration
        name="emptyNamingConvention"
        :x="90"
        :y="90"
        :customWidth="130"
        :customHeight="130"
      />
      <span class="folder-naming-constraint-selector__empty__title">
        {{ $t("NamingConstraint.rulesEmptyTitle") }}
      </span>
      <span class="folder-naming-constraint-selector__empty__text">
        {{ $t("NamingConstraint.rulesEmptyPrerequisitesText") }}
      </span>
      <span class="folder-naming-constraint-selector__empty__text">
        {{ $t("NamingConstraint.rulesEmptyText") }}
      </span>
      <BIMDataButton color="primary" fill radius @click="create">
        <BIMDataIconRules size="xs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.addRuleButton") }}
      </BIMDataButton>
    </div>

    <template v-else>
      <ul class="folder-naming-constraint-selector__items">
        <li
          class="folder-naming-constraint-selector__item folder-naming-constraint-selector__item--none"
          :class="{
            'folder-naming-constraint-selector__item--selected': selectedId === NONE_OPTION_ID,
          }"
          @click="select(NONE_OPTION_ID)"
        >
          <BIMDataRadio
            :modelValue="selectedId"
            :value="NONE_OPTION_ID"
            @update:modelValue="select(NONE_OPTION_ID)"
          />
          <div class="folder-naming-constraint-selector__item__main">
            <div class="folder-naming-constraint-selector__item__name flex items-center">
              <span>{{ $t("NamingConstraint.noDirectRuleOption") }}</span>
            </div>
          </div>
        </li>
        <li
          v-for="constraint in filteredConstraints"
          :key="constraint.id"
          class="folder-naming-constraint-selector__item"
          :class="{
            'folder-naming-constraint-selector__item--selected': selectedId === constraint.id,
          }"
          @click="select(constraint.id)"
        >
          <BIMDataRadio
            :modelValue="selectedId"
            :value="constraint.id"
            @update:modelValue="select(constraint.id)"
          />
          <div class="folder-naming-constraint-selector__item__main">
            <div class="flex items-center justify-between">
              <div class="folder-naming-constraint-selector__item__name flex items-center">
                <BIMDataIconNamingConvention size="xs" fill color="granite" margin="0 6px 0 0" />
                <BIMDataTextbox :text="constraint.name" width="80%" />
              </div>
              <div class="flex items-center">
                <span
                  v-if="constraint.strict"
                  class="folder-naming-constraint-selector__item__chip folder-naming-constraint-selector__item__chip--strict"
                >
                  {{ $t("NamingConstraint.strictBadge") }}
                </span>
                <BIMDataButton ghost rounded icon @click.stop="edit(constraint)">
                  <BIMDataIconEdit size="xxs" />
                </BIMDataButton>
              </div>
            </div>
            <div class="folder-naming-constraint-selector__item__badges">
              <div class="folder-naming-constraint-selector__item__preview">
                <NamingConstraintPreview :rule="constraint" />
              </div>
            </div>
          </div>
        </li>
      </ul>

      <div
        v-if="inheritedRule || showInheritedRuleWarning"
        class="folder-naming-constraint-selector__inheritance-info flex flex-col"
      >
        <strong class="flex items-center">
          <BIMDataIconInformation size="xxs" fill color="primary" margin="0 6px 0 0" />
          {{ $t("NamingConstraint.inheritedRuleTitle") }}
        </strong>
        <p>
          {{
            $t("NamingConstraint.inheritedRuleDescription", {
              rule: inheritedRule.name,
              folder: inheritedRule.folderName,
            })
          }}
        </p>
      </div>

      <div class="folder-naming-constraint-selector__footer">
        <BIMDataCheckbox v-model="recursive" :text="$t('NamingConstraint.recursiveLabel')" />
        <span class="folder-naming-constraint-selector__footer__help">
          {{ $t("NamingConstraint.recursiveHelp") }}
        </span>
        <BIMDataButton
          class="folder-naming-constraint-selector__footer__save"
          color="primary"
          fill
          radius
          width="100%"
          :disabled="!selectedId || localState.loading"
          @click="apply"
        >
          <BIMDataIconRules size="xs" margin="0 6px 0 0" />
          {{ $t("NamingConstraint.saveRuleButton") }}
        </BIMDataButton>
      </div>
    </template>
  </div>
</template>

<script>
import { computed, inject, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import { NONE_OPTION_ID } from "../../../../../config/naming-constraints.js";
import { NamingConstraintConflictError } from "../../../../../services/NamingConstraintService.js";
import { useFiles } from "../../../../../state/files.js";
import { useNamingConstraints } from "../../../../../state/naming-constraints.js";
import { isFolder } from "../../../../../utils/file-structure.js";
import { collectDescendants } from "../../../../../utils/file-tree.js";

import { useAppModal } from "../../../app/app-modal/app-modal.js";
import { useAppNotification } from "../../../app/app-notification/app-notification.js";
import { useAppSidePanel } from "../../../app/app-side-panel/app-side-panel.js";

import NamingConflictModal from "../NamingConflictModal.vue";
import NamingConstraintPreview from "../naming-constraint-preview/NamingConstraintPreview.vue";

export default {
  components: {
    NamingConstraintPreview,
  },

  setup() {
    const { t } = useI18n();

    const { setFolderNamingConstraint, deleteFolderNamingConstraint, fetchFolderNamingConstraint } =
      useNamingConstraints();

    const { projectFileStructure } = useFiles();
    const { openModal, closeModal } = useAppModal();
    const { pushNotification } = useAppNotification();
    const { closeSidePanel } = useAppSidePanel();

    const localState = inject("localState");
    const refreshFiles = inject("refreshFiles");

    const searchText = ref("");
    const inheritedRule = ref(null);

    const allFolders = computed(() =>
      projectFileStructure.value ? collectDescendants(projectFileStructure.value, isFolder) : [],
    );

    const constraints = computed(() => localState.constraints ?? []);

    const filteredConstraints = computed(() => {
      const search = searchText.value.trim().toLowerCase();

      if (!search) {
        return constraints.value;
      }

      return constraints.value.filter((constraint) =>
        (constraint.name ?? "").toLowerCase().includes(search),
      );
    });

    const selectedId = computed(() => localState.selectedConstraintId);

    const recursive = computed({
      get: () => localState.recursive,
      set: (value) => {
        localState.recursive = value;
      },
    });

    /**
     * Finds the closest ancestor with a directly applied recursive rule.
     * The current folder's own rule is deliberately excluded.
     */
    const findInheritedRecursiveRule = async () => {
      inheritedRule.value = null;

      let parentId = localState.folder.parent_id;

      while (parentId) {
        const parent = allFolders.value.find((folder) => folder.id === parentId);

        if (!parent) {
          break;
        }

        const folderConstraint = await fetchFolderNamingConstraint(localState.project, parent);

        // Only a rule directly applied to this ancestor can be inherited.
        if (folderConstraint?.recursive && folderConstraint.applied_on_folder_id === parent.id) {
          inheritedRule.value = {
            name: folderConstraint.constraint.name,
            folderName: parent.name,
          };

          return;
        }

        parentId = parent.parent_id;
      }
    };

    const showInheritedRuleWarning = computed(
      () => selectedId.value === NONE_OPTION_ID && inheritedRule.value !== null,
    );

    const loadInheritedRule = async () => {
      await findInheritedRecursiveRule();
    };

    onMounted(loadInheritedRule);

    const select = async (id) => {
      localState.selectedConstraintId = id;

      if (id === NONE_OPTION_ID) {
        await findInheritedRecursiveRule();
        return;
      }

      inheritedRule.value = null;
    };

    const create = () => {
      localState.ruleDraft = null;
      localState.constraint = null;
      localState.currentView = "constraint-form";
    };

    const edit = (constraint) => {
      localState.ruleDraft = null;
      localState.constraint = constraint;
      localState.currentView = "constraint-form";
    };

    const notifySuccess = (title, message) => {
      pushNotification({
        type: "success",
        title,
        message,
      });
    };

    const notifyError = (title) => {
      pushNotification({
        type: "error",
        title,
        message: "",
      });
    };

    const openConflictModal = ({ documents, rule, onConfirm }) => {
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

    const removeDirectRule = async () => {
      // Nothing has changed if the folder already has no direct rule.
      if (localState.initialConstraintId === NONE_OPTION_ID) {
        await refreshFiles?.();
        closeSidePanel();
        return;
      }

      const conflicts = await deleteFolderNamingConstraint(localState.project, localState.folder);

      // The API handles inheritance after removing the direct rule.
      localState.initialConstraintId = NONE_OPTION_ID;
      localState.selectedConstraintId = NONE_OPTION_ID;
      localState.recursive = false;

      await refreshFiles?.();

      if (conflicts.length > 0) {
        openConflictModal({
          documents: conflicts,
          rule: null,
          onConfirm: async () => {
            await refreshFiles?.();
            closeModal();
            closeSidePanel();
          },
        });

        return;
      }

      notifySuccess(
        t("NamingConstraint.removeRuleSuccessTitle"),
        t("NamingConstraint.removeRuleSuccessMessage"),
      );

      closeSidePanel();
    };

    const applyDirectRule = async (constraintId) => {
      const result = await setFolderNamingConstraint(localState.project, localState.folder, {
        constraint_id: constraintId,
        recursive: localState.recursive,
      });

      const conflicts = result?.conflicting_documents ?? [];
      const rule = constraints.value.find((constraint) => constraint.id === constraintId);

      if (conflicts.length > 0) {
        openConflictModal({
          documents: conflicts,
          rule,
          onConfirm: async () => {
            await refreshFiles?.();

            notifySuccess(
              t("NamingConstraint.applyRuleWithConflictsSuccessTitle"),
              t("NamingConstraint.applyRuleWithConflictsSuccessMessage", {
                folder: localState.folder.name,
              }),
            );

            closeModal();
            closeSidePanel();
          },
        });

        return;
      }

      notifySuccess(
        t("NamingConstraint.applyRuleSuccessTitle"),
        t("NamingConstraint.applyRuleSuccessMessage", {
          folder: localState.folder.name,
        }),
      );

      await refreshFiles?.();
      closeSidePanel();
    };

    const apply = async () => {
      const constraintId = localState.selectedConstraintId;

      if (!constraintId || localState.loading) {
        return;
      }

      localState.loading = true;

      try {
        if (constraintId === NONE_OPTION_ID) {
          await removeDirectRule();
          return;
        }

        await applyDirectRule(constraintId);
      } catch (error) {
        if (error instanceof NamingConstraintConflictError) {
          const rule = constraints.value.find((constraint) => constraint.id === constraintId);

          openConflictModal({
            documents: error.documents ?? [],
            rule,
            onConfirm: async () => {
              await refreshFiles?.();
              closeModal();
              await apply();
            },
          });

          return;
        }

        const isRemovingRule = constraintId === NONE_OPTION_ID;

        notifyError(
          t(
            isRemovingRule ? "NamingConstraint.removeRuleError" : "NamingConstraint.applyRuleError",
          ),
        );
      } finally {
        localState.loading = false;
      }
    };

    return {
      // State
      inheritedRule,
      showInheritedRuleWarning,
      localState,
      constraints,
      filteredConstraints,
      selectedId,
      recursive,
      searchText,
      NONE_OPTION_ID,

      // Actions
      select,
      create,
      edit,
      apply,
    };
  },
};
</script>

<style scoped src="./FolderNamingConstraintSelector.css"></style>
