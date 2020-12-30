import { collaborationApiClient } from './index';

class SpacesService {

  async fetchUserSpaces() {
    return await collaborationApiClient.getClouds();
  }

}

const service = new SpacesService();

export default service;
