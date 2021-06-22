import { reactive, readonly, toRefs } from "vue";
import GroupService from "@/server/GroupService";

const state = reactive({
  projectGroups: [],
  currentGroup: null
});

const loadProjectGroups = async project => {
  const groups = await GroupService.fetchProjectGroups(project);
  state.projectGroups = groups;
  return groups;
};

const createGroup = async (project, group) => {
  const newGroup = await GroupService.createGroup(project, group);
  state.projectGroups = [newGroup].concat(state.projectGroups);
  return newGroup;
};

const updateGroup = async (project, group) => {
  const newGroup = await GroupService.updateGroup(project, group);
  softUpdateGroup(newGroup);
  return newGroup;
};

const softUpdateGroup = group => {
  state.projectGroups = state.projectGroups.map(g =>
    g.id === group.id ? { ...g, ...group } : g
  );
  return group;
};

const deleteGroup = async (project, group) => {
  await GroupService.deleteGroup(project, group);
  softDeleteGroup(group);
  return group;
};

const softDeleteGroup = group => {
  state.projectGroups = state.projectGroups.filter(g => g.id !== group.id);
  return group;
};

const selectGroup = id => {
  state.currentGroup =
    state.projectGroups.find(group => group.id === id) || null;
  return readonly(state.currentGroup);
};

export function useGroups() {
  const readOnlyState = readonly(state);
  return {
    // References
    ...toRefs(readOnlyState),
    // Methods
    loadProjectGroups,
    createGroup,
    updateGroup,
    softUpdateGroup,
    deleteGroup,
    softDeleteGroup,
    selectGroup
  };
}
