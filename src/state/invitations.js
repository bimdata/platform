import async from "async";
import { reactive, readonly, toRefs } from "vue";

import { INVITATION_STATUS } from "../config/invitation.js";
import InvitationViewService from "../services/InvitationViewService.js";

import { useUser } from "./user.js";
import { useSpaces } from "./spaces.js";
import { useProjects } from "./projects.js";

const { loadUser } = useUser();
const { loadUserSpaces } = useSpaces();
const { loadUserProjects } = useProjects();

const state = reactive({
  invitationList: [],
  invitationListPending: []
});

const loadUserInvitation = async () => {
  state.invitationList = await InvitationViewService.fetchInvitations();
  state.invitationListPending = state.invitationList.filter(
    invit => invit.status === INVITATION_STATUS.PENDING
  );
};

const acceptInvitations = async invitations => {
  await async.eachLimit(
    invitations,
    20,
    InvitationViewService.acceptInvitation
  );
  await loadUser();
  await Promise.all([loadUserSpaces(), loadUserProjects()]);
  await loadUserInvitation();
};

const denyInvitation = async invitation => {
  await InvitationViewService.denyInvitation(invitation);
  await loadUserInvitation();
};

export function useInvitations() {
  const readonlyState = readonly(state);
  return {
    // References
    ...toRefs(readonlyState),
    // Methods
    loadUserInvitation,
    acceptInvitations,
    denyInvitation
  };
}
