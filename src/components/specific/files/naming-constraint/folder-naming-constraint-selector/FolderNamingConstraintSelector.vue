<template>
  <div class="folder-naming-constraint-selector">
    <div class="folder-naming-constraint-selector__head">
      <span class="folder-naming-constraint-selector__head__title">
        {{ $t("FolderNamingConstraint.ruleSectionTitle") }}
        <strong>{{ localState.folder.name }}</strong>
      </span>
      <BIMDataButton color="primary" fill radius @click="create">
        <BIMDataIconRules size="xs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.addRuleButton") }}
      </BIMDataButton>
    </div>

    <BIMDataSearch
      v-if="constraints.length > 0"
      class="folder-naming-constraint-selector__search"
      width="100%"
      height="32px"
      radius
      clear
      color="primary"
      :placeholder="$t('NamingConstraint.searchPlaceholder')"
      v-model="searchText"
    />

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
              <BIMDataIconClose size="xxs" fill color="granite" margin="0 6px 0 0" />
              <span>{{ $t("NamingConstraint.noRuleOption") }}</span>
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
            <div class="folder-naming-constraint-selector__item__name flex items-center">
              <BIMDataIconNamingConvention size="xs" fill color="granite" margin="0 6px 0 0" />
              <BIMDataTextbox :text="constraint.name" width="90%" />
              <!-- <span>
                
              </span> -->
            </div>
            <div class="folder-naming-constraint-selector__item__badges">
              <span class="folder-naming-constraint-selector__item__chip">
                {{ buildExample(constraint.rule) }}
              </span>
              <span
                v-if="constraint.strict"
                class="folder-naming-constraint-selector__item__chip folder-naming-constraint-selector__item__chip--strict"
              >
                {{ $t("NamingConstraint.strictBadge") }}
              </span>
            </div>
          </div>
          <BIMDataButton ghost rounded icon @click.stop="edit(constraint)">
            <BIMDataIconEdit size="xxs" />
          </BIMDataButton>
        </li>
      </ul>

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
import { computed, inject, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  useNamingConstraints,
  NamingConstraintConflictError,
} from "../../../../../state/naming-constraints.js";
import { buildExample } from "../../../../../utils/naming-constraint.js";
import { collectDescendants } from "../../../../../utils/file-tree.js";
import { isFolder } from "../../../../../utils/file-structure.js";
import { useFiles } from "../../../../../state/files.js";
import { useAppModal } from "../../../app/app-modal/app-modal.js";
import { useAppNotification } from "../../../app/app-notification/app-notification.js";
import { useAppSidePanel } from "../../../app/app-side-panel/app-side-panel.js";
import NamingConflictModal from "../NamingConflictModal.vue";
import { BIMDataTextbox } from "@bimdata/design-system";

export default {
  setup() {
    const { t } = useI18n();
    const { setFolderNamingConstraint, deleteFolderNamingConstraint } = useNamingConstraints();
    const { projectFileStructure } = useFiles();
    const { openModal, closeModal } = useAppModal();
    const { pushNotification } = useAppNotification();
    const { closeSidePanel } = useAppSidePanel();

    const localState = inject("localState");
    const searchText = ref("");
    const NONE_OPTION_ID = "__none__";

    const allFolders = computed(() =>
      projectFileStructure.value ? collectDescendants(projectFileStructure.value, isFolder) : [],
    );

    const constraints = computed(() => localState.constraints ?? []);

    const filteredConstraints = computed(() => {
      const search = searchText.value.trim().toLowerCase();
      if (!search) return constraints.value;
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

    const select = (id) => {
      localState.selectedConstraintId = id;
    };

    const create = () => {
      localState.constraint = null;
      localState.currentView = "constraint-form";
    };

    const edit = (constraint) => {
      localState.constraint = constraint;
      localState.currentView = "constraint-form";
    };

    const apply = async () => {
      if (!localState.selectedConstraintId) {
        return;
      }

      if (localState.selectedConstraintId === NONE_OPTION_ID) {
        try {
          localState.loading = true;
          const conflicts = await deleteFolderNamingConstraint(
            localState.project,
            localState.folder,
          );
          if (conflicts.length > 0) {
            openModal({
              component: NamingConflictModal,
              props: {
                project: localState.project,
                documents: conflicts,
                allFolders: allFolders.value,
                rule: null, // pas de règle appliquée, potentiellement héritée du parent
                onClose: closeModal,
                onConfirm: () => {
                  closeModal();
                  closeSidePanel();
                },
              },
            });
          } else {
            pushNotification({
              type: "success",
              title: t("NamingConstraint.removeRuleSuccessTitle"),
              message: t("NamingConstraint.removeRuleSuccessMessage"),
            });
            closeSidePanel();
          }
        } catch (error) {
          pushNotification({
            type: "error",
            title: t("NamingConstraint.removeRuleError"),
            message: "",
          });
        } finally {
          localState.loading = false;
        }
        return;
      }

      try {
        localState.loading = true;
        const result = await setFolderNamingConstraint(localState.project, localState.folder, {
          constraint_id: localState.selectedConstraintId,
          recursive: localState.recursive,
        });
        const conflicts = result?.conflicting_documents ?? [];
        if (conflicts.length > 0) {
          const rule = constraints.value.find((c) => c.id === localState.selectedConstraintId);
          openModal({
            component: NamingConflictModal,
            props: {
              project: localState.project,
              documents: conflicts,
              allFolders: allFolders.value,
              rule,
              onClose: closeModal,
              onConfirm: () => {
                closeModal();
                closeSidePanel();
              },
            },
          });
        } else {
          pushNotification({
            type: "success",
            title: t("NamingConstraint.applyRuleSuccessTitle"),
            message: t("NamingConstraint.applyRuleSuccessMessage"),
          });
          closeSidePanel();
        }
      } catch (error) {
        if (error instanceof NamingConstraintConflictError) {
          const rule = constraints.value.find((c) => c.id === localState.selectedConstraintId);
          openModal({
            component: NamingConflictModal,
            props: {
              project: localState.project,
              documents: error.documents ?? [],
              allFolders: allFolders.value,
              rule,
              onClose: closeModal,
              onConfirm: () => {
                closeModal();
                apply();
              },
            },
          });
        } else {
          pushNotification({
            type: "error",
            title: t("NamingConstraint.applyRuleError"),
            message: "",
          });
        }
      } finally {
        localState.loading = false;
      }
    };

    return {
      // References
      localState,
      constraints,
      filteredConstraints,
      selectedId,
      recursive,
      searchText,
      NONE_OPTION_ID,
      // Methods
      buildExample,
      select,
      create,
      edit,
      apply,
    };
  },
};
</script>

<style scoped src="./FolderNamingConstraintSelector.css"></style>
