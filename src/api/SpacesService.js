import { collaborationApiClient } from './index';

class SpacesService {

  fetchUserSpaces() {
    return collaborationApiClient.getClouds();
  }

  createSpace(space) {
    return collaborationApiClient.createCloud(space);
  }

  updateSpace(space) {
    return collaborationApiClient.updateCloud(space.id, space);
  }

  deleteSpace(space) {
    return collaborationApiClient.deleteCloud(space.id);
  }

}

const service = new SpacesService();

export default service;
