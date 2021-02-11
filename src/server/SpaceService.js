import apiClient from "./api-client";

class SpaceService {
  constructor() {
    this.data = {
      spaces: undefined,
      spaceUsers: undefined
    };
  }

  async fetchUserSpaces(options = {}) {
    if (!this.data.spaces || options.forceFetch) {
      this.data.spaces = await apiClient.collaborationApi.getClouds();
    }
    return this.data.spaces;
  }

  async fetchSpaceUsers(space, options = {}) {
    if (!this.data.spaceUsers || options.forceFetch) {
      this.data.spaceUsers = await apiClient.collaborationApi.getCloudUsers({
        cloudPk: space.id
      });
    }
    return this.data.spaceUsers;
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
}

const service = new SpaceService();

export default service;
