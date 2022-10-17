import apiClient from "./api-client.js";
import { ERRORS, RuntimeError } from "./ErrorService.js";

import { useUser } from "../state/user.js";
import { useSpaces } from "../state/spaces.js";
import { useProjects } from "../state/projects.js";

class InvitationViewService {
  async fetchInvitations() {
    try {
      return await apiClient.collaborationApi.getUserInvitations();
    } catch (error) {
      throw new RuntimeError(ERRORS.INVITATION_VIEW_FETCH_ERROR, error);
    }
  }

  async acceptInvitation(invitation) {
    const { loadUser } = useUser();
    const { loadUserSpaces } = useSpaces();
    const { loadUserProjects } = useProjects();

    try {
      await apiClient.collaborationApi.acceptUserInvitation(invitation.id);
      await loadUser();
      return Promise.all([loadUserSpaces, loadUserProjects]);
    } catch (error) {
      throw new RuntimeError(ERRORS.INVITATION_VIEW_ACCEPT_ERROR, error);
    }
  }

  async denyInvitation(invitation) {
    try {
      return await apiClient.collaborationApi.denyUserInvitation(invitation.id);
    } catch (error) {
      throw new RuntimeError(ERRORS.INVITATION_VIEW_DENY_ERROR, error);
    }
  }
}

const service = new InvitationViewService();

export default service;
