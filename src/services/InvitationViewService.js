import apiClient from "./api-client.js";
import { ERRORS, RuntimeError } from "./ErrorService.js";

class InvitationViewService {
  async fetchInvitations() {
    try {
      return await apiClient.collaborationApi.getUserInvitations();
    } catch (error) {
      throw new RuntimeError(ERRORS.INVITATION_VIEW_FETCH_ERROR, error);
    }
  }

  async acceptInvitation(invitation) {
    console.log("invitation", invitation);
    console.log("invitation.id", invitation.id);

    try {
      return await apiClient.collaborationApi.acceptUserInvitation(
        invitation.id
      );
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

  async deleteVisa(project, document, visa) {
    try {
      return await apiClient.collaborationApi.deleteVisa(
        project.cloud.id,
        document.id,
        visa.id,
        project.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.VISA_DELETE_ERROR, error);
    }
  }
}

const service = new InvitationViewService();

export default service;
