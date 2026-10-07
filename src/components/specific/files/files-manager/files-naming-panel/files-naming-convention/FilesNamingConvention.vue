<template>
  <div class="naming-panel">
    <!-- Header -->
    <div class="naming-panel__header flex items-center justify-between">
      <div class="flex items-center">
        <BIMDataButton
          color="default"
          ghost
          rounded
          icon
          class="go-back"
          @click="$emit('go-back')"
          width="30px"
          height="30px"
        >
          <BIMDataIcon name="arrow" size="xxs" />
        </BIMDataButton>
        <strong>{{ editingRule ? "Modifier la règle" : "Convention de nommage" }}</strong>
      </div>
      <BIMDataButton
        color="default"
        ghost
        rounded
        icon
        class="naming-panel__close"
        @click="$emit('close')"
      >
        <BIMDataIcon name="close" size="xxs" />
      </BIMDataButton>
    </div>

    <div class="naming-panel__body">
      <!-- ① Nom de la règle -->
      <section class="naming-panel__section">
        <div class="naming-panel__step">
          <strong class="naming-panel__step-num">1</strong>
          <strong class="naming-panel__step-label">Nom de la règle*</strong>
        </div>
        <BIMDataInput v-model="form.name" placeholder="Nom*" :error="errors.name" />
      </section>

      <!-- ② Type de séparateur -->
      <section class="naming-panel__section">
        <div class="naming-panel__step">
          <strong class="naming-panel__step-num">2</strong>
          <strong class="naming-panel__step-label">Type de séparateur</strong>
        </div>
        <div class="naming-panel__separators flex">
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
          <strong class="naming-panel__step-num">3</strong>
          <strong class="naming-panel__step-label">Structure de la règle</strong>
        </div>

        <!-- Live preview -->
        <div v-if="livePattern" class="naming-panel__preview">
          <span>Aperçu&nbsp;:</span>
          <code>{{ livePattern }}</code>
        </div>

        <!-- Segment list -->
        <div class="naming-panel__segments" v-if="form.segments.length">
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
        <div class="naming-panel__mode-toggle">
          <label class="naming-panel__checkbox-label naming-panel__checkbox-label--sub">
            <BIMDataCheckbox v-model="form.recursive" />
            <span>Règle récursive</span>
          </label>
          <p class="naming-panel__mode-hint naming-panel__mode-hint--sub">
            Si vous cochez cette case, cette règle s'appliquera également aux fichiers contenus dans
            les sous-dossiers de votre dossier principal.
          </p>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <div class="naming-panel__footer">
      <BIMDataButton ghost color="secondary" @click="$emit('close')"> Annuler </BIMDataButton>
      <BIMDataButton
        fill
        color="primary"
        radius
        :loading="saving"
        :disabled="!isFormValid"
        @click="save"
      >
        <BIMDataIcon name="save" size="xxs" margin="0 6px 0 0" />
        Enregistrer la règle
      </BIMDataButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useNamingConventionStore } from "../../../../../../state/naming-convention.js";
import {
  SEPARATOR_TYPES,
  SEGMENT_TYPES,
  RULE_MODES,
  buildHumanReadablePattern,
} from "../../../../../../services/NamingConvention.js";
import NamingSegmentRow from "../naming-segment-row/NamingSegmentRow.vue";

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

<style lang="scss" scoped src="./FilesNamingConvention.scss"></style>
