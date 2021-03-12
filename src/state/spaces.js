import { reactive, readonly, toRefs } from "vue";
import SpaceService from "@/server/SpaceService";
import { useUser } from "@/state/user";

const state = reactive({
  userSpaces: [],
  currentSpace: null,
  currentSpaceAdmins: [],
  currentSpaceUsers: [],
  currentSpaceInvitations: []
});

const loadUserSpaces = async () => {
  const { user } = useUser();
  const spaces = await SpaceService.fetchUserSpaces();
  state.userSpaces = spaces.map(space => ({
    ...space,
    isAdmin: user.value.clouds.some(
      role => role.cloud === space.id && role.role === 100
    )
  }));
  return state.userSpaces;
};

const loadSpaceUsers = async space => {
  const { user: currentUser } = useUser();
  let users = await SpaceService.fetchSpaceUsers(space);
  users = users.map(user => ({
    ...user,
    isSelf: user.id === currentUser.value.id
  }));
  state.currentSpaceAdmins = users.filter(user => user.cloudRole === 100);
  state.currentSpaceUsers = users.filter(user => user.cloudRole === 50);
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
  softDeleteSpace(space);
  return space;
};

const softDeleteSpace = space => {
  state.userSpaces = state.userSpaces.filter(s => s.id !== space.id);
  return space;
};

const selectSpace = id => {
  state.currentSpace = state.userSpaces.find(space => space.id === id) || null;
  return state.currentSpace;
};

const sendSpaceInvitation = async (space, invitation, options = {}) => {
  const newInvitation = await SpaceService.sendSpaceInvitation(
    space,
    invitation
  );
  if (!options.resend) {
    state.currentSpaceInvitations = [newInvitation].concat(
      state.currentSpaceInvitations
    );
  }
  return newInvitation;
};

const cancelSpaceInvitation = async (space, invitation) => {
  await SpaceService.cancelSpaceInvitation(space, invitation);
  state.currentSpaceInvitations = state.currentSpaceInvitations.filter(
    i => i.id !== invitation.id
  );
  return invitation;
};

const updateSpaceUser = async (space, user) => {
  const newUser = await SpaceService.updateSpaceUser(space, user);
  if (space.isAdmin) {
    state.currentSpaceAdmins = state.currentSpaceAdmins.map(u =>
      u.id === user.id ? newUser : u
    );
  } else {
    state.currentSpaceUsers = state.currentSpaceUsers.map(u =>
      u.id === user.id ? newUser : u
    );
  }
  return newUser;
};

const deleteSpaceUser = async (space, user) => {
  await SpaceService.deleteSpaceUser(space, user);
  if (space.isAdmin) {
    state.currentSpaceAdmins = state.currentSpaceAdmins.filter(
      u => u.id !== user.id
    );
  } else {
    state.currentSpaceUsers = state.currentSpaceUsers.filter(
      u => u.id !== user.id
    );
  }
  return user;
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
    softDeleteSpace,
    selectSpace,
    sendSpaceInvitation,
    cancelSpaceInvitation,
    updateSpaceUser,
    deleteSpaceUser
  };
}
