import { ref, computed } from "vue";
import { useNamingConventionStore } from "../state/naming-convention.js";
import { RULE_MODES } from "../services/NamingConvention.js";

export function useNamingConvention(currentFolder) {
  const store = useNamingConventionStore();

  // ── State ────────────────────────────────────────────────────────────────

  /** All violations (soft + strict) from the last check */
  const violations = ref([]);

  /** Only strict-mode violations */
  const strictViolations = ref([]);

  /** Whether we should show the soft banner */
  const showBanner = ref(false);

  /** Whether we should show the strict blocking modal */
  const showModal = ref(false);

  /** Files pending upload (held while modal is open) */
  const pendingFiles = ref([]);

  /** Resolve/reject callbacks for the async check flow */
  let _resolve = null;
  let _reject = null;

  // ── Computed ─────────────────────────────────────────────────────────────

  const hasSoftViolations = computed(
    () => violations.value.filter((v) => v.rule?.mode === RULE_MODES.SOFT).length > 0,
  );

  const hasStrictViolations = computed(
    () => violations.value.filter((v) => v.rule?.mode === RULE_MODES.STRICT).length > 0,
  );

  // ── Core check ───────────────────────────────────────────────────────────

  /**
   * Check files before upload.
   *
   * Returns a promise that resolves with the final file list to upload
   * (potentially with renamed files substituted) or rejects if the user cancels.
   *
   * If no rules apply: resolves immediately with original files.
   * If soft violations: shows banner, resolves immediately (upload proceeds).
   * If strict violations: shows blocking modal, waits for user resolution.
   */
  async function checkBeforeUpload(files) {
    const folder =
      typeof currentFolder === "function"
        ? currentFolder()
        : (currentFolder?.value ?? currentFolder);

    if (!folder) return { files, blocked: false };

    const result = store.checkFilesBeforeUpload(files, folder);

    // No violations → proceed
    if (result.pass) return { files, blocked: false };

    violations.value = result.violations;
    strictViolations.value = result.strictViolations;

    // Soft only → show banner, don't block
    if (!result.hasStrict) {
      showBanner.value = true;
      return { files, blocked: false, hasSoftWarnings: true };
    }

    // Strict violations → block and wait for modal resolution
    pendingFiles.value = [...files];
    showModal.value = true;

    return new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
  }

  // ── Modal callbacks ───────────────────────────────────────────────────────

  /**
   * Called when the user confirms renames in the strict modal.
   * renames: Array of { original: File, newName: string }
   */
  function onModalConfirm(renames) {
    showModal.value = false;

    // Substitute renamed files in the pending list
    const finalFiles = pendingFiles.value.map((file) => {
      const rename = renames.find(
        (r) => (r.original.name || r.original.file_name) === (file.name || file.file_name),
      );
      if (rename) {
        // Create a new File with the new name (browser File API)
        if (file instanceof File) {
          return new File([file], rename.newName, { type: file.type });
        }
        // For API file objects (already uploaded), return a patch object
        return { ...file, name: rename.newName, file_name: rename.newName };
      }
      return file;
    });

    clearViolations();
    if (_resolve) {
      _resolve({ files: finalFiles, blocked: false });
      _resolve = null;
    }
  }

  function onModalCancel() {
    showModal.value = false;
    pendingFiles.value = [];
    clearViolations();
    if (_reject) {
      _reject(new Error("Upload cancelled by user (naming rule)"));
      _reject = null;
    }
  }

  // ── Banner callbacks ──────────────────────────────────────────────────────

  function onBannerDismiss() {
    showBanner.value = false;
    clearViolations();
  }

  function onBannerApplyRenames(renames) {
    showBanner.value = false;
    // Emit for parent to handle API rename calls
    return renames;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  function clearViolations() {
    violations.value = [];
    strictViolations.value = [];
  }

  return {
    // State
    violations,
    strictViolations,
    showBanner,
    showModal,
    hasSoftViolations,
    hasStrictViolations,
    // Core
    checkBeforeUpload,
    // Modal
    onModalConfirm,
    onModalCancel,
    // Banner
    onBannerDismiss,
    onBannerApplyRenames,
    // Utils
    clearViolations,
  };
}
