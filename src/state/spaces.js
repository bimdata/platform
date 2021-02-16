import { reactive, readonly, toRefs } from "vue";
import SpaceService from "@/server/SpaceService";

const state = reactive({
  userSpaces: [],
  currentSpace: null,
  currentSpaceAdmins: [],
  currentSpaceUsers: []
});

const loadUserSpaces = async () => {
  state.userSpaces = await SpaceService.fetchUserSpaces();
  return state.userSpaces;
};

const loadSpaceUsers = async space => {
  const users = await SpaceService.fetchSpaceUsers(space);
  state.currentSpaceAdmins = users.filter(u => u.cloudRole === 100);
  state.currentSpaceUsers = users.filter(u => u.cloudRole === 50);
  return users;
};

const createSpace = async space => {
  const newSpace = await SpaceService.createSpace(space);
  state.userSpaces = [newSpace].concat(state.userSpaces);
  return newSpace;
};

const updateSpace = async space => {
  const newSpace = await SpaceService.updateSpace(space);
  softUpdateSpace(newSpace);
  return newSpace;
};

const softUpdateSpace = space => {
  state.userSpaces = state.userSpaces.map(s => (s.id === space.id ? space : s));
};

const removeSpaceImage = async space => {
  const newSpace = await SpaceService.removeSpaceImage(space);
  softUpdateSpace(newSpace);
  return newSpace;
};

const deleteSpace = async space => {
  await SpaceService.deleteSpace(space);
  state.userSpaces = state.userSpaces.filter(s => s.id !== space.id);
  return space;
};

const selectSpace = id => {
  state.currentSpace = state.userSpaces.find(s => s.id === id) || null;
  return state.currentSpace;
};

const inviteSpaceUser = async (space, email) => {
  const invitation = await SpaceService.inviteSpaceUser(space, email);
  return invitation;
};

export function useSpaces() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    loadUserSpaces,
    loadSpaceUsers,
    createSpace,
    updateSpace,
    softUpdateSpace,
    removeSpaceImage,
    deleteSpace,
    selectSpace,
    inviteSpaceUser
  };
}
