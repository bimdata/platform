<template>
  <ul class="conflicting-documents-list">
    <li v-for="doc in documents" :key="doc.id" class="conflicting-documents-list__item">
      <ConflictingDocumentItem
        :doc="doc"
        :rule="rule"
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
</template>

<script>
import { computed, reactive, ref } from "vue";
import { matchName } from "../../../../../utils/naming-constraint.js";
import ConflictingDocumentItem from "../conflicting-document-item/ConflictingDocumentItem.vue";

export default {
  components: {
    ConflictingDocumentItem,
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
  },

  emits: ["valid-change", "change"],

  setup(props, { emit }) {
    const openedId = ref(props.documents[0]?.id ?? null);

    const names = reactive(Object.fromEntries(props.documents.map((doc) => [doc.id, doc.name])));

    const toDelete = reactive({});

    const effectiveRule = (doc) => props.rule ?? doc.namingRule ?? null;

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

    return {
      openedId,
      names,
      toDelete,
      toggleOpen,
      renameDocument,
      toggleDelete,
      isValid,
    };
  },
};
</script>

<style scoped src="./ConflictingDocumentsList.css"></style>
