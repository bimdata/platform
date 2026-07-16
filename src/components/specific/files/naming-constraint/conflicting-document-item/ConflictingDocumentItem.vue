<template>
  <details class="conflicting-document-item" :open="opened">
    <summary class="conflicting-document-item__summary" @click.prevent="$emit('toggle')">
      <div class="summary__row flex items-center">
        <div class="summary__column">
          <span class="summary__label"> Nom actuel </span>

          <div class="summary__value">
            <BIMDataFileIcon :fileName="doc.name" :size="12" />

            <span>{{ doc.name }}</span>
          </div>
        </div>
        <div class="summary__column">
          <span class="summary__label"> Nouveau nom </span>

          <div class="summary__value">
            {{ currentName }}
          </div>
        </div>
        <div class="summary__actions flex items-center">
          <div class="summary__column">
            <span class="summary__label"> Statut </span>

            <span
              class="summary__status"
              :class="{
                'summary__status--valid': valid,
                'summary__status--invalid': !valid,
              }"
            >
              {{ deleted ? "Supprimé" : valid ? "Conforme" : "Non conforme" }}
            </span>
          </div>
          <BIMDataIconChevron class="summary__chevron" :rotate="opened ? 90 : 0" size="xxs" />
        </div>
      </div>
    </summary>

    <div class="conflicting-document-item__content">
      <div class="conflicting-document-item__info">
        <FilePathCell :file="doc" :allFolders="allFolders" />

        <div v-if="!rule && doc.namingRule" class="conflicting-document-item__example">
          Format attendu :
          <strong>
            {{ buildExample(doc.namingRule) }}
          </strong>
        </div>
      </div>

      <div class="conflicting-document-item__rename">
        <BIMDataInput
          v-model="draftName"
          margin="0"
          :placeholder="$t('NamingConstraint.renameFilePlaceholder')"
          @keyup.enter="confirmRename"
          width="100%"
        />

        <BIMDataButton color="primary" fill @click="confirmRename"> Renommer </BIMDataButton>
      </div>

      <div class="conflicting-document-item__actions">
        <BIMDataButton v-if="!deleted" ghost color="high" @click="$emit('delete')">
          <BIMDataIconDelete size="xs" margin="0 6px 0 0" />
          Supprimer le fichier
        </BIMDataButton>

        <BIMDataButton v-else ghost @click="$emit('delete')">
          <BIMDataIconClose size="xxs" margin="0 6px 0 0" />
          Restaurer
        </BIMDataButton>
      </div>
    </div>
  </details>
</template>

<script>
import { ref, watch } from "vue";
import { buildExample } from "../../../../../utils/naming-constraint";
import FilePathCell from "../../files-table/file-path-cell/FilePathCell.vue";

export default {
  components: {
    FilePathCell,
  },

  props: {
    doc: {
      type: Object,
      required: true,
    },
    rule: Object,
    allFolders: Array,

    opened: Boolean,

    currentName: String,

    valid: Boolean,

    deleted: Boolean,
  },

  emits: ["toggle", "rename", "delete"],

  setup(props, { emit }) {
    const draftName = ref(props.currentName);

    watch(
      () => props.currentName,
      (value) => {
        draftName.value = value;
      },
    );

    const confirmRename = () => {
      const value = draftName.value.trim();

      if (!value) return;

      emit("rename", value);
    };

    return {
      draftName,
      confirmRename,
      buildExample,
    };
  },
};
</script>

<style scoped src="./ConflictingDocumentItem.css"></style>
