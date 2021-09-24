import apiClient from "./api-client";
import { ERRORS, ErrorService, RuntimeError } from "./ErrorService";

class SpaceService {
  async fetchUserSpaces() {
    try {
      return await apiClient.collaborationApi.getClouds();
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.SPACES_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async fetchSpaceByID(id) {
    try {
      return await apiClient.collaborationApi.getCloud({ id });
    } catch (error) {
      ErrorService.handleError(error);
      return null;
    }
  }

  async fetchSpaceUsers(space) {
    try {
      return await apiClient.collaborationApi.getCloudUsers({
        cloudPk: space.id
      });
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.USERS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async fetchSpaceInvitations(space) {
    try {
      return await apiClient.collaborationApi.getCloudInvitations({
        cloudPk: space.id
      });
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.INVITATIONS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async createSpace(space) {
    try {
      return await apiClient.collaborationApi.createCloud({
        data: space
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.SPACE_CREATE_ERROR, error);
    }
  }

  async updateSpace(space) {
    try {
      return await apiClient.collaborationApi.updateCloud({
        id: space.id,
        data: {
          name: space.name
        }
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.SPACE_UPDATE_ERROR, error);
    }
  }

  async removeSpaceImage(space) {
    try {
      const response = await fetch(
        `${apiClient.config.basePath}/cloud/${space.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: apiClient.config.accessToken(),
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            image: null
          })
        }
      );
      return await response.json();
    } catch (error) {
      throw new RuntimeError(ERRORS.SPACE_IMAGE_DELETE_ERROR, error);
    }
  }

  async deleteSpace(space) {
    try {
      return await apiClient.collaborationApi.deleteCloud({
        id: space.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.SPACE_DELETE_ERROR, error);
    }
  }

  async sendSpaceInvitation(space, invitation) {
    try {
      return await apiClient.collaborationApi.inviteCloudUser({
        cloudPk: space.id,
        data: {
          email: invitation.email,
          redirectUri: `${process.env.VUE_APP_BASE_URL}/spaces/${space.id}`
        }
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.INVITATION_SEND_ERROR, error);
    }
  }

  async cancelSpaceInvitation(space, invitation) {
    try {
      return await apiClient.collaborationApi.cancelCloudUserInvitation({
        cloudPk: space.id,
        id: invitation.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.INVITATION_CANCEL_ERROR, error);
    }
  }

  async updateSpaceUser(space, user) {
    try {
      // TODO: API model should be updated to return
      // user data instead of role value.
      await apiClient.collaborationApi.updateCloudUser({
        cloudPk: space.id,
        id: user.id,
        data: user
      });
      return {
        ...user,
        role: undefined
      };
    } catch (error) {
      throw new RuntimeError(ERRORS.USER_UPDATE_ERROR, error);
    }
  }

  async deleteSpaceUser(space, user) {
    try {
      return await apiClient.collaborationApi.deleteCloudUser({
        cloudPk: space.id,
        id: user.id
      });
    } catch (error) {
      throw new RuntimeError(ERRORS.USER_DELETE_ERROR, error);
    }
  }
}

const service = new SpaceService();

export default service;
