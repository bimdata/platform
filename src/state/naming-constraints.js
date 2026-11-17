import { reactive, readonly, toRefs } from "vue";
import NamingConstraintService from "../services/NamingConstraintService.js";

const state = reactive({
  namingConstraints: [],
  namingPartLists: [],
});

// --- Naming constraints catalog --------------------------------------------

const loadNamingConstraints = async (project) => {
  const constraints = await NamingConstraintService.fetchNamingConstraints(project);
  state.namingConstraints = constraints;
  return constraints;
};

const createNamingConstraint = async (project, payload) => {
  const constraint = await NamingConstraintService.createNamingConstraint(project, payload);
  state.namingConstraints = [...state.namingConstraints, constraint];
  return constraint;
};

const updateNamingConstraint = async (project, constraint, payload) => {
  const updated = await NamingConstraintService.updateNamingConstraint(
    project,
    constraint,
    payload,
  );
  state.namingConstraints = state.namingConstraints.map((item) =>
    item.id === updated.id ? updated : item,
  );
  return updated;
};

const deleteNamingConstraint = async (project, constraint) => {
  await NamingConstraintService.deleteNamingConstraint(project, constraint);
  state.namingConstraints = state.namingConstraints.filter((item) => item.id !== constraint.id);
};

// --- Naming part lists (value lists) ---------------------------------------

const loadNamingPartLists = async (project) => {
  const partLists = await NamingConstraintService.fetchNamingPartLists(project);
  state.namingPartLists = partLists;
  return partLists;
};

const createNamingPartList = async (project, payload) => {
  const partList = await NamingConstraintService.createNamingPartList(project, payload);
  state.namingPartLists = [...state.namingPartLists, partList];
  return partList;
};

const updateNamingPartList = async (project, partList, payload) => {
  const updated = await NamingConstraintService.updateNamingPartList(project, partList, payload);
  state.namingPartLists = state.namingPartLists.map((item) =>
    item.id === updated.id ? updated : item,
  );
  return updated;
};

const deleteNamingPartList = async (project, partList) => {
  await NamingConstraintService.deleteNamingPartList(project, partList);
  state.namingPartLists = state.namingPartLists.filter((item) => item.id !== partList.id);
};

// --- Folder naming constraint ----------------------------------------------
const fetchFolderNamingConstraint = async (project, folder) => {
  return NamingConstraintService.fetchFolderNamingConstraint(project, folder);
};

const setFolderNamingConstraint = async (project, folder, payload) => {
  return NamingConstraintService.setFolderNamingConstraint(project, folder, payload);
};

const deleteFolderNamingConstraint = async (project, folder) => {
  return NamingConstraintService.deleteFolderNamingConstraint(project, folder);
};

const getEffectiveFolderRule = async (project, folder) => {
  return NamingConstraintService.getEffectiveFolderRule(project, folder);
};

// --- Conflicting documents -------------------------------------------------

const fetchConflictingDocuments = async (project) => {
  return NamingConstraintService.fetchConflictingDocuments(project);
};

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
    loadNamingPartLists,
    createNamingPartList,
    updateNamingPartList,
    deleteNamingPartList,
    fetchFolderNamingConstraint,
    setFolderNamingConstraint,
    deleteFolderNamingConstraint,
    getEffectiveFolderRule,
    fetchConflictingDocuments,
  };
}
