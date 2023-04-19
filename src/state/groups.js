import { reactive, readonly, toRefs } from "vue";
import GroupService from "../services/GroupService.js";

const state = reactive({
  projectGroups: [],
  currentGroup: null
});

const setCurrentGroup = id => {
  state.currentGroup =
    state.projectGroups.find(group => group.id === id) || null;
  return readonly(state.currentGroup);
};

const loadProjectGroups = async project => {
  let groups = [];
  if (project.isAdmin) {
    groups = await GroupService.fetchProjectGroups(project);
    groups.sort((a, b) => (a.id < b.id ? 1 : -1));
  }
  state.projectGroups = groups;
  return groups;
};

const createGroup = async (project, group) => {
  const newGroup = await GroupService.createGroup(project, group);
  await loadProjectGroups(project);
  return newGroup;
};

const updateGroup = async (project, group) => {
  const newGroup = await GroupService.updateGroup(project, group);
  await loadProjectGroups(project);
  return newGroup;
};

const importGroup = async (project, groupIds) => {
  const importedGroups = await GroupService.importGroup(project, groupIds);
  await loadProjectGroups(project);
  return importedGroups;
};

const addGroupMembers = async (project, group, membersToAdd) => {
  const addedMembers = await GroupService.addGroupMembers(
    project,
    group,
    membersToAdd
  );
  await loadProjectGroups(project);
  return addedMembers;
};

const removeGroupMembers = async (project, group, membersToRemove) => {
  const removedMembers = await GroupService.removeGroupMembers(
    project,
    group,
    membersToRemove
  );
  await loadProjectGroups(project);
  return removedMembers;
};

const updateGroupMembers = async (project, group, members) => {
  const oldMemberIDs = group.members.map(member => member.id);
  const newMemberIDs = members.map(member => member.id);

  // Add members that are in new list but were not in old list
  const membersToAdd = members.filter(
    member => !oldMemberIDs.includes(member.id)
  );
  const addedMembers = await GroupService.addGroupMembers(
    project,
    group,
    membersToAdd
  );

  // Remove members that were in old list but are not in new list
  const membersToRemove = group.members.filter(
    member => !newMemberIDs.includes(member.id)
  );
  const removedMembers = await GroupService.removeGroupMembers(
    project,
    group,
    membersToRemove
  );

  await loadProjectGroups(project);
  return { addedMembers, removedMembers };
};

const updateGroupPermission = GroupService.updateGroupPermission;

const deleteGroup = async (project, group) => {
  await GroupService.deleteGroup(project, group);
  await loadProjectGroups(project);
  return group;
};

export function useGroups() {
  const readOnlyState = readonly(state);
  return {
    // References
    ...toRefs(readOnlyState),
    // Methods
    setCurrentGroup,
    loadProjectGroups,
    createGroup,
    updateGroup,
    importGroup,
    addGroupMembers,
    removeGroupMembers,
    updateGroupMembers,
    updateGroupPermission,
    deleteGroup
  };
}
