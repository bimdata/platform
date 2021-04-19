import { reactive, readonly, toRefs } from "vue";
import SpaceService from "@/server/SpaceService";
import { useUser } from "@/state/user";
import { SPACE_ROLE } from "@/utils/users";

const state = reactive({
  userSpaces: [],
  currentSpace: null,
  currentSpaceUsers: [],
  currentSpaceInvitations: []
});

const loadUserSpaces = async () => {
  const { user } = useUser();
  let spaces = await SpaceService.fetchUserSpaces();
  spaces = spaces.map(space => ({
    ...space,
    isAdmin: user.value.clouds.some(
      role => role.cloud === space.id && role.role === SPACE_ROLE.ADMIN
    )
  }));
  spaces = spaces.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  state.userSpaces = spaces;
  return spaces;
};

const loadSpaceUsers = async space => {
  const { user: currentUser } = useUser();
  let users = await SpaceService.fetchSpaceUsers(space);
  users = users.map(user => ({
    ...user,
    isSelf: user.id === currentUser.value.id
  }));
  users = users
    .slice()
    .sort((a, b) =>
      `${a.firstname}${a.lastname}` < `${b.firstname}${b.lastname}` ? -1 : 1
    );
  state.currentSpaceUsers = users;
  return users;
};

const loadSpaceInvitations = async space => {
  const invitations = await SpaceService.fetchSpaceInvitations(space);
  state.currentSpaceInvitations = invitations;
  return invitations;
};

const createSpace = async space => {
  const newSpace = await SpaceService.createSpace(space);
  state.userSpaces = [{ ...newSpace, isAdmin: true }].concat(state.userSpaces);
  return newSpace;
};

const updateSpace = async space => {
  const newSpace = await SpaceService.updateSpace(space);
  softUpdateSpace(newSpace);
  return newSpace;
};

const softUpdateSpace = space => {
  state.userSpaces = state.userSpaces.map(s =>
    s.id === space.id ? { ...s, ...space } : s
  );
  return space;
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
  return readonly(state.currentSpace);
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
  state.currentSpaceUsers = state.currentSpaceUsers.map(u =>
    u.id === user.id ? newUser : u
  );
  return newUser;
};

const deleteSpaceUser = async (space, user) => {
  await SpaceService.deleteSpaceUser(space, user);
  state.currentSpaceUsers = state.currentSpaceUsers.filter(
    u => u.id !== user.id
  );
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
