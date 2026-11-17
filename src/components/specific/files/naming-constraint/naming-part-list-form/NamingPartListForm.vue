<template>
  <div class="naming-part-list-form__container flex flex-col justify-between">
    <div class="naming-part-list-form flex flex-col items-center justify-between">
      <div class="naming-part-list-form__header">
        <BIMDataIllustration
          name="createList"
          :x="115"
          :y="115"
          :customWidth="110"
          :customHeight="110"
        />
        <span class="naming-part-list-form__header__title">
          {{ $t(`NamingConstraint.${isUpdate ? "updateListTitle" : "createListTitle"}`) }}
        </span>
      </div>

      <section class="naming-part-list-form__step">
        <div class="naming-part-list-form__step__head">
          <span class="naming-part-list-form__step__num">1</span>
          <span class="naming-part-list-form__step__label">
            {{ $t("NamingConstraint.listNameStep") }}
          </span>
        </div>
        <BIMDataInput
          width="100%"
          margin="0"
          :placeholder="$t('NamingConstraint.listNamePlaceholder')"
          :error="hasInvalidName"
          :errorMessage="$t('t.invalidName')"
          v-model="name"
        />
      </section>

      <section class="naming-part-list-form__step">
        <div class="naming-part-list-form__step__head">
          <span class="naming-part-list-form__step__num">2</span>
          <span class="naming-part-list-form__step__label">
            {{ $t("NamingConstraint.addElementsStep") }}
          </span>
        </div>

        <span class="naming-part-list-form__element__label">
          {{ $t("NamingConstraint.addOneElementLabel") }}
        </span>
        <div
          v-for="(element, index) in elements"
          :key="index"
          class="naming-part-list-form__element"
        >
          <BIMDataInput
            :ref="
              (el) => {
                if (index === elements.length - 1) {
                  lastInput = el;
                }
              }
            "
            width="100%"
            margin="0"
            :placeholder="$t('NamingConstraint.elementNamePlaceholder')"
            :modelValue="element"
            @update:modelValue="(value) => updateElement(index, value)"
            @keyup.enter="index === elements.length - 1 && addElement()"
          />
          <BIMDataButton
            color="high"
            outline
            radius
            :disabled="elements.length === 0 || !element"
            @click="removeElement(index)"
          >
            {{ $t("NamingConstraint.removeElementButton") }}
          </BIMDataButton>
        </div>

        <div v-if="hasInvalidElements" class="naming-part-list-form__error">
          {{ $t("NamingConstraint.emptyElementsError") }}
        </div>

        <BIMDataButton
          class="naming-part-list-form__add"
          color="primary"
          fill
          radius
          width="100%"
          :disabled="!elements[elements.length - 1]"
          @click="addElement"
        >
          <BIMDataIconPlus size="xxxs" margin="0 6px 0 0" />
          {{ $t("NamingConstraint.addElementButton") }}
        </BIMDataButton>

        <div class="naming-part-list-form__bulk-import m-t-12">
          <div
            class="naming-part-list-form__bulk-import__toggle flex items-center justify-between"
            @click="toggleBulkImport"
          >
            <span>{{ $t("NamingConstraint.bulkImportLabel") }}</span>

            <BIMDataIconChevron size="xxxs" :rotate="bulkImportOpen ? 90 : 0" />
          </div>

          <transition name="fade-slide">
            <div v-if="bulkImportOpen" class="naming-part-list-form__bulk-import__content">
              <BIMDataTextarea
                v-model="bulkElements"
                :placeholder="$t('NamingConstraint.bulkImportPlaceholder')"
                width="100%"
              />

              <span class="naming-part-list-form__bulk-import__hint">
                {{ $t("NamingConstraint.bulkImportHint") }}
              </span>

              <div class="flex gap-12 m-t-12">
                <BIMDataButton color="primary" fill radius width="50%" @click="importElements">
                  {{ $t("NamingConstraint.importButton") }}
                </BIMDataButton>

                <BIMDataButton
                  ghost
                  radius
                  width="50%"
                  :disabled="!bulkElements"
                  @click="bulkElements = ''"
                >
                  {{ $t("t.clear") }}
                </BIMDataButton>
              </div>
            </div>
          </transition>
        </div>
      </section>
    </div>

    <div class="naming-part-list-form__actions">
      <BIMDataButton ghost radius @click="cancel">
        {{ $t("t.cancel") }}
      </BIMDataButton>
      <BIMDataButton color="primary" fill radius :disabled="localState.loading" @click="submit">
        <BIMDataIconList size="xs" margin="0 6px 0 0" />
        {{ $t("NamingConstraint.saveListButton") }}
      </BIMDataButton>
    </div>
  </div>
</template>

<script>
import { computed, inject, ref, watch, nextTick } from "vue";
import { useFiles } from "../../../../../state/files.js";
import { useNamingConstraints } from "../../../../../state/naming-constraints.js";
import { debounce } from "../../../../../utils/async.js";
import { isFolder } from "../../../../../utils/file-structure.js";
import { collectDescendants } from "../../../../../utils/file-tree.js";

import { useAppModal } from "../../../app/app-modal/app-modal.js";
import NamingConflictModal from "../NamingConflictModal.vue";

export default {
  setup() {
    const {
      createNamingPartList,
      updateNamingPartList,
      loadNamingConstraints,
      getEffectiveFolderRule,
    } = useNamingConstraints();
    const { projectFileStructure } = useFiles();
    const { openModal, closeModal } = useAppModal();

    const localState = inject("localState");
    const refreshFiles = inject("refreshFiles", null);

    const isUpdate = computed(() => !!localState.partList);

    const name = ref("");
    const elements = ref([""]);
    const hasInvalidName = ref(false);
    const hasInvalidElements = ref(false);
    const bulkElements = ref("");
    const bulkImportOpen = ref(false);
    const toggleBulkImport = () => {
      bulkImportOpen.value = !bulkImportOpen.value;
    };

    const lastInput = ref(null);

    watch(
      () => localState.partList,
      (partList) => {
        name.value = partList?.name ?? "";
        const values = partList?.elements ?? [];
        elements.value = values.length > 0 ? [...values] : [""];
        hasInvalidName.value = false;
        hasInvalidElements.value = false;
      },
      { immediate: true },
    );

    const cleanElements = () => elements.value.map((element) => element.trim()).filter(Boolean);

    const updateElement = (index, value) => {
      elements.value.splice(index, 1, value);
    };

    const focusLastInput = async () => {
      await nextTick();
      lastInput.value?.focus();
    };

    const addElement = async () => {
      elements.value.push("");
      await focusLastInput();
    };

    const removeElement = (index) => {
      elements.value.splice(index, 1);
      if (elements.value.length === 0) {
        elements.value.push("");
      }
    };

    const importElements = () => {
      const imported = bulkElements.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      if (!imported.length) {
        return;
      }

      const current = elements.value.map((e) => e.trim()).filter(Boolean);

      const merged = [...new Set([...current, ...imported])];

      elements.value = merged.length ? merged : [""];

      bulkElements.value = "";
    };

    const returnFromPartListForm = () => {
      if (localState.returnTo) {
        const destination = localState.returnTo;

        if (destination.tab) {
          localState.currentTab = destination.tab;
        }

        localState.currentView = destination.view;
        localState.returnTo = null;
        return;
      }

      // Comportement existant du manager général.
      localState.currentTab = "part-lists";
      localState.currentView = "list";
    };

    const cancel = () => {
      if (localState.returnTo) {
        returnFromPartListForm();
        return;
      }

      localState.ruleDraft = null;
      localState.constraint = null;
      localState.pendingPartListPartIndex = null;
      localState.newlyCreatedPartList = null;

      localState.currentView = "list";
    };

    const showConflicts = async (documents) => {
      const allFolders = projectFileStructure.value
        ? collectDescendants(projectFileStructure.value, isFolder)
        : [];
      const documentsWithRule = await Promise.all(
        documents.map(async (doc) => ({
          ...doc,
          namingRule: await getEffectiveFolderRule(localState.project, { id: doc.parent_id }),
        })),
      );

      openModal({
        component: NamingConflictModal,
        props: {
          project: localState.project,
          documents: documentsWithRule,
          allFolders,
          rule: null,
          showRulesByGroup: true,
          onClose: closeModal,
          onConfirm: async () => {
            await refreshFiles?.();
          },
        },
      });
    };

    const submit = debounce(async () => {
      const values = cleanElements();

      hasInvalidName.value = !name.value.trim();
      hasInvalidElements.value = values.length === 0;

      if (hasInvalidName.value || hasInvalidElements.value) {
        return;
      }

      try {
        localState.loading = true;

        const payload = {
          name: name.value.trim(),
          elements: values,
        };

        let partList;

        if (isUpdate.value) {
          partList = await updateNamingPartList(
            localState.project,
            localState.partList,
            payload,
          );

          localState.partLists = localState.partLists.map((item) =>
            item.id === partList.id ? partList : item,
          );
          // Constraints embed the list values in their parts `elements`.
          localState.constraints = await loadNamingConstraints(localState.project);
          await refreshFiles?.();

          if (partList.conflicting_documents?.length) {
            await showConflicts(partList.conflicting_documents);
          }
        } else {
          partList = await createNamingPartList(localState.project, payload);

          localState.partLists = [...localState.partLists, partList];
        }

        // Si la liste a été créée depuis le RuleBuilder,
        // on la transmet au formulaire de règle pour mettre à jour
        // la partie concernée du ruleDraft.
        if (!isUpdate.value && localState.pendingPartListPartIndex !== null) {
          localState.newlyCreatedPartList = partList;
        }

        // Retour vers le formulaire d'origine si une navigation
        // vers le formulaire de liste était en cours.
        if (localState.returnTo) {
          const destination = localState.returnTo;

          if (destination.tab) {
            localState.currentTab = destination.tab;
          }

          localState.currentView = destination.view;
          localState.returnTo = null;
        } else if (localState.managerType === "folder") {
          // Depuis le manager de dossier, revenir à la sélection
          // uniquement si aucun formulaire parent n'attend le retour.
          localState.currentView = "folder-rule";
        } else {
          // Comportement du manager général conservé.
          localState.currentTab = "part-lists";
          localState.currentView = "list";
        }
      } finally {
        localState.loading = false;
      }
    }, 500);

    return {
      // References
      bulkElements,
      bulkImportOpen,
      elements,
      hasInvalidElements,
      hasInvalidName,
      isUpdate,
      lastInput,
      localState,
      name,
      // Methods
      addElement,
      cancel,
      importElements,
      removeElement,
      submit,
      toggleBulkImport,
      updateElement,
    };
  },
};
</script>

<style scoped src="./NamingPartListForm.css"></style>
