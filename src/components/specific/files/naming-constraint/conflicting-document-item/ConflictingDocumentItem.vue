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
            {{ generatedName }}
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
      <div class="conflicting-document-item__info m-b-36">
        <div class="file-path flex items-center m-b-12">
          <BIMDataIconFolderLocation fill color="default" margin="0 6px 0 0" />
          Dossier source :
          <span v-if="folderPath.length" class="m-l-6">
            {{ folderPath.map((folder) => folder.name).join(" / ") }}
          </span>
          <span v-else>
            {{ $t("t.rootFolder") }}
          </span>
        </div>
      </div>

      <div class="conflicting-document-item__rename">
        <NamingConstraintFileEditor
          :rule="rule"
          :filename="doc.name"
          @change="updateGeneratedName"
        />
        <!-- <div v-for="part in rule.parts" :key="part.name" class="field">
          <label>{{ part.name }}</label>

          <BIMDataSelect
            v-if="part.type === 'values_in'"
            v-model="values[part.name]"
            :options="part.elements"
          />

          <BIMDataInput
            v-else-if="part.type === 'bounded'"
            v-model="values[part.name]"
            type="number"
          />

          <BIMDataInput v-else v-model="values[part.name]" />
        </div> -->

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
import { ref, reactive, watch, computed } from "vue";
import { buildExample } from "../../../../../utils/naming-constraint";
import { getAscendants } from "../../../../../utils/file-structure.js";

import NamingConstraintFileEditor from "./naming-constraint-file-editor/NamingConstraintFileEditor.vue";

export default {
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

  components: {
    NamingConstraintFileEditor,
  },

  emits: ["toggle", "rename", "delete"],

  setup(props, { emit }) {
    const values = reactive({});
    // const draftName = ref(props.currentName);
    const draftName = ref(props.currentName);
    const generatedName = ref(props.currentName || props.doc.name);

    const updateGeneratedName = (name) => {
      generatedName.value = name;
    };
    const folderPath = computed(() => {
      return getAscendants(props.doc, props.allFolders).reverse();
    });
    const currentName = computed(() => {
      const filename = props.rule.parts
        .map((part) => values[part.name] ?? "")
        .join(props.rule.separator);

      return `${filename}.${extension.value}`;
    });

    watch(
      () => props.currentName,
      (value) => {
        draftName.value = value;
      },
    );

    const confirmRename = () => {
      if (!generatedName.value) return;

      emit("rename", generatedName.value);
    };

    return {
      // draftName,
      folderPath,
      confirmRename,
      buildExample,
      generatedName,
      updateGeneratedName,
    };
  },
};
</script>

<style scoped src="./ConflictingDocumentItem.css"></style>
