import { apiClient, backendClient } from "./api-client.js";
import { ERRORS, RuntimeError } from "./ErrorService.js";

class UserService {
  fetchUserData() {
    return apiClient.collaborationApi.getSelfUser();
  }

  async fetchUserInvitations() {
    try {
      return await apiClient.collaborationApi.getUserInvitations();
    } catch (error) {
      throw new RuntimeError(ERRORS.INVITATION_VIEW_FETCH_ERROR, error);
    }
  }

  async acceptInvitation(invitation) {
    try {
      await apiClient.collaborationApi.acceptUserInvitation(invitation.id);
    } catch (error) {
      throw new RuntimeError(ERRORS.INVITATION_VIEW_ACCEPT_ERROR, error);
    }
  }

  async declineInvitation(invitation) {
    try {
      return await apiClient.collaborationApi.denyUserInvitation(invitation.id);
    } catch (error) {
      throw new RuntimeError(ERRORS.INVITATION_VIEW_DECLINE_ERROR, error);
    }
  }

  async fetchUserFavorites() {
    try {
      return await backendClient.get("/fav/");
    } catch (error) {
      console.error(error);
      return {
        cloud_ids: [],
        project_ids: []
      };
    }
  }

  addFavoriteSpace(space) {
    return backendClient.post("/fav/clouds/", { cloud_id: space.id });
  }

  removeFavoriteSpace(space) {
    return backendClient.delete(`/fav/clouds/${space.id}/`);
  }

  addFavoriteProject(project) {
    return backendClient.post("/fav/projects/", { project_id: project.id });
  }

  removeFavoriteProject(project) {
    return backendClient.delete(`/fav/projects/${project.id}/`);
  }

  async fetchGuidedTours() {
    try {
      return await backendClient.get("/guidedtour/");
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  setGuidedTourComplete(tour) {
    return backendClient.post("/guidedtour/", { name: tour });
  }
}

const service = new UserService();

export default service;
