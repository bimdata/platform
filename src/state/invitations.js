import eachLimit from "async/eachLimit";
import { reactive, readonly, toRefs } from "vue";
import { INVITATION_STATUS } from "../config/invitation.js";
import UserService from "../services/UserService.js";

import { useUser } from "./user.js";
import { useSpaces } from "./spaces.js";
import { useProjects } from "./projects.js";

const { loadUser } = useUser();
const { loadUserSpaces } = useSpaces();
const { loadUserProjects } = useProjects();

const state = reactive({
  invitations: [],
  pendingInvitations: []
});

const loadUserInvitations = async () => {
  state.invitations = await UserService.fetchUserInvitations().then(
    res => res.sort((a, b) => (a.id > b.id ? -1 : 1))
  );
  state.pendingInvitations = state.invitations.filter(
    invit => invit.status === INVITATION_STATUS.PENDING
  );
};

const acceptInvitations = async invitations => {
  await eachLimit(
    invitations,
    20,
    UserService.acceptInvitation
  );
  await loadUser();
  await Promise.all([loadUserSpaces(), loadUserProjects()]);
  await loadUserInvitations();
};

const declineInvitation = async invitation => {
  await UserService.declineInvitation(invitation);
  await loadUserInvitations();
};

export function useInvitations() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadUserInvitations,
    acceptInvitations,
    declineInvitation
  };
}
