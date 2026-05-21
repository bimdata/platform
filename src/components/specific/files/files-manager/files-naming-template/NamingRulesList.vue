<template>
  <div class="rules-list">
    <!-- Header -->
    <div class="rules-list__header">
      <BIMDataIcon name="convention" size="s" />
      <span>Gestion des conventions de nommage</span>
      <button class="rules-list__close" @click="$emit('close')">
        <BIMDataIcon name="close" size="xs" />
      </button>
    </div>

    <!-- Toolbar -->
    <div class="rules-list__toolbar">
      <span class="rules-list__title">Liste des règles</span>
      <BIMDataButton fill color="primary" size="s" @click="$emit('create')">
        <BIMDataIcon name="plus" size="xs" />
        ajouter une règle
      </BIMDataButton>
    </div>

    <!-- Search -->
    <div class="rules-list__search">
      <BIMDataSearch v-model="search" placeholder="Search" />
    </div>

    <!-- Empty state -->
    <div v-if="!filteredRules.length" class="rules-list__empty">
      <BIMDataIcon name="convention" size="l" />
      <p>Aucune règle de nommage définie</p>
      <BIMDataButton ghost color="primary" size="s" @click="$emit('create')">
        Créer une première règle
      </BIMDataButton>
    </div>

    <!-- Rule items -->
    <div class="rules-list__items" v-else>
      <div
        v-for="rule in filteredRules"
        :key="rule.id"
        class="rule-item"
        :class="{
          'rule-item--selected': selectedRuleId === rule.id,
          'rule-item--strict': rule.mode === 'strict',
        }"
      >
        <label class="rule-item__radio">
          <input type="radio" :value="rule.id" v-model="selectedRuleId" hidden />
          <span class="rule-item__radio-dot" />
        </label>

        <div class="rule-item__info">
          <div class="rule-item__header">
            <BIMDataIcon name="convention" size="xs" />
            <span class="rule-item__name" :title="rule.name">{{ rule.name }}</span>
            <span v-if="rule.mode === 'strict'" class="rule-item__badge rule-item__badge--strict">
              strict
            </span>
            <button class="rule-item__edit" @click.stop="$emit('edit', rule)" title="Modifier">
              <BIMDataIcon name="edit" size="xs" />
            </button>
          </div>
          <div class="rule-item__meta">
            <BIMDataUserAvatar :user="{ name: rule.creator_name || '?' }" size="xxs" />
            <span class="rule-item__creator">{{ rule.creator_email || rule.creator_name }}</span>
            <code class="rule-item__pattern">{{ rule.pattern }}</code>
          </div>
        </div>
      </div>
    </div>

    <!-- Folder assignment (shown when a rule is selected) -->
    <transition name="slide-up">
      <div v-if="selectedRule" class="rules-list__assign">
        <p class="rules-list__assign-label">
          Appliquer
          <strong>{{ selectedRule.name }}</strong>
          au dossier actuel&nbsp;:
        </p>
        <div class="rules-list__assign-actions">
          <BIMDataCheckbox
            :model-value="isAssignedToCurrentFolder"
            @update:model-value="toggleAssignment"
          />
          <span>{{ currentFolder?.name || "Dossier courant" }}</span>
        </div>
        <label class="naming-panel__checkbox-label">
          <BIMDataCheckbox v-model="selectedRule.recursive" @change="saveRecursive" />
          <span class="rules-list__recursive-label">Règle récursive</span>
        </label>
        <p class="rules-list__recursive-hint">
          Si vous cochez cette case, cette règle s'appliquera également aux fichiers contenus dans
          les sous-dossiers de votre dossier principal.
        </p>
        <BIMDataButton
          fill
          color="primary"
          size="s"
          class="rules-list__save-btn"
          @click="saveAssignment"
        >
          <BIMDataIcon name="save" size="xs" />
          Enregistrer la règle
        </BIMDataButton>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useNamingConventionStore } from "./namingConventionStore.js";

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
  if (!selectedRule.value) return;
  await store.saveRule(null, props.projectPk, selectedRule.value);
  emit("assignment-saved", selectedRule.value);
}

async function saveRecursive() {
  if (!selectedRule.value) return;
  await store.saveRule(null, props.projectPk, selectedRule.value);
}
</script>

<style lang="scss" scoped>
.rules-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-white);
  font-size: var(--font-size-s);

  &__header {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: var(--font-size-m);
    justify-content: space-between;

    .rules-list__close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-granite);
      display: flex;
      align-items: center;

      &:hover {
        color: var(--color-primary);
      }
    }
  }

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px 6px;
  }

  &__title {
    font-weight: 600;
    font-size: var(--font-size-s);
    color: var(--color-granite-dark);
  }

  &__search {
    padding: 0 16px 8px;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 32px 16px;
    color: var(--color-granite);
    text-align: center;
    font-size: var(--font-size-s);
  }

  &__items {
    flex: 1;
    overflow-y: auto;
    padding: 0 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__assign {
    padding: 12px 16px;
    border-top: 1px solid var(--color-silver-light);
    background: var(--color-silver-lighter);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__assign-label {
    font-size: var(--font-size-s);
    color: var(--color-granite-dark);
  }

  &__assign-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__recursive-label {
    font-weight: 500;
  }

  &__recursive-hint {
    font-size: 12px;
    color: var(--color-granite);
    line-height: 1.4;
  }

  &__save-btn {
    align-self: flex-end;
  }
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: var(--color-silver-lighter);
  }

  &--selected {
    background: var(--color-primary-lighter);
    border: 1px solid var(--color-primary-light);
  }

  &--strict .rule-item__name {
    color: var(--color-primary);
  }

  &__radio {
    display: flex;
    align-items: center;
    padding-top: 2px;
    cursor: pointer;
  }

  &__radio-dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid var(--color-silver);
    display: block;
    flex-shrink: 0;
    transition: all 0.1s;

    .rule-item--selected & {
      border-color: var(--color-primary);
      background: var(--color-primary);
      box-shadow: inset 0 0 0 3px white;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__name {
    font-weight: 500;
    font-size: var(--font-size-s);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  &__badge {
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 10px;
    font-weight: 600;
    flex-shrink: 0;

    &--strict {
      background: var(--color-red-lighter);
      color: var(--color-red);
    }
  }

  &__edit {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-granite-light);
    padding: 2px;
    display: flex;
    align-items: center;
    opacity: 0;
    transition: opacity 0.1s;
    flex-shrink: 0;

    .rule-item:hover & {
      opacity: 1;
    }
    &:hover {
      color: var(--color-primary);
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
  }

  &__creator {
    font-size: 11px;
    color: var(--color-granite);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px;
  }

  &__pattern {
    font-family: monospace;
    font-size: 11px;
    color: var(--color-primary);
    background: var(--color-primary-lighter);
    padding: 1px 5px;
    border-radius: 3px;
    white-space: nowrap;
  }
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
