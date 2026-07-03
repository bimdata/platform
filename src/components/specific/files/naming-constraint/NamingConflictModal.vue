<template>
  <BIMDataSafeZoneModal width="868px">
    <template #title>
      <BIMDataIconLock size="s" margin="0 8px 0 0" />
      {{ $t("NamingConstraint.managerTitle") }}
    </template>
    <template #text>
      <div class="naming-conflict-modal__content">
        <div v-if="rule" class="naming-conflict-modal__rule">
          <span class="naming-conflict-modal__rule__name">{{ rule.name }}</span>
          <span class="naming-conflict-modal__rule__chip">
            {{ buildExample(rule.rule) }}
          </span>
        </div>
        <p class="naming-conflict-modal__intro">
          {{ $t("NamingConstraint.conflictModalIntro") }}
        </p>
        <p class="naming-conflict-modal__warning">
          {{ $t("NamingConstraint.conflictModalWarning") }}
        </p>
        <ConflictingDocumentsList
          :project="project"
          :documents="documents"
          :allFolders="allFolders"
          :rule="rule?.rule"
          @valid-change="allValid = $event"
          @change="pending = $event"
        />
      </div>
    </template>
    <template #actions>
      <BIMDataButton color="high" ghost radius width="120px" @click="close">
        {{ $t("t.cancel") }}
      </BIMDataButton>
      <BIMDataButton
        color="primary"
        fill
        radius
        width="120px"
        :disabled="rule?.strict && !allValid"
        @click="confirm"
      >
        {{ $t("t.confirm") }}
      </BIMDataButton>
    </template>
  </BIMDataSafeZoneModal>
</template>

<script>
import { ref } from "vue";
import { useFiles } from "../../../../state/files.js";
import { buildExample, matchName } from "../../../../utils/naming-constraint.js";
import ConflictingDocumentsList from "./conflicting-documents-list/ConflictingDocumentsList.vue";

export default {
  components: {
    ConflictingDocumentsList,
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
    onClose: {
      type: Function,
      required: true,
    },
    onConfirm: {
      type: Function,
      default: null,
    },
    persistChanges: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const { updateFiles, deleteFiles } = useFiles();

    const allValid = ref(props.documents.every((doc) => matchName(doc.name, props.rule?.rule)));
    const pending = ref({ renamed: [], deleted: [] });

    const close = () => props.onClose();

    const confirm = async () => {
      if (props.persistChanges) {
        if (pending.value.renamed.length) {
          await updateFiles(props.project, pending.value.renamed);
        }
        if (pending.value.deleted.length) {
          await deleteFiles(props.project, pending.value.deleted);
        }
      }
      await props.onConfirm?.(pending.value);
      close();
    };

    return {
      allValid,
      pending,
      buildExample,
      close,
      confirm,
    };
  },
};
</script>

<style scoped src="./NamingConflictModal.css"></style>
