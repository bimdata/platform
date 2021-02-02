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
    return fetch(`${apiClient.config.basePath}/cloud/${space.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': apiClient.config.accessToken(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: null
      })
    }).then(
      res => res.json()
    );
  }

  deleteSpace(space) {
    return apiClient.collaborationApi.deleteCloud({
      id: space.id
    });
  }

}

const service = new SpacesService();

export default service;
