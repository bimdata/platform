import apiClient from "./api-client";

class SpaceService {
  fetchUserSpaces() {
    return apiClient.collaborationApi.getClouds();
  }

  fetchSpaceUsers(space) {
    return apiClient.collaborationApi.getCloudUsers({
      cloudPk: space.id
    });
  }

  fetchSpaceInvitations(space) {
    return apiClient.collaborationApi.getCloudInvitations({
      cloudPk: space.id
    });
  }

  createSpace(space) {
    return apiClient.collaborationApi.createCloud({
      data: space
    });
  }

  updateSpace(space) {
    return apiClient.collaborationApi.updateCloud({
      id: space.id,
      data: {
        name: space.name
      }
    });
  }

  removeSpaceImage(space) {
    return fetch(`${apiClient.config.basePath}/cloud/${space.id}`, {
      method: "PATCH",
      headers: {
        Authorization: apiClient.config.accessToken(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: null
      })
    }).then(res => res.json());
  }

  deleteSpace(space) {
    return apiClient.collaborationApi.deleteCloud({
      id: space.id
    });
  }

  sendSpaceInvitation(space, email) {
    return apiClient.collaborationApi.inviteCloudUser({
      cloudPk: space.id,
      data: {
        email,
        redirectUri: `${process.env.VUE_APP_BASE_URL}/spaces/${space.id}`
      }
    });
  }

  cancelSpaceInvitation(space, invitation) {
    return apiClient.collaborationApi.cancelCloudUserInvitation({
      cloudPk: space.id,
      id: invitation.id
    });
  }
}

const service = new SpaceService();

export default service;
