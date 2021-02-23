import { reactive, readonly, toRefs } from "vue";
import SpaceService from "@/server/SpaceService";

const state = reactive({
  userSpaces: [],
  currentSpace: null,
  currentSpaceAdmins: [],
  currentSpaceUsers: [],
  currentSpaceInvitations: []
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

const loadSpaceInvitations = async space => {
  const invitations = await SpaceService.fetchSpaceInvitations(space);
  state.currentSpaceInvitations = invitations;
  return state.currentSpaceInvitations;
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

const sendSpaceInvitation = async (space, email) => {
  const invitation = await SpaceService.sendSpaceInvitation(space, email);
  state.currentSpaceInvitations = [invitation].concat(
    state.currentSpaceInvitations
  );
  return invitation;
};

const cancelSpaceInvitation = async (space, invitation) => {
  await SpaceService.cancelSpaceInvitation(space, invitation);
  state.currentSpaceInvitations = state.currentSpaceInvitations.filter(
    i => i.id !== invitation.id
  );
  return invitation;
};

export function useSpaces() {
  const readonlyState = readonly(state);
  return {
    ...toRefs(readonlyState),
    loadUserSpaces,
    loadSpaceUsers,
    loadSpaceInvitations,
    createSpace,
    updateSpace,
    softUpdateSpace,
    removeSpaceImage,
    deleteSpace,
    selectSpace,
    sendSpaceInvitation,
    cancelSpaceInvitation
  };
}
