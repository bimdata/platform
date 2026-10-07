<template>
  <div class="files-naming-panel">
    <!-- ① Soft-mode banner (non-blocking) -->
    <NamingViolationBanner
      v-if="showBanner"
      :violations="violations"
      @dismiss="onBannerDismiss"
      @apply-renames="onBannerApplyRenames"
      @rename="handleSoftRename"
    />

    <!-- ③ Strict-mode blocking modal -->
    <NamingViolationModal
      v-if="showModal"
      :violations="strictViolations"
      @confirm="onModalConfirm"
      @cancel="onModalCancel"
    />

    <!-- ④ Naming convention panel (side panel) -->
    <div class="naming-side-panel">
      <!-- Toggle between list and create/edit -->
      <FilesNamingConvention
        v-if="panelMode === 'create' || panelMode === 'edit'"
        :editing-rule="editingRule"
        :cloud-pk="cloudPk"
        :project-pk="projectPk"
        @close="closeNamingPanel"
        @go-back="panelMode = 'list'"
        @saved="onRuleSaved"
      />
      <NamingRulesList
        v-else
        :rules="rules"
        :current-folder="currentFolder"
        :project-pk="projectPk"
        @close="closeNamingPanel"
        @create="panelMode = 'create'"
        @edit="startEditRule"
        @assignment-saved="onAssignmentSaved"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import { useFiles } from "../../../../../state/files.js";
import { useNamingConventionStore } from "../../../../../state/naming-convention.js";

import { collectDescendants } from "../../../../../utils/file-tree.js";
import { isFolder } from "../../../../../utils/file-structure.js";

import { validateFileName } from "../../../../../services/NamingConvention.js";

import { useNamingConvention } from "../../../../../composables/naming-convention.js";

import NamingViolationBanner from "./naming-violation-banner/NamingViolationBanner.vue";
import NamingViolationModal from "./naming-violation-modal/NamingViolationModal.vue";
import FilesNamingConvention from "./files-naming-convention/FilesNamingConvention.vue";
import NamingRulesList from "./naming-rules-list/NamingRulesList.vue";

// ─── Props ────────────────────────────────────────────────────────────────────

const props = defineProps({
  cloudPk: { type: [String, Number], required: true },
  projectPk: { type: [String, Number], required: true },
  currentFolder: { type: Object, default: null },
});

const emit = defineEmits(["close"]);

// ─── Store ────────────────────────────────────────────────────────────────────

const store = useNamingConventionStore();
const { projectFileStructure } = useFiles();
const { rules } = store;
const isFile = (node) => !isFolder(node);

// Load rules on mount
store.fetchRules(props.cloudPk, props.projectPk);

// ─── Naming convention hook ───────────────────────────────────────────────────

const {
  violations,
  strictViolations,
  showBanner,
  showModal,
  checkBeforeUpload,
  onModalConfirm,
  onModalCancel,
  onBannerDismiss,
  onBannerApplyRenames,
  triggerViolations,
} = useNamingConvention(() => props.currentFolder);

// ─── Upload flow ──────────────────────────────────────────────────────────────

const fileInput = ref(null);

function triggerUpload() {
  fileInput.value?.click();
}

async function onFilesSelected(event) {
  const files = Array.from(event.target.files);
  if (!files.length) return;

  try {
    // ← This is the key integration point
    const { files: finalFiles } = await checkBeforeUpload(files);
    // Proceed with your actual upload logic here
    await uploadFiles(finalFiles);
  } catch {
    // User cancelled (strict modal)
    console.log("Upload cancelled");
  } finally {
    // Reset input so same files can be re-selected
    event.target.value = "";
  }
}

async function uploadFiles(files) {
  // Your existing upload implementation
  // e.g.: await gedStore.uploadDocuments(props.currentFolder.id, files);
  console.log(
    "Uploading files:",
    files.map((f) => f.name),
  );
}

function handleSoftRename({ item, newName }) {
  // Call API to rename the already-uploaded file
  // e.g.: await gedStore.renameDocument(item.file.id, newName);
  console.log("Soft rename:", item.file.name, "→", newName);
}

// ─── Naming panel ─────────────────────────────────────────────────────────────
const panelMode = ref("list"); // 'list' | 'create' | 'edit'
const editingRule = ref(null);
const closing = ref(false);

function closeNamingPanel() {
  panelMode.value = "list";
  editingRule.value = null;
  close();
}

const close = () => {
  closing.value = false;
  emit("close");
};

function startEditRule(rule) {
  editingRule.value = rule;
  panelMode.value = "edit";
}

function onRuleSaved(rule) {
  console.log("Rule saved:", rule);
  panelMode.value = "list";
  editingRule.value = null;
}

function onAssignmentSaved(rule) {
  if (!rule.folder_ids?.length) return;

  const allFolders = collectDescendants(projectFileStructure.value, isFolder);
  const targetFolders = allFolders.filter((f) => rule.folder_ids.includes(f.id));

  const seen = new Set();
  const files = [];

  for (const folder of targetFolders) {
    const candidates = rule.recursive
      ? collectDescendants(folder, isFile)
      : (folder.children ?? []).filter(isFile);

    for (const file of candidates) {
      if (!seen.has(file.id)) {
        seen.add(file.id);
        files.push(file);
      }
    }
  }

  if (!files.length) return;

  const newViolations = files
    .map((file) => {
      const name = file.name ?? file.file_name;
      const { valid, reason } = validateFileName(name, rule);
      return valid ? null : { file, rule, reason };
    })
    .filter(Boolean);

  triggerViolations(newViolations); // ← le composable gère strict vs soft
}
</script>

<style lang="scss" scoped>
.naming-side-panel {
  height: 97vh;
}
</style>
