<template>
  <ul class="conflicting-documents-list">
    <li
      v-for="doc in documents"
      :key="doc.id"
      class="conflicting-documents-list__item"
      :class="{
        'conflicting-documents-list__item--invalid': !toDelete[doc.id] && !isValid(doc),
        'conflicting-documents-list__item--editing': editingId === doc.id,
        'conflicting-documents-list__item--deleted': toDelete[doc.id],
      }"
    >
      <BIMDataFileIcon :fileName="doc.name" :size="20" />
      <template v-if="editingId === doc.id">
        <BIMDataInput
          ref="nameInput"
          class="conflicting-documents-list__item__input"
          v-model="draftName"
          :placeholder="$t('NamingConstraint.renameFilePlaceholder')"
          margin="0"
          @keyup.enter.stop="confirmRename(doc)"
          @keyup.esc.stop="cancelRename"
        />
        <BIMDataButton ghost rounded icon @click="confirmRename(doc)">
          <BIMDataIconValidate size="xs" />
        </BIMDataButton>
        <BIMDataButton ghost rounded icon @click="cancelRename">
          <BIMDataIconClose size="xxs" />
        </BIMDataButton>
      </template>
      <template v-else>
        <div class="conflicting-documents-list__item__info">
          <span class="conflicting-documents-list__item__name">
            {{ names[doc.id] ?? doc.name }}
          </span>
          <FilePathCell
            class="conflicting-documents-list__item__path"
            :file="doc"
            :allFolders="allFolders"
          />
          <span
            v-if="!rule && effectiveRule(doc)"
            class="conflicting-documents-list__item__example"
          >
            {{ buildExample(effectiveRule(doc)) }}
          </span>
        </div>
        <BIMDataIconValidate
          v-if="!toDelete[doc.id] && isValid(doc)"
          size="xs"
          fill
          color="success"
        />
        <template v-if="!toDelete[doc.id]">
          <BIMDataButton ghost rounded icon @click="startRename(doc)">
            <BIMDataIconEdit size="xs" />
          </BIMDataButton>
          <BIMDataButton ghost rounded icon @click="toggleDelete(doc)">
            <BIMDataIconDelete size="xs" color="high" />
          </BIMDataButton>
        </template>
        <BIMDataButton v-else ghost rounded icon @click="toggleDelete(doc)">
          <BIMDataIconClose size="xxs" />
        </BIMDataButton>
      </template>
    </li>
  </ul>
</template>

<script>
import { computed, nextTick, reactive, ref } from "vue";
import { buildExample, matchName } from "../../../../../utils/naming-constraint.js";
import FilePathCell from "../../files-table/file-path-cell/FilePathCell.vue";

export default {
  components: {
    FilePathCell,
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
    const editingId = ref(null);
    const draftName = ref("");
    const nameInput = ref(null);
    const names = reactive(Object.fromEntries(props.documents.map((doc) => [doc.id, doc.name])));
    const toDelete = reactive({});

    const isValid = (doc) => matchName(names[doc.id] ?? doc.name, props.rule ?? doc.namingRule);

    const effectiveRule = (doc) => props.rule ?? doc.namingRule ?? null;

    const allValid = computed(() =>
      props.documents.every((doc) => toDelete[doc.id] || isValid(doc)),
    );

    const emitChange = () => {
      const renamed = props.documents
        .filter((doc) => !toDelete[doc.id] && names[doc.id] !== doc.name)
        .map((doc) => ({ ...doc, name: names[doc.id] }));
      const deleted = props.documents.filter((doc) => toDelete[doc.id]);
      emit("change", { renamed, deleted });
      emit("valid-change", allValid.value);
    };

    const startRename = (doc) => {
      editingId.value = doc.id;
      draftName.value = names[doc.id] ?? doc.name;
      nextTick(() => nameInput.value?.[0]?.focus?.());
    };

    const cancelRename = () => {
      editingId.value = null;
      draftName.value = "";
    };

    const confirmRename = (doc) => {
      const name = draftName.value.trim();
      if (name) {
        names[doc.id] = name;
      }
      cancelRename();
      emitChange();
    };

    const toggleDelete = (doc) => {
      toDelete[doc.id] = !toDelete[doc.id];
      emitChange();
    };

    return {
      editingId,
      draftName,
      nameInput,
      names,
      toDelete,
      isValid,
      startRename,
      cancelRename,
      confirmRename,
      toggleDelete,
      buildExample,
      effectiveRule,
    };
  },
};
</script>

<style scoped src="./ConflictingDocumentsList.scss"></style>
