import { reactive, readonly, toRefs } from "vue";
import NamingConstraintService, {
  NamingConstraintConflictError
} from "../services/NamingConstraintService.js";

const state = reactive({
  namingConstraints: [],
  namingPartsTemplates: []
});

// In-memory cache of effective folder rules, keyed by folder id, to avoid
// re-fetching the rule on every rename/upload within the same folder.
const folderRuleCache = new Map();

// --- Naming constraints catalog --------------------------------------------

const loadNamingConstraints = async project => {
  const constraints = await NamingConstraintService.fetchNamingConstraints(
    project
  );
  state.namingConstraints = constraints;
  return constraints;
};

const createNamingConstraint = async (project, payload) => {
  const constraint = await NamingConstraintService.createNamingConstraint(
    project,
    payload
  );
  state.namingConstraints = [...state.namingConstraints, constraint];
  return constraint;
};

const updateNamingConstraint = async (project, constraint, payload) => {
  const updated = await NamingConstraintService.updateNamingConstraint(
    project,
    constraint,
    payload
  );
  state.namingConstraints = state.namingConstraints.map(item =>
    item.id === updated.id ? updated : item
  );
  return updated;
};

const deleteNamingConstraint = async (project, constraint) => {
  await NamingConstraintService.deleteNamingConstraint(project, constraint);
  state.namingConstraints = state.namingConstraints.filter(
    item => item.id !== constraint.id
  );
};

// --- Naming parts templates ------------------------------------------------

const loadNamingPartsTemplates = async project => {
  const templates = await NamingConstraintService.fetchNamingPartsTemplates(
    project
  );
  state.namingPartsTemplates = templates;
  return templates;
};

const createNamingPartsTemplate = async (project, payload) => {
  const template = await NamingConstraintService.createNamingPartsTemplate(
    project,
    payload
  );
  state.namingPartsTemplates = [...state.namingPartsTemplates, template];
  return template;
};

const updateNamingPartsTemplate = async (project, template, payload) => {
  const updated = await NamingConstraintService.updateNamingPartsTemplate(
    project,
    template,
    payload
  );
  state.namingPartsTemplates = state.namingPartsTemplates.map(item =>
    item.id === updated.id ? updated : item
  );
  return updated;
};

const deleteNamingPartsTemplate = async (project, template) => {
  await NamingConstraintService.deleteNamingPartsTemplate(project, template);
  state.namingPartsTemplates = state.namingPartsTemplates.filter(
    item => item.id !== template.id
  );
};

// --- Folder naming constraint ----------------------------------------------

const fetchFolderNamingConstraint = async (project, folder) => {
  return NamingConstraintService.fetchFolderNamingConstraint(project, folder);
};

const setFolderNamingConstraint = async (project, folder, payload) => {
  const result = await NamingConstraintService.setFolderNamingConstraint(
    project,
    folder,
    payload
  );
  folderRuleCache.clear();
  return result;
};

const deleteFolderNamingConstraint = async (project, folder) => {
  const result = await NamingConstraintService.deleteFolderNamingConstraint(
    project,
    folder
  );
  folderRuleCache.clear();
  return result;
};

// Resolve the effective naming rule applying to a folder, with its `strict`
// flag. Returns null when no rule applies. Results are cached per folder id.
const getEffectiveFolderRule = async (project, folder) => {
  if (!folder?.id) return null;
  if (folderRuleCache.has(folder.id)) {
    return folderRuleCache.get(folder.id);
  }
  const folderConstraint = await NamingConstraintService.fetchFolderNamingConstraint(
    project,
    folder
  );
  const constraint = folderConstraint?.constraint ?? null;
  const effective = constraint
    ? { rule: constraint.rule, strict: constraint.strict, name: constraint.name }
    : null;
  folderRuleCache.set(folder.id, effective);
  return effective;
};

// --- Conflicting documents -------------------------------------------------

const fetchConflictingDocuments = async project => {
  return NamingConstraintService.fetchConflictingDocuments(project);
};

export { NamingConstraintConflictError };

export function useNamingConstraints() {
  const readOnlyState = readonly(state);
  return {
    // References
    ...toRefs(readOnlyState),
    // Methods
    loadNamingConstraints,
    createNamingConstraint,
    updateNamingConstraint,
    deleteNamingConstraint,
    loadNamingPartsTemplates,
    createNamingPartsTemplate,
    updateNamingPartsTemplate,
    deleteNamingPartsTemplate,
    fetchFolderNamingConstraint,
    setFolderNamingConstraint,
    deleteFolderNamingConstraint,
    getEffectiveFolderRule,
    fetchConflictingDocuments
  };
}
