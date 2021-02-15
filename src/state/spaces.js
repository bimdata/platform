import { reactive, readonly, toRefs } from "vue";
import SpaceService from "@/server/SpaceService";

const state = reactive({
  spaces: [],
  currentSpace: null,
  currentSpaceAdmins: [],
  currentSpaceUsers: []
});

const loadSpaces = async () => {
  state.spaces = await SpaceService.fetchUserSpaces();
  return state.spaces;
};

const loadSpaceUsers = async space => {
  const users = await SpaceService.fetchSpaceUsers(space);
  state.currentSpaceAdmins = users.filter(u => u.cloudRole === 100);
  state.currentSpaceUsers = users.filter(u => u.cloudRole === 50);
  return users;
};

const createSpace = async space => {
  const newSpace = await SpaceService.createSpace(space);
  state.spaces = [newSpace].concat(state.spaces);
  return newSpace;
};

const updateSpace = async space => {
  const newSpace = await SpaceService.updateSpace(space);
  softUpdateSpace(newSpace);
  return newSpace;
};

const softUpdateSpace = space => {
  state.spaces = state.spaces.map(s => (s.id === space.id ? space : s));
};

const removeSpaceImage = async space => {
  const newSpace = await SpaceService.removeSpaceImage(space);
  softUpdateSpace(newSpace);
  return newSpace;
};

const deleteSpace = async space => {
  await SpaceService.deleteSpace(space);
  state.spaces = state.spaces.filter(s => s.id !== space.id);
  return space;
};

const selectSpace = id => {
  state.currentSpace = state.spaces.find(s => s.id === id) || null;
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
    loadSpaces,
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
