<template>
  <div class="conflicting-documents-list">
    <div
      v-for="group in groupedDocuments"
      :key="group.key"
      :class="
        showRulesByGroup
          ? 'conflicting-documents-list__group'
          : 'conflicting-documents-list__ungrouped'
      "
    >
      <div v-if="showRulesByGroup" class="conflicting-documents-list__group__header">
        <span class="conflicting-documents-list__group__label">
          {{ $t("NamingConstraint.modal.expectedConventionLabel") }}
        </span>

        <NamingConstraintPreview v-if="group.rule" :rule="group.rule" />
      </div>

      <ul>
        <li v-for="doc in group.documents" :key="doc.id" class="conflicting-documents-list__item">
          <ConflictingDocumentItem
            :doc="doc"
            :rule="effectiveRule(doc)"
            :all-folders="allFolders"
            :opened="openedId === doc.id"
            :current-name="names[doc.id]"
            :deleted="!!toDelete[doc.id]"
            :valid="isValid(doc)"
            @toggle="toggleOpen(doc.id)"
            @rename="renameDocument(doc, $event)"
            @delete="toggleDelete(doc)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from "vue";
import { matchName } from "../../../../../utils/naming-constraint.js";
import ConflictingDocumentItem from "../conflicting-document-item/ConflictingDocumentItem.vue";
import NamingConstraintPreview from "../naming-constraint-preview/NamingConstraintPreview.vue";

export default {
  components: {
    ConflictingDocumentItem,
    NamingConstraintPreview,
  },

  props: {
    project: {
      type: Object,
      required: true,
    },
    documents: {
      type: Array,
      required: true,
    },
    allFolders: {
      type: Array,
      default: () => [],
    },
    rule: {
      type: Object,
      default: null,
    },
    showRulesByGroup: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["valid-change", "change"],

  setup(props, { emit }) {
    const openedId = ref(props.documents[0]?.id ?? null);

    const names = reactive(Object.fromEntries(props.documents.map((doc) => [doc.id, doc.name])));

    const toDelete = reactive({});

    const effectiveRule = (doc) => doc.namingRule ?? props.rule ?? null;

    const isValid = (doc) => {
      return matchName(names[doc.id], effectiveRule(doc));
    };

    const allValid = computed(() =>
      props.documents.every((doc) => toDelete[doc.id] || isValid(doc)),
    );

    const emitChange = () => {
      const renamed = props.documents
        .filter((doc) => !toDelete[doc.id] && names[doc.id] !== doc.name)
        .map((doc) => ({
          ...doc,
          name: names[doc.id],
        }));

      const deleted = props.documents.filter((doc) => toDelete[doc.id]);

      emit("change", {
        renamed,
        deleted,
      });

      emit("valid-change", allValid.value);
    };

    const toggleOpen = (id) => {
      openedId.value = openedId.value === id ? null : id;
    };

    const renameDocument = (doc, newName) => {
      names[doc.id] = newName;
      emitChange();
    };

    const toggleDelete = (doc) => {
      toDelete[doc.id] = !toDelete[doc.id];
      emitChange();
    };

    const getRuleKey = (rule) => {
      if (!rule) return "no-rule";

      return JSON.stringify(rule);
    };

    const groupedDocuments = computed(() => {
      const groups = new Map();

      props.documents.forEach((doc) => {
        const rule = effectiveRule(doc);
        const key = getRuleKey(rule);

        if (!groups.has(key)) {
          groups.set(key, {
            key,
            rule,
            documents: [],
          });
        }

        groups.get(key).documents.push(doc);
      });

      return Array.from(groups.values());
    });

    return {
      openedId,
      names,
      toDelete,
      groupedDocuments,
      effectiveRule,
      toggleOpen,
      renameDocument,
      toggleDelete,
      isValid,
    };
  },
};
</script>

<style scoped src="./ConflictingDocumentsList.css"></style>
