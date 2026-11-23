import { useAppModal } from "../components/specific/app/app-modal/app-modal.js";
import NamingConflictModal from "../components/specific/files/naming-constraint/NamingConflictModal.vue";
import { useNamingConstraints } from "../state/naming-constraints.js";
import { matchName } from "../utils/naming-constraint.js";

/**
 * Check files against the naming constraint of their destination folder before uploading them.
 *
 * When some files don't match the folder rule, the naming conflict modal is opened so the user can rename (or drop) them. Renaming is done locally, nothing is persisted: the returned files are the ones to upload.
 */
export function useNamingConstraintUpload() {
  const { openModal, closeModal } = useAppModal();
  const { getEffectiveFolderRule } = useNamingConstraints();

  /**
   * @param {Object} project
   * @param {Object} folder destination folder
   * @param {File[]} files
   * @returns {Promise<File[]|null>} files to upload (renamed when needed), or `null` if the user cancelled.
   */
  const checkFilesNaming = async (project, folder, files) => {
    const rule = await getEffectiveFolderRule(project, folder);
    if (!rule) return files;

    const validFiles = files.filter((file) => matchName(file.name, rule));
    const invalidFiles = files.filter((file) => !matchName(file.name, rule));
    if (invalidFiles.length === 0) return files;

    return new Promise((resolve) => {
      let settled = false;
      const settle = (value) => {
        if (settled) return;
        settled = true;
        resolve(value);
      };

      openModal({
        component: NamingConflictModal,
        props: {
          project,
          documents: invalidFiles.map((file, i) => ({ id: `upload-${i}`, name: file.name })),
          rule,
          allFolders: [],
          persistChanges: false,
          onClose: () => {
            closeModal();
            settle(null);
          },
          onConfirm: ({ renamed, deleted }) => {
            const deletedIds = new Set(deleted.map((d) => d.id));
            const renamedById = new Map(renamed.map((r) => [r.id, r.name]));
            const fixedFiles = invalidFiles
              .map((file, i) => ({ file, id: `upload-${i}` }))
              .filter(({ id }) => !deletedIds.has(id))
              .map(({ file, id }) => {
                const name = renamedById.get(id);
                return name ? new File([file], name, { type: file.type }) : file;
              });
            settle([...validFiles, ...fixedFiles]);
          },
        },
      });
    });
  };

  return {
    checkFilesNaming,
  };
}
