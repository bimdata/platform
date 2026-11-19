import { useAppModal } from "../components/specific/app/app-modal/app-modal.js";
import NamingConflictModal from "../components/specific/files/naming-constraint/NamingConflictModal.vue";
import { useFiles } from "../state/files.js";
import { useNamingConstraints } from "../state/naming-constraints.js";
import { isFolder } from "../utils/file-structure.js";
import { collectDescendants } from "../utils/file-tree.js";

/**
 * Open the naming conflict modal on documents that already exist in the project.
 *
 * Renames and deletions made in the modal are persisted through the API.
 * For files that are about to be uploaded, use `useNamingConstraintUpload` instead.
 */
export function useNamingConflictModal() {
  const { openModal, closeModal } = useAppModal();
  const { projectFileStructure } = useFiles();
  const { getEffectiveFolderRule } = useNamingConstraints();

  const getAllFolders = () =>
    projectFileStructure.value ? collectDescendants(projectFileStructure.value, isFolder) : [];

  /**
   * Show documents that all break the same rule.
   *
   * @param {Object} options
   * @param {Object} options.project
   * @param {Object[]} options.documents
   * @param {Object|null} options.rule
   * @param {Function} [options.onConfirm] called after changes are saved
   */
  const openNamingConflictModal = ({ project, documents, rule, onConfirm = null }) => {
    openModal({
      component: NamingConflictModal,
      props: {
        project,
        documents,
        allFolders: getAllFolders(),
        rule,
        onClose: closeModal,
        onConfirm,
      },
    });
  };

  /**
   * Show documents that may come from different folders: each document is
   * checked against the effective rule of its own parent folder, and documents
   * are grouped by rule in the modal.
   *
   * @param {Object} options
   * @param {Object} options.project
   * @param {Object[]} options.documents
   * @param {Function} [options.onConfirm] called after changes are saved
   */
  const openNamingConflictModalByFolder = async ({ project, documents, onConfirm = null }) => {
    const documentsWithRule = await Promise.all(
      documents.map(async (doc) => ({
        ...doc,
        namingRule: await getEffectiveFolderRule(project, { id: doc.parent_id }),
      })),
    );

    openModal({
      component: NamingConflictModal,
      props: {
        project,
        documents: documentsWithRule,
        allFolders: getAllFolders(),
        rule: null,
        showRulesByGroup: true,
        onClose: closeModal,
        onConfirm,
      },
    });
  };

  return {
    openNamingConflictModal,
    openNamingConflictModalByFolder,
  };
}
