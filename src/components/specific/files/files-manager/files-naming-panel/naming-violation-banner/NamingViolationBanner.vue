<template>
  <!-- Soft mode: non-blocking banner with expandable violations list -->
  <div class="violation-banner" :class="{ expanded: isExpanded }">
    <!-- Summary row -->
    <div class="violation-banner__summary" @click="toggleExpand">
      <BIMDataIcon name="warning" size="s" class="violation-banner__icon" />
      <span class="violation-banner__text">
        {{ violations.length }} fichier{{ violations.length > 1 ? "s" : "" }} ne correspond{{
          violations.length > 1 ? "ent" : ""
        }}
        pas à la convention de nommage
      </span>
      <button class="violation-banner__expand" :aria-expanded="isExpanded">
        <BIMDataIcon
          name="chevron"
          size="xs"
          :style="{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }"
        />
      </button>
      <button class="violation-banner__dismiss" @click.stop="$emit('dismiss')">
        <BIMDataIcon name="close" size="xs" />
      </button>
    </div>

    <!-- Expanded file list -->
    <transition name="expand">
      <div v-if="isExpanded" class="violation-banner__list">
        <div
          v-for="item in violations"
          :key="item.file.name"
          class="violation-banner__item"
          :class="{ 'violation-banner__item--renamed': item.renamed }"
        >
          <!-- File info -->
          <BIMDataIcon name="file" size="xs" />
          <span class="violation-banner__filename">
            {{ item.renamed ? item.newName : item.file.name || item.file.file_name }}
          </span>
          <span class="violation-banner__rule-ref"> ({{ item.rule.name }}) </span>

          <!-- Renamed check -->
          <BIMDataIcon v-if="item.renamed" name="check" size="xs" class="violation-banner__check" />

          <!-- Rename inline if not done -->
          <template v-else>
            <button class="violation-banner__rename-btn" @click="startRename(item)">
              Renommer
            </button>
          </template>
        </div>

        <!-- Inline rename input -->
        <div v-if="renamingItem" class="violation-banner__rename-form">
          <span class="violation-banner__rename-label">
            Renommer « {{ renamingItem.file.name || renamingItem.file.file_name }} »
          </span>
          <BIMDataInput
            v-model="renameValue"
            placeholder="Nouveau nom"
            size="s"
            :error="renameError"
            autofocus
            @keyup.enter="confirmRename"
            @keyup.escape="cancelRename"
          />
          <div class="violation-banner__rename-actions">
            <BIMDataButton size="s" fill color="primary" @click="confirmRename">
              Valider
            </BIMDataButton>
            <BIMDataButton size="s" ghost color="secondary" @click="cancelRename">
              Annuler
            </BIMDataButton>
          </div>
        </div>

        <!-- All renamed: call to action -->
        <div v-if="allRenamed" class="violation-banner__all-ok">
          <BIMDataIcon name="check" size="s" />
          Tous les fichiers ont été renommés.
          <BIMDataButton size="s" fill color="primary" @click="$emit('apply-renames')">
            Appliquer les renommages
          </BIMDataButton>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { validateFileName } from "../../../../../../services/NamingConvention.js";

// ─── Props / Emits ────────────────────────────────────────────────────────────

const props = defineProps({
  violations: { type: Array, required: true },
});

const emit = defineEmits(["dismiss", "apply-renames", "rename"]);

// ─── State ────────────────────────────────────────────────────────────────────

const isExpanded = ref(false);
const renamingItem = ref(null);
const renameValue = ref("");
const renameError = ref("");

const items = reactive(props.violations.map((v) => ({ ...v, renamed: false, newName: null })));

// ─── Computed ─────────────────────────────────────────────────────────────────

const allRenamed = computed(() => items.every((i) => i.renamed));

// ─── Actions ──────────────────────────────────────────────────────────────────

function toggleExpand() {
  isExpanded.value = !isExpanded.value;
}

function startRename(item) {
  renamingItem.value = item;
  renameValue.value = item.file.name || item.file.file_name;
  renameError.value = "";
}

function cancelRename() {
  renamingItem.value = null;
  renameValue.value = "";
  renameError.value = "";
}

function confirmRename() {
  if (!renamingItem.value) return;
  const name = renameValue.value.trim();
  if (!name) return;

  const { valid, reason } = validateFileName(name, renamingItem.value.rule);
  if (!valid) {
    renameError.value = reason;
    return;
  }

  renamingItem.value.renamed = true;
  renamingItem.value.newName = name;
  emit("rename", { item: renamingItem.value, newName: name });
  cancelRename();
}
</script>

<style lang="scss" scoped src="./NamingViolationBanner.scss"></style>
