<template>
  <BIMDataModal class="violation-modal" :title="null" :width="600" :closable="false">
    <template #header>
      <div class="violation-modal__header">
        <BIMDataIcon name="NamingConvention" class="violation-modal__icon" />
        <span>Convention de nommage</span>
      </div>
    </template>

    <template #default>
      <div class="violation-modal__body">
        <!-- Illustration -->
        <div class="violation-modal__illustration">
          <div class="violation-modal__file-icon">
            <BIMDataIcon name="file" size="xl" />
            <div class="violation-modal__warning-badge">
              <BIMDataIcon name="warning" size="xs" />
            </div>
          </div>
        </div>

        <!-- Message -->
        <p class="violation-modal__message">
          Renommez ici les fichiers qui ne correspondent pas à la
          <strong>règle stricte</strong> que vous avez programmée.
          <br />
          <span class="violation-modal__warning">
            Attention, si vous ne les renommez pas maintenant, ils seront
            <strong>supprimés</strong> de votre projet.
          </span>
        </p>

        <!-- Rule context -->
        <div
          v-for="ruleGroup in groupedViolations"
          :key="ruleGroup.ruleId"
          class="violation-modal__rule-group"
        >
          <div class="violation-modal__rule-header">
            <span class="violation-modal__rule-name">{{ ruleGroup.ruleName }}</span>
            <code class="violation-modal__rule-pattern">{{ ruleGroup.pattern }}</code>
          </div>

          <!-- File rows -->
          <div class="violation-modal__files">
            <div
              v-for="item in ruleGroup.items"
              :key="item.file.name"
              class="file-row"
              :class="{
                'file-row--editing': editingFile === item.file.name,
                'file-row--valid': item.renamed && item.renameValid,
                'file-row--invalid': item.renamed && !item.renameValid,
              }"
            >
              <!-- Not editing -->
              <template v-if="editingFile !== item.file.name">
                <BIMDataIcon :name="getFileIcon(item.file.name)" size="s" class="file-row__icon" />
                <span class="file-row__name">
                  {{ item.renamed ? item.newName : item.file.name }}
                </span>

                <!-- Status -->
                <BIMDataIcon
                  v-if="item.renamed && item.renameValid"
                  name="check"
                  size="xs"
                  class="file-row__status file-row__status--ok"
                />
                <BIMDataIcon
                  v-else-if="!item.renamed"
                  name="warning"
                  size="xs"
                  class="file-row__status file-row__status--warn"
                />

                <button class="file-row__edit-btn" @click="startEdit(item)">
                  <BIMDataIcon name="edit" size="xs" />
                </button>
              </template>

              <!-- Editing -->
              <template v-else>
                <BIMDataIcon :name="getFileIcon(item.file.name)" size="s" class="file-row__icon" />
                <div class="file-row__edit-area">
                  <BIMDataInput
                    ref="editInput"
                    v-model="editValue"
                    placeholder="Renommer le fichier"
                    size="s"
                    :error="editError"
                    autofocus
                    @keyup.enter="confirmEdit(item)"
                    @keyup.escape="cancelEdit"
                  />
                </div>
                <button
                  class="file-row__confirm"
                  :disabled="!editValue.trim()"
                  @click="confirmEdit(item)"
                >
                  Valider
                </button>
                <button class="file-row__cancel-edit" @click="cancelEdit">
                  <BIMDataIcon name="close" size="xs" />
                </button>
                <BIMDataIcon
                  v-if="editValue && getEditValidity(item)"
                  name="check"
                  size="xs"
                  class="file-row__status file-row__status--ok"
                />
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="violation-modal__footer">
        <BIMDataButton ghost color="secondary" @click="$emit('cancel')"> Annuler </BIMDataButton>
        <BIMDataButton fill color="primary" :disabled="!allResolved" @click="confirm">
          Renommer
        </BIMDataButton>
      </div>
    </template>
  </BIMDataModal>
</template>

<script setup>
import { ref, computed, reactive, nextTick } from "vue";
import {
  validateFileName,
  suggestRenames,
  getExtension,
} from "../../../../../../services/NamingConvention.js";

// ─── Props / Emits ────────────────────────────────────────────────────────────

const props = defineProps({
  /**
   * violations: Array of { file: File|{name}, rule: NamingRule, reason: string }
   */
  violations: { type: Array, required: true },
});

const emit = defineEmits(["confirm", "cancel"]);

// ─── State ────────────────────────────────────────────────────────────────────

const editingFile = ref(null);
const editValue = ref("");
const editError = ref("");

// Build mutable item list
const items = reactive(
  props.violations.map((v) => ({
    ...v,
    renamed: false,
    newName: null,
    renameValid: false,
    suggestions: suggestRenames(v.file.name || v.file.file_name, v.rule),
  })),
);

// ─── Computed ─────────────────────────────────────────────────────────────────

const groupedViolations = computed(() => {
  const groups = {};
  items.forEach((item) => {
    const id = item.rule.id;
    if (!groups[id]) {
      groups[id] = {
        ruleId: id,
        ruleName: item.rule.name,
        pattern: item.rule.pattern,
        items: [],
      };
    }
    groups[id].items.push(item);
  });
  return Object.values(groups);
});

const allResolved = computed(() => items.every((i) => i.renamed && i.renameValid));

// ─── Edit Logic ───────────────────────────────────────────────────────────────

function startEdit(item) {
  editingFile.value = item.file.name || item.file.file_name;
  editValue.value = item.newName || editingFile.value;
  editError.value = "";
  nextTick(() => {
    // focus handled by autofocus
  });
}

function cancelEdit() {
  editingFile.value = null;
  editValue.value = "";
  editError.value = "";
}

function confirmEdit(item) {
  const name = editValue.value.trim();
  if (!name) return;

  const { valid, reason } = validateFileName(name, item.rule);
  if (!valid) {
    editError.value = reason;
    return;
  }

  item.renamed = true;
  item.newName = name;
  item.renameValid = true;
  cancelEdit();
}

function getEditValidity(item) {
  if (!editValue.value) return false;
  return validateFileName(editValue.value, item.rule).valid;
}

// ─── Confirm ──────────────────────────────────────────────────────────────────

function confirm() {
  const renames = items.map((item) => ({
    original: item.file,
    newName: item.newName,
    rule: item.rule,
  }));
  emit("confirm", renames);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFileIcon(fileName) {
  const ext = getExtension(fileName).toLowerCase();
  switch (ext) {
    case "ifc":
      return "ifc";
    case "pdf":
      return "pdf";
    case "png":
    case "jpg":
    case "jpeg":
      return "image";
    default:
      return "file";
  }
}
</script>

<style lang="scss" scoped src="./NamingViolationModal.scss"></style>
