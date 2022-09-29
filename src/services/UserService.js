import apiClient from "./api-client.js";

class UserService {
  fetchUserData() {
    return apiClient.collaborationApi.getSelfUser();
  }
}

const service = new UserService();

export default service;
