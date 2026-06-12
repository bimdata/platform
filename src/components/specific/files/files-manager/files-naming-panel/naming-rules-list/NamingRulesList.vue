<template>
  <div class="rules-list">
    <!-- Header -->
    <div class="rules-list__header flex items-center justify-between">
      <div class="flex items-center">
        <BIMDataIcon name="NamingConvention" size="xs" margin="0px 6px 0 0" />
        <span>Gestion des conventions de nommage</span>
      </div>
      <BIMDataButton
        color="default"
        ghost
        rounded
        icon
        class="rules-list__close"
        @click="$emit('close')"
      >
        <BIMDataIcon name="close" size="xxs" />
      </BIMDataButton>
    </div>

    <!-- Empty state -->
    <div v-if="!filteredRules.length" class="rules-list__empty flex flex-col items-center m-t-36">
      <h2 class="rules-list__title flex justify-center">Créer des règles</h2>
      <p>Aucune règle de nommage définie</p>
      <BIMDataButton fill radius color="primary" size="s" @click="$emit('create')">
        Créer une première règle
      </BIMDataButton>
    </div>

    <!-- Rule items -->
    <div v-else class="rules-list__content flex flex-col justify-between">
      <div>
        <!-- Toolbar -->
        <div class="rules-list__toolbar">
          <span class="rules-list__title flex justify-center">Liste des règles du projet</span>
          <div class="rules-list__actions flex items-center justify-center m-t-12 m-b-12">
            <BIMDataButton fill radius color="primary" @click="$emit('create')">
              <BIMDataIcon name="plus" size="xxs" margin="0 6px 0 0" />
              ajouter une règle
            </BIMDataButton>
            <BIMDataButton fill radius color="default" @click="$emit('create')">
              <BIMDataIcon name="list" size="xxs" margin="0 6px 0 0" />
              Créer une liste
            </BIMDataButton>
          </div>
        </div>

        <!-- Search -->
        <div class="rules-list__search m-y-6">
          <BIMDataSearch
            v-model="search"
            placeholder="Search"
            color="primary"
            radius
            width="100%"
          />
        </div>
        <div class="rules-list__items m-t-12">
          <div
            v-for="rule in filteredRules"
            :key="rule.id"
            class="rule-item"
            :class="{
              'rule-item--selected': selectedRuleId === rule.id,
              'rule-item--strict': rule.mode === 'strict',
            }"
            @click="selectedRuleId = rule.id"
          >
            <div class="rule-item__header flex items-center justify-between">
              <BIMDataRadio :text="rule.name" :value="rule.id" v-model="selectedRuleId" />
              <div class="flex items-center">
                <span
                  v-if="rule.mode === 'strict'"
                  class="rule-item__badge rule-item__badge--strict"
                >
                  strict
                </span>
                <BIMDataButton
                  rounded
                  icon
                  ghost
                  color="granite"
                  class="rule-item__edit"
                  @click.stop="$emit('edit', rule)"
                  title="Modifier"
                >
                  <BIMDataIcon name="edit" size="xxs" />
                </BIMDataButton>
              </div>
            </div>

            <div class="rule-item__info">
              <UserAvatar
                :user="{
                  firstname: rule.creator_name?.split(' ')[0],
                  lastname: rule.creator_name?.split(' ')[1],
                  profile_picture: rule.creator_picture,
                }"
                size="32"
              />
              <span class="rule-item__creator">{{ rule.creator_email || rule.creator_name }}</span>
              <code class="rule-item__pattern">{{ rule.pattern }}</code>
            </div>
          </div>
        </div>
      </div>

      <!-- Folder assignment (shown when a rule is selected) -->
      <transition name="slide-up">
        <div v-if="localRule" class="rules-list__assign m-t-12">
          <!-- Folder selector -->
          <label class="rules-list__assign-label">Appliquer aux dossiers</label>
          <BIMDataSelect
            v-model="assignedFolderIds"
            :options="folderOptions"
            optionKey="id"
            optionLabelKey="name"
            :multi="true"
            label="Sélectionner des dossiers…"
            class="m-t-6"
          />

          <label class="rules-list__checkbox-label m-t-12">
            <BIMDataCheckbox v-model="localRule.recursive" @change="saveRecursive" />
            <span class="rules-list__recursive-label">Règle récursive</span>
          </label>
          <p class="rules-list__recursive-hint">
            Si vous cochez cette case, cette règle s'appliquera également aux fichiers contenus dans
            les sous-dossiers de votre dossier principal.
          </p>
          <BIMDataButton
            fill
            radius
            color="primary"
            class="rules-list__save-btn"
            @click="saveAssignment"
          >
            <BIMDataIcon name="save" size="xxs" margin="0 6px 0 0" />
            Enregistrer la règle
          </BIMDataButton>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useNamingConventionStore } from "../../../../../../state/naming-convention.js";
import { useFiles } from "../../../../../../state/files.js";
import { collectDescendants } from "../../../../../../utils/file-tree.js";
import { isFolder } from "../../../../../../utils/file-structure.js";

import UserAvatar from "../../../../users/user-avatar/UserAvatar.vue";

const props = defineProps({
  rules: { type: Array, default: () => [] },
  currentFolder: { type: Object, default: null },
  projectPk: { type: [String, Number], required: true },
});

const emit = defineEmits(["close", "create", "edit", "assignment-saved"]);

const store = useNamingConventionStore();

// ─── State ────────────────────────────────────────────────────────────────────

const search = ref("");
const selectedRuleId = ref(null);
const localRule = ref(null);
const { projectFileStructure } = useFiles();

// ─── Watchers ─────────────────────────────────────────────────────────────────
watch(selectedRuleId, (id) => {
  const rule = props.rules.find((r) => r.id === id);
  if (!rule) {
    localRule.value = null;
    return;
  }

  const raw = rule.folder_ids ?? [];

  // Gère : undefined, objet seul, tableau d'objets, tableau d'ids
  const normalized = Array.isArray(raw)
    ? raw.map((f) => (typeof f === "object" ? f.id : f))
    : typeof raw === "object"
      ? [raw.id]
      : [];

  localRule.value = { ...rule, folder_ids: normalized };
});

// ─── Computed ─────────────────────────────────────────────────────────────────

const filteredRules = computed(() => {
  if (!search.value.trim()) return props.rules;
  const q = search.value.toLowerCase();
  return props.rules.filter(
    (r) => r.name?.toLowerCase().includes(q) || r.pattern?.toLowerCase().includes(q),
  );
});

const selectedRule = computed(() => props.rules.find((r) => r.id === selectedRuleId.value) || null);

const isAssignedToCurrentFolder = computed(() => {
  if (!selectedRule.value || !props.currentFolder) return false;
  return selectedRule.value.folder_ids?.includes(props.currentFolder.id);
});

const getFoldersInFolder = (folder) => collectDescendants(folder, isFolder);
const allFolders = computed(() => getFoldersInFolder(projectFileStructure.value));
const folderOptions = computed(() => allFolders.value.map((f) => ({ id: f.id, name: f.name })));

const assignedFolderIds = computed({
  get() {
    if (!localRule.value?.folder_ids?.length) return [];
    // Retrouve les objets complets depuis folderOptions
    return localRule.value.folder_ids
      .map((id) => folderOptions.value.find((f) => f.id === id))
      .filter(Boolean); // élimine les dossiers supprimés éventuels
  },
  set(selectedFolders) {
    if (localRule.value) {
      // Stocke uniquement les IDs en interne
      localRule.value.folder_ids = selectedFolders.map((f) => f.id);
    }
  },
});

// ─── Actions ──────────────────────────────────────────────────────────────────

function toggleAssignment(val) {
  if (!selectedRule.value || !props.currentFolder) return;
  if (val) {
    store.assignRuleToFolder(selectedRule.value.id, props.currentFolder.id);
  } else {
    store.unassignRuleFromFolder(selectedRule.value.id, props.currentFolder.id);
  }
}

async function saveAssignment() {
  if (!localRule.value) return;
  await store.saveRule(null, props.projectPk, localRule.value);
  emit("assignment-saved", localRule.value);
}

async function saveRecursive() {
  if (!localRule.value) return;
  await store.saveRule(null, props.projectPk, localRule.value);
}
</script>

<style lang="scss" scoped src="./NamingRulesList.scss"></style>
