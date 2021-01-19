import apiClient from './index';

class SpacesService {

  fetchUserSpaces() {
    return apiClient.collaborationApi.getClouds();
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
    return apiClient.collaborationApi.updateCloud({
      id: space.id,
      data: {
        image: null
      }
    });
  }

  deleteSpace(space) {
    return apiClient.collaborationApi.deleteCloud({
      id: space.id
    });
  }

}

const service = new SpacesService();

export default service;
