import { reactive, readonly, toRefs } from "vue";
import SpaceService from "../services/SpaceService.js";
import SubscriptionService from "../services/SubscriptionService.js";
import { sortSpaces } from "../utils/spaces.js";
import { sortUsers } from "../utils/users.js";

import { useOrganizations } from "./organizations.js";
import { useProjects } from "./projects.js";
import { useUser } from "./user.js";

const { loadUser, isSpaceAdmin } = useUser();
const { loadOrganizationSpaces } = useOrganizations();
const { loadUserProjects } = useProjects();

// ---

const state = reactive({
  userSpaces: [],
  freeSpaces: [],
  currentSpace: null,
  spaceSubInfo: {},
  spaceUsers: [],
  spaceInvitations: []
});

const setCurrentSpace = id => {
  state.currentSpace = state.userSpaces.find(space => space.id === id) || null;
  return readonly(state.currentSpace);
};

const loadUserSpaces = async () => {
  const spaces = await SpaceService.fetchUserSpaces();
  const freeSpaces = await SubscriptionService.fetchFreeSpaces();
  state.userSpaces = sortSpaces(spaces);
  state.freeSpaces = freeSpaces;
  return spaces;
};

const loadSpaceSubInfo = async space => {
  const spaceSubInfo = await SubscriptionService.fetchSpaceSubInfo(space);
  state.spaceSubInfo = spaceSubInfo;
  return spaceSubInfo;
};

const loadSpaceUsers = async space => {
  let users = [];
  if (isSpaceAdmin(space)) {
    users = await SpaceService.fetchSpaceUsers(space);
    users = sortUsers(users);
  }
  state.spaceUsers = users;
  return users;
};

const loadSpaceInvitations = async space => {
  let invitations = [];
  if (isSpaceAdmin(space)) {
    invitations = await SpaceService.fetchSpaceInvitations(space);
  }
  state.spaceInvitations = invitations;
  return invitations;
};

const createSpace = async space => {
  const newSpace = await SpaceService.createSpace(space);

  await loadUser();
  await loadUserSpaces();
  await loadOrganizationSpaces(space.organization);

  return newSpace;
};

const updateSpace = async space => {
  const newSpace = await SpaceService.updateSpace(space);

  await loadUserSpaces();
  await loadOrganizationSpaces(space.organization);

  return newSpace;
};

const removeSpaceImage = async space => {
  const newSpace = await SpaceService.removeSpaceImage(space);

  await loadUserSpaces();
  await loadOrganizationSpaces(space.organization);

  return newSpace;
};

const deleteSpace = async space => {
  await SpaceService.deleteSpace(space);

  await loadUser();
  await loadUserSpaces();
  await loadOrganizationSpaces(space.organization);
  await loadUserProjects();

  return space;
};

const sendSpaceInvitation = async (space, invitation, options = {}) => {
  const newInvitation = await SpaceService.sendSpaceInvitation(
    space,
    invitation
  );
  if (!options.resend) {
    state.spaceInvitations = [newInvitation].concat(state.spaceInvitations);
  }
  return newInvitation;
};

const cancelSpaceInvitation = async (space, invitation) => {
  await SpaceService.cancelSpaceInvitation(space, invitation);
  state.spaceInvitations = state.spaceInvitations.filter(
    i => i.id !== invitation.id
  );
  return invitation;
};

const updateSpaceUser = async (space, user) => {
  const newUser = await SpaceService.updateSpaceUser(space, user);
  state.spaceUsers = state.spaceUsers.map(u =>
    u.id === user.id ? { ...u, ...newUser } : u
  );
  return newUser;
};

const deleteSpaceUser = async (space, user) => {
  await SpaceService.deleteSpaceUser(space, user);
  state.spaceUsers = state.spaceUsers.filter(u => u.id !== user.id);
  return user;
};

const isFreeSpace = space => {
  return !!state.freeSpaces.find(s => s.id === space.id);
};

export function useSpaces() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    setCurrentSpace,
    loadUserSpaces,
    loadSpaceSubInfo,
    loadSpaceUsers,
    loadSpaceInvitations,
    createSpace,
    updateSpace,
    removeSpaceImage,
    deleteSpace,
    sendSpaceInvitation,
    cancelSpaceInvitation,
    updateSpaceUser,
    deleteSpaceUser,
    isFreeSpace,
  };
}
