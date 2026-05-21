<!-- 
  GedFileUpload.vue — Integration example
  Shows how to wire naming convention check into the existing upload flow.
  
  This is NOT a full replacement of your existing upload component.
  Copy the relevant sections into your actual GedView or FileUpload component.
-->
<template>
  <div class="ged-upload-example">
    <!-- ① Soft-mode banner (non-blocking) -->
    <NamingViolationBanner
      v-if="showBanner"
      :violations="violations"
      @dismiss="onBannerDismiss"
      @apply-renames="onBannerApplyRenames"
      @rename="handleSoftRename"
    />

    <!-- ② Your existing upload trigger (unchanged) -->
    <!-- <BIMDataButton @click="triggerUpload">
      <BIMDataIcon name="upload" />
      Charger un fichier
    </BIMDataButton>
    <input ref="fileInput" type="file" multiple hidden @change="onFilesSelected" /> -->

    <!-- ③ Strict-mode blocking modal -->
    <NamingViolationModal
      v-if="showModal"
      :violations="strictViolations"
      @confirm="onModalConfirm"
      @cancel="onModalCancel"
    />

    <!-- ④ Naming convention panel (side panel) -->
    <div v-if="showNamingPanel" class="naming-side-panel" style="position: absolute; z-index: 10">
      <!-- Toggle between list and create/edit -->
      <NamingConventionPanel
        v-if="panelMode === 'create' || panelMode === 'edit'"
        :editing-rule="editingRule"
        :cloud-pk="cloudPk"
        :project-pk="projectPk"
        @close="closeNamingPanel"
        @saved="onRuleSaved"
        @go-back="panelMode = 'list'"
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

    <!-- ⑤ Trigger for naming panel (place this in your GED toolbar) -->
    <BIMDataButton ghost @click="showNamingPanel = !showNamingPanel">
      <BIMDataIcon name="convention" />
      Gestion des conventions de nommage
    </BIMDataButton>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useNamingConventionStore } from "./namingConventionStore.js";
import { useNamingConvention } from "./useNamingConvention.js";
import NamingViolationBanner from "./NamingViolationBanner.vue";
import NamingViolationModal from "./NamingViolationModal.vue";
import NamingConventionPanel from "./NamingConventionPanel.vue";
import NamingRulesList from "./NamingRulesList.vue";

// ─── Props ────────────────────────────────────────────────────────────────────

const props = defineProps({
  cloudPk: { type: [String, Number], required: true },
  projectPk: { type: [String, Number], required: true },
  currentFolder: { type: Object, default: null },
});

// ─── Store ────────────────────────────────────────────────────────────────────

const store = useNamingConventionStore();
const { rules } = store;

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

const showNamingPanel = ref(false);
const panelMode = ref("list"); // 'list' | 'create' | 'edit'
const editingRule = ref(null);

function closeNamingPanel() {
  showNamingPanel.value = false;
  panelMode.value = "list";
  editingRule.value = null;
}

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
  console.log("Assignment saved:", rule);
}
</script>
