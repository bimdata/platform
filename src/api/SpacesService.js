import { collaborationApiClient } from './index';

class SpacesService {

  fetchUserSpaces() {
    return collaborationApiClient.getClouds();
  }

  createSpace(space) {
    return collaborationApiClient.createCloud(space);
  }

  updateSpace(space) {
    return collaborationApiClient.updateCloud(space.id, {
      name: space.name
    });
  }

  removeSpaceImage(space) {
    return collaborationApiClient.updateCloud(space.id, {
      image: null
    });
  }

  deleteSpace(space) {
    return collaborationApiClient.deleteCloud(space.id);
  }

}

const service = new SpacesService();

export default service;
