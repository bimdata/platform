<template>
  <div class="naming-panel">
    <!-- Header -->
    <div class="naming-panel__header">
      <BIMDataButton @click="$emit('go-back')">
        <BIMDataIcon name="arrow" size="xs" />
      </BIMDataButton>
      <span>{{ editingRule ? "Modifier la règle" : "Convention de nommage" }}</span>
      <button class="naming-panel__close" @click="$emit('close')">
        <BIMDataIcon name="close" size="xs" />
      </button>
    </div>

    <div class="naming-panel__body">
      <!-- ① Nom de la règle -->
      <section class="naming-panel__section">
        <div class="naming-panel__step">
          <span class="naming-panel__step-num">1</span>
          <span class="naming-panel__step-label">Nom de la règle</span>
        </div>
        <BIMDataInput v-model="form.name" placeholder="Nom" :error="errors.name" />
      </section>

      <!-- ② Type de séparateur -->
      <section class="naming-panel__section">
        <div class="naming-panel__step">
          <span class="naming-panel__step-num">2</span>
          <span class="naming-panel__step-label">Type de séparateur</span>
        </div>
        <div class="naming-panel__separators">
          <label
            v-for="sep in SEPARATOR_TYPES"
            :key="sep.value"
            class="naming-panel__sep-option"
            :class="{ active: form.separator === sep.value }"
          >
            <input type="radio" :value="sep.value" v-model="form.separator" hidden />
            {{ sep.label }}
          </label>
        </div>
      </section>

      <!-- ③ Structure de la règle -->
      <section class="naming-panel__section">
        <div class="naming-panel__step">
          <span class="naming-panel__step-num">3</span>
          <span class="naming-panel__step-label">Structure de la règle</span>
        </div>

        <!-- Live preview -->
        <div v-if="livePattern" class="naming-panel__preview">
          <span>Aperçu&nbsp;:</span>
          <code>{{ livePattern }}</code>
        </div>

        <!-- Segment list -->
        <div class="naming-panel__segments">
          <NamingSegmentRow
            v-for="(seg, idx) in form.segments"
            :key="seg._id"
            :segment="seg"
            :index="idx"
            :separator="form.separator"
            :custom-lists="customLists"
            @update="updateSegment(idx, $event)"
            @remove="removeSegment(idx)"
            @move-up="moveSegment(idx, -1)"
            @move-down="moveSegment(idx, 1)"
          />
        </div>

        <!-- Add segment buttons -->
        <div class="naming-panel__add-btns">
          <button class="btn-add-seg" @click="addSegment('n_chars')">+ N caractères</button>
          <button class="btn-add-seg" @click="addSegment('bounded')">+ Valeurs bornées</button>
          <button class="btn-add-seg" @click="addSegment('list')">+ Liste</button>
        </div>
      </section>

      <!-- Mode stricte / souple -->
      <section class="naming-panel__section naming-panel__section--mode">
        <div class="naming-panel__mode-toggle">
          <label class="naming-panel__checkbox-label">
            <BIMDataCheckbox v-model="isStrict" />
            <span>Règle stricte</span>
          </label>
          <p class="naming-panel__mode-hint">
            <template v-if="isStrict">
              Les fichiers dont le nom ne correspond pas à cette règle seront bloqués à l'import.
              L'utilisateur devra les renommer avant de valider.
            </template>
            <template v-else>
              Si vous cochez cette case, vous devrez changer le nom de l'intégralité des fichiers
              qui ne correspondent pas à cette nouvelle règle.
            </template>
          </p>
        </div>

        <!-- Recursive option -->
        <label class="naming-panel__checkbox-label naming-panel__checkbox-label--sub">
          <BIMDataCheckbox v-model="form.recursive" />
          <span>Règle récursive</span>
        </label>
        <p class="naming-panel__mode-hint naming-panel__mode-hint--sub">
          Si vous cochez cette case, cette règle s'appliquera également aux fichiers contenus dans
          les sous-dossiers de votre dossier principal.
        </p>
      </section>
    </div>

    <!-- Footer -->
    <div class="naming-panel__footer">
      <BIMDataButton ghost color="secondary" @click="$emit('close')"> Annuler </BIMDataButton>
      <BIMDataButton fill color="primary" :loading="saving" :disabled="!isFormValid" @click="save">
        <BIMDataIcon name="save" size="xs" />
        Enregistrer la règle
      </BIMDataButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useNamingConventionStore } from "./namingConventionStore.js";
import {
  SEPARATOR_TYPES,
  SEGMENT_TYPES,
  RULE_MODES,
  buildHumanReadablePattern,
} from "./namingConventionService.js";
import NamingSegmentRow from "./NamingSegmentRow.vue";

// ─── Props / Emits ────────────────────────────────────────────────────────────

const props = defineProps({
  editingRule: { type: Object, default: null },
  cloudPk: { type: [String, Number], required: true },
  projectPk: { type: [String, Number], required: true },
});

const emit = defineEmits(["close", "saved", "go-back"]);

// ─── Store ────────────────────────────────────────────────────────────────────

const store = useNamingConventionStore();
const { customLists } = store;

// ─── Form State ───────────────────────────────────────────────────────────────

const defaultForm = () => ({
  name: "",
  separator: "-",
  segments: [],
  recursive: false,
  folder_ids: [],
});

const form = ref(defaultForm());
const isStrict = ref(false);
const saving = ref(false);
const errors = ref({});

// Populate form when editing
watch(
  () => props.editingRule,
  (rule) => {
    if (rule) {
      form.value = {
        ...defaultForm(),
        ...rule,
        segments: (rule.segments || []).map((s) => ({ ...s, _id: s._id || uid() })),
      };
      isStrict.value = rule.mode === RULE_MODES.STRICT;
    } else {
      form.value = defaultForm();
      isStrict.value = false;
    }
  },
  { immediate: true },
);

// ─── Computed ─────────────────────────────────────────────────────────────────

const livePattern = computed(() => {
  if (!form.value.segments.length) return "";
  try {
    return buildHumanReadablePattern(form.value);
  } catch {
    return "";
  }
});

const isFormValid = computed(() => form.value.name.trim() !== "" && form.value.segments.length > 0);

// ─── Segment Management ───────────────────────────────────────────────────────

function addSegment(type) {
  const seg = {
    _id: uid(),
    type,
    config: getDefaultConfig(type),
  };
  form.value.segments.push(seg);
}

function getDefaultConfig(type) {
  switch (type) {
    case SEGMENT_TYPES.N_CHARS:
      return { min: null, max: null };
    case SEGMENT_TYPES.BOUNDED:
      return { min: 1, max: 50 };
    case SEGMENT_TYPES.LIST:
      return { listId: null, values: [] };
    default:
      return {};
  }
}

function updateSegment(idx, data) {
  form.value.segments[idx] = { ...form.value.segments[idx], ...data };
}

function removeSegment(idx) {
  form.value.segments.splice(idx, 1);
}

function moveSegment(idx, dir) {
  const target = idx + dir;
  if (target < 0 || target >= form.value.segments.length) return;
  const segs = [...form.value.segments];
  [segs[idx], segs[target]] = [segs[target], segs[idx]];
  form.value.segments = segs;
}

// ─── Save ─────────────────────────────────────────────────────────────────────

async function save() {
  errors.value = {};
  if (!form.value.name.trim()) {
    errors.value.name = "Le nom est requis";
    return;
  }

  saving.value = true;
  try {
    const payload = {
      ...form.value,
      id: props.editingRule?.id,
      mode: isStrict.value ? RULE_MODES.STRICT : RULE_MODES.SOFT,
    };
    const saved = await store.saveRule(props.cloudPk, props.projectPk, payload);
    emit("saved", saved);
  } finally {
    saving.value = false;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _uidCounter = 0;
function uid() {
  return `seg_${++_uidCounter}_${Date.now()}`;
}
</script>

<style lang="scss" scoped>
.naming-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-white);
  font-size: var(--font-size-s);

  &__header {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: var(--spacing-unit);
    font-weight: 600;
    font-size: var(--font-size-m);

    .naming-panel__close {
      margin-left: auto;
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

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__step {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__step-num {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--color-primary);
    color: white;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__step-label {
    font-weight: 600;
    color: var(--color-granite-dark);
  }

  &__separators {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__sep-option {
    padding: 6px 12px;
    border-radius: 4px;
    border: 1px solid var(--color-silver);
    cursor: pointer;
    user-select: none;
    transition: all 0.15s ease;
    font-family: monospace;
    font-size: var(--font-size-s);
    color: var(--color-granite);

    &.active {
      border-color: var(--color-primary);
      background: var(--color-primary-lighter);
      color: var(--color-primary);
      font-weight: 600;
    }

    &:hover:not(.active) {
      border-color: var(--color-granite-light);
    }
  }

  &__preview {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--color-silver-lighter);
    border-radius: 4px;
    font-size: 12px;
    color: var(--color-granite);

    code {
      font-family: monospace;
      font-weight: 600;
      color: var(--color-primary);
      font-size: 13px;
    }
  }

  &__segments {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__add-btns {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__mode-toggle {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-weight: 500;

    &--sub {
      margin-top: 8px;
    }
  }

  &__mode-hint {
    font-size: 12px;
    color: var(--color-granite);
    line-height: 1.5;
    padding-left: 28px;

    &--sub {
      margin-top: -4px;
    }
  }

  &__footer {
    padding: 12px 16px;
    border-top: 1px solid var(--color-silver-light);
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}

.btn-add-seg {
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px dashed var(--color-silver);
  background: transparent;
  color: var(--color-primary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-primary-lighter);
  }
}
</style>
