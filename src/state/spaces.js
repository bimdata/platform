import { reactive, readonly, toRefs } from "vue";
import SpaceService from "@/services/SpaceService.js";
import SubscriptionService from "@/services/SubscriptionService.js";
import { useOrganizations } from "@/state/organizations.js";
import { useUser } from "@/state/user.js";

const state = reactive({
  userSpaces: [],
  currentSpace: null,
  spaceInfo: {},
  spaceUsers: [],
  spaceInvitations: []
});

const loadUserSpaces = async () => {
  const { mapSpaces } = useUser();

  let spaces = await SpaceService.fetchUserSpaces();
  const freeSpaces = await SubscriptionService.fetchFreeSpaces();
  const freeSpacesIDs = freeSpaces.map(s => s.id);

  spaces = mapSpaces(spaces);
  spaces = spaces.map(space => ({
    ...space,
    isFree: freeSpacesIDs.includes(space.id)
  }));
  spaces.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  state.userSpaces = spaces;
  return spaces;
};

const loadSpaceInfo = async space => {
  const spaceInfo = await SubscriptionService.fetchSpaceInformation(space);
  state.spaceInfo = spaceInfo;
  return spaceInfo;
};

const loadSpaceUsers = async space => {
  const { mapUsers } = useUser();
  let users = [];
  if (space.isAdmin) {
    users = await SpaceService.fetchSpaceUsers(space);
    users = mapUsers(users);
    users.sort((a, b) =>
      `${a.firstname}${a.lastname}` < `${b.firstname}${b.lastname}` ? -1 : 1
    );
  }
  state.spaceUsers = users;
  return users;
};

const loadSpaceInvitations = async space => {
  let invitations = [];
  if (space.isAdmin) {
    invitations = await SpaceService.fetchSpaceInvitations(space);
  }
  state.spaceInvitations = invitations;
  return invitations;
};

const createSpace = async space => {
  const newSpace = await SpaceService.createSpace(space);
  softCreateSpace({ ...newSpace, isAdmin: true });
  return newSpace;
};

const softCreateSpace = space => {
  state.userSpaces = [space].concat(state.userSpaces);

  const { softCreateOrganizationSpace } = useOrganizations();
  softCreateOrganizationSpace(space);

  return space;
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

  const { softUpdateOrganizationSpace } = useOrganizations();
  softUpdateOrganizationSpace(space);

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

  const { softDeleteOrganizationSpace } = useOrganizations();
  softDeleteOrganizationSpace(space);

  return space;
};

const setCurrentSpace = id => {
  state.currentSpace = state.userSpaces.find(space => space.id === id) || null;
  return readonly(state.currentSpace);
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

export function useSpaces() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadUserSpaces,
    loadSpaceInfo,
    loadSpaceUsers,
    loadSpaceInvitations,
    createSpace,
    softCreateSpace,
    updateSpace,
    softUpdateSpace,
    removeSpaceImage,
    deleteSpace,
    softDeleteSpace,
    setCurrentSpace,
    sendSpaceInvitation,
    cancelSpaceInvitation,
    updateSpaceUser,
    deleteSpaceUser
  };
}
