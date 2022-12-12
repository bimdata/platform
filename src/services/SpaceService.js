import apiClient from "./api-client.js";
import { ERRORS, ErrorService, RuntimeError } from "./ErrorService.js";

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
      return await apiClient.collaborationApi.getCloud(id);
    } catch (error) {
      ErrorService.handleError(error);
      return null;
    }
  }

  async fetchSpaceSize(space) {
    try {
      return await apiClient.collaborationApi.getCloudSize(space.id);
    } catch (error) {
      ErrorService.handleError(error);
      return {};
    }
  }

  async fetchSpaceUsers(space) {
    try {
      return await apiClient.collaborationApi.getCloudUsers(space.id);
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.USERS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async fetchSpaceInvitations(space) {
    try {
      return await apiClient.collaborationApi.getCloudInvitations(space.id);
    } catch (error) {
      ErrorService.handleError(
        new RuntimeError(ERRORS.INVITATIONS_FETCH_ERROR, error)
      );
      return [];
    }
  }

  async createSpace(space) {
    try {
      return await apiClient.collaborationApi.createCloud(space);
    } catch (error) {
      throw new RuntimeError(ERRORS.SPACE_CREATE_ERROR, error);
    }
  }

  async updateSpace(space) {
    try {
      return await apiClient.collaborationApi.updateCloud(space.id, {
        name: space.name
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
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...apiClient.authHeader
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
      return await apiClient.collaborationApi.deleteCloud(space.id);
    } catch (error) {
      throw new RuntimeError(ERRORS.SPACE_DELETE_ERROR, error);
    }
  }

  async sendSpaceInvitation(space, invitation) {
    try {
      return await apiClient.collaborationApi.inviteCloudUser(space.id, {
        email: invitation.email,
        redirect_uri: `${process.env.VUE_APP_BASE_URL}/spaces/${space.id}`
      });
    } catch (error) {
      if (error.status === 400 && (await error.json()).already_exists) {
        throw new RuntimeError(ERRORS.USER_ALREADY_EXISTS_ERROR, error);
      } else {
        throw new RuntimeError(ERRORS.INVITATION_SEND_ERROR, error);
      }
    }
  }

  async cancelSpaceInvitation(space, invitation) {
    try {
      return await apiClient.collaborationApi.cancelCloudUserInvitation(
        space.id,
        invitation.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.INVITATION_CANCEL_ERROR, error);
    }
  }

  async updateSpaceUser(space, user) {
    try {
      return await apiClient.collaborationApi.updateCloudUser(
        space.id,
        user.id,
        user
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.USER_UPDATE_ERROR, error);
    }
  }

  async deleteSpaceUser(space, user) {
    try {
      return await apiClient.collaborationApi.deleteCloudUser(
        space.id,
        user.id
      );
    } catch (error) {
      throw new RuntimeError(ERRORS.USER_DELETE_ERROR, error);
    }
  }
}

const service = new SpaceService();

export default service;
